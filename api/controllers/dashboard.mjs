import mongoose from 'mongoose';
import Invoice from '../models/Invoice.mjs';
import Estimate from '../models/Estimate.mjs';
import Client from '../models/Client.mjs';
import Account from '../models/Account.mjs';
import Item from '../models/Item.mjs';
import Purchase from '../models/Purchase.mjs';
import UtilityService from '../services/UtilityService.mjs';

/**
 *
 * Fetch system summary for the Dashbaoard for the give period
 * @param {*} req
 * @param {*} res
 */
// TODO: Filter data by daterange instead of days (current year, Previous year ,
//  last 30 days, Last 7 days , Last 6 months)
export const fetchSystemSummary = async (req, res) => {
  try {
    const { days } = req.query;
    const accountId = req.user.account_id;

    const dateFilter = UtilityService.getDateRangeForDays(days, 'created_on');
    // TODO: Fetch the count of clients, items, invoices, estimates, and purchases
    // for the given date range based on created_on field
    const [clientsCount, itemsCount, invoicesCount, estimateCount, purchaseCount] = await Promise.all([
      Client.countDocuments({ ...dateFilter, account_id: accountId, archived: false }),
      Item.countDocuments({ ...dateFilter, account_id: accountId, archived: false }),
      Invoice.countDocuments({ ...dateFilter, account: accountId, archived: false }),
      Estimate.countDocuments({ ...dateFilter, account: accountId, archived: false }),
      Purchase.countDocuments({ ...dateFilter, account: accountId, archived: false }),
    ]);
    res.status(200).json({
      clients: clientsCount, items: itemsCount, invoices: invoicesCount, estimateCount, purchaseCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching summary.' });
  }
};

/**
 * Return totota revenue for the given period , paid , pending and overdue invoices 
 * for the given period
 * @param {*} req
 * @param {*} res
 */

// TODO : Rename the function to getInvoiceSummary
export const getlatestInvoices = async (req, res) => {
  try {
    const { days } = req.query;
    const accountId = req.user.account_id;

    const dateFilter = UtilityService.getDateRangeForDays(days, 'created_on');
    const invoices = await Invoice.find({
      ...dateFilter,
      account: accountId,
      archived: false,
    })
      .select('invoice_number status total amount_due due_date')
      .populate('client.client_id', 'name')
      .populate({
        path: 'currency',
        select: 'currency',
      })
      .sort({ updated_on: -1 });

    res.json(invoices);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching invoices' });
  }
};

/**
 * Get the invoices for the given period gouped by month with sum total of 
 * total amount, and paid amount and pending amount
 * @param {*} req
 * @param {*} res
 */
export const getRevenueSummaryForThePeriod = async (req, res) => {
  try {
    // Extract mode and fiscal year configuration from request (if available)
    let { startDate, endDate } = req.query;

    // Convert startDate and endDate to Date objects
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: "Invalid date format for startDate or endDate." });
    }
    if(startDate>endDate)
      return res.status(400).json({ error: "Start Date cannot be greater than EndDate" });
    // Generate a list of months within the date range
    console.log(startDate, endDate);
    const months = [];
    const tempDate = new Date(startDate);

    while (tempDate <= endDate) {
      months.push({ year: tempDate.getFullYear(), month: tempDate.getMonth() + 1 });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    console.log("Months:", months);

    // Aggregate revenue data from the database
    const monthlySummary = await Invoice.aggregate([
      {
        $match: {
          issued_date: { $gte: startDate, $lt: endDate },
          account: new mongoose.Types.ObjectId(req.user.account_id),
        },
      },
      {
        $addFields: {
          revenueWithoutTax: {
            $cond: {
              if: { $gt: ['$total_payment', 0] },
              then: { $subtract: ['$total_payment', { $ifNull: ['$tax_total', 0] }] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$issued_date' },
            month: { $month: '$issued_date' },
          },
          count: { $sum: 1 },
          total: { $sum: '$total' },
          paid: {
            $sum: {
              $cond: [{ $gt: ['$total_payment', 0] }, '$total_payment', 0],
            },
          },
          revenue: { $sum: '$revenueWithoutTax' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          total: 1,
          paid: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // Merge the results with the list of months
    const mergedSummary = months.map(({ year, month }) => {
      const data = monthlySummary.find(
        (item) => item.year === year && item.month === month
      );
      return {
        year,
        month,
        count: data ? data.count : 0,
        total: data ? data.revenue : 0,
        paid: data ? data.paid : 0,
      };
    });

    res.status(200).json(mergedSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
};


// TODO: remove this function and reuse the function from estimate controller and enhance that function
// to match the condition of sort by updated_on and limit to 10


/**
 * Show the top 10 clients based on total amount invoiced for the given year
 * @param {*} req
 * @param {*} res
 */

export const getTopClientsByTotalInvoicedAmount = async (req, res) => {
  try {
    const endDate = new Date(); // Current date
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12); // 12 months back
    const topClients = await Invoice.aggregate([
      {
        $match: {
          issued_date: { $gte: startDate, $lt: endDate },
          account: new mongoose.Types.ObjectId(req.user.account_id),
          archived: false, // Exclude archived invoices
        },
      },
      {
        $group: {
          _id: '$client.client_id',
          totalAmount: { $sum: '$total_payment' }, // Total of all invoices (paid or unpaid)
          invoiceCount: { $sum: 1 }, // Count of all invoices
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
      {
        $project: {
          clientName: '$client.name',
          totalAmount: 1,
          invoiceCount: 1,
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by totalAmount in descending order
      },
      {
        $limit: 10, // Top 10 clients
      },
    ]);

    res.status(200).json(topClients);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching client insights.' });
  }
};

export const getInvoiceStatistics = async (req, res) => {
  try {
    const { days } = req.query; // Filter days if provided
    const accountId = new mongoose.Types.ObjectId(req.user.account_id); // Convert to ObjectId

    // Calculate date range based on days
    const dateFilter = UtilityService.getDateRangeForDays(days, 'created_on');

    const currentDate = new Date();

    // MongoDB aggregation pipeline
    const statistics = await Invoice.aggregate([
      // Filter invoices based on account, date range, and archived status
      { $match: { ...dateFilter, account: accountId, archived: false } },

      // Lookup currency details from the Country model
      {
        $lookup: {
          from: "countries", // Collection name for the Country model
          localField: "currency", // Field in Invoice referencing the country
          foreignField: "_id", // Field in Country to match
          as: "currencyDetails",
        },
      },

      // Unwind the currencyDetails array to access its fields
      { $unwind: { path: "$currencyDetails", preserveNullAndEmptyArrays: true } },

      // Project necessary fields and compute additional fields for grouping
      {
        $project: {
          status: 1,
          total: 1,
          amount_due: 1,
          due_date: 1,
          currency: { $ifNull: ["$currencyDetails.currency", "Other"] }, // Use "Other" if no match found
          isOverdue: { $lt: ["$due_date", currentDate] }, // Check if overdue
          isPartialPaid: { $eq: ["$status", "Partial Paid"] }, // Check if partially paid
        },
      },

      // Add computed status categories for grouping
      {
        $addFields: {
          groupStatus: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "Paid"] }, then: "Paid" },
                { case: { $and: ["$isPartialPaid", "$isOverdue"] }, then: "Overdue" },
                { case: { $and: ["$isPartialPaid", { $not: "$isOverdue" }] }, then: "Pending" },
                { case: { $and: [{ $ne: ["$status", "Paid"] }, "$isOverdue"] }, then: "Overdue" },
                { case: { $and: [{ $ne: ["$status", "Paid"] }, { $not: "$isOverdue" }] }, then: "Pending" },
              ],
              default: "Total",
            },
          },
        },
      },

      // Group by status and currency
      {
        $group: {
          _id: { groupStatus: "$groupStatus", currency: "$currency" },
          totalAmount: { $sum: "$total" },
          totalDue: { $sum: "$amount_due" },
          count: { $sum: 1 },
        },
      },

      // Reshape the result for easier frontend processing
      {
        $group: {
          _id: "$_id.groupStatus",
          currencies: {
            $push: {
              currency: "$_id.currency",
              totalAmount: "$totalAmount",
              totalDue: "$totalDue",
              count: "$count",
            },
          },
        },
      },

      // Final formatting for the frontend
      {
        $project: {
          label: "$_id",
          values: "$currencies",
          _id: 0,
        },
      },
    ]);

    // Add the count for "New" invoices separately
    const createdCount = await Invoice.countDocuments({
      account: accountId,
      status: "Created",
      archived: false,
    });

    // Append "New" category with createdCount
    statistics.push({
      label: "New",
      values: [],
      createdCount,
    });


    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error fetching invoice statistics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 
export const getEstimatedRevenue = async (req, res) => {
  try {
    const { days } = req.query;
    const dateFilter = UtilityService.getDateRangeForDays(days, 'created_on');

    // Aggregate data from the Estimate model with date filter
    const aggregatedData = await Estimate.aggregate([
      { $match: { account: new mongoose.Types.ObjectId(req.user.account_id), archived: false, ...dateFilter } },
      {
        $group: {
          _id: "$currency", // Group by currency
          totalRevenue: { $sum: "$total" }, // Adjust field name if different
          count: { $sum: 1 }, // Optional: Count number of documents per group
        },
      },
      {
        $lookup: {
          from: 'countries', // Collection name for the Country model
          localField: '_id', // Field in Estimate referencing the country
          foreignField: '_id', // Field in Country to match
          as: 'currencyDetails',
        },
      },
      {
        $unwind: '$currencyDetails',
      },
      {
        $project: {
          _id: 0, // Exclude the default MongoDB _id field
          currency: '$currencyDetails.currency', // Rename _id to currency
          totalRevenue: 1,
          count: 1,
        },
      },
    ]);

    // Respond with aggregated data
    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error("Error fetching estimated revenue:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};