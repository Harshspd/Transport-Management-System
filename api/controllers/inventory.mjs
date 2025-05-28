import Inventory from '../models/Inventory.mjs';


// const updateStock = async(itemId, qty, invoiceId, type) =>{
//   try {
//     // Find the stock ledger entry
//     const stockEntry = await StockLedger.findOne({ item: itemId });

//     if (!stockEntry) {
//       throw new Error('Stock entry not found');
//     }

//     const transaction = { qty, invoiceId, transactionDate: new Date() };

//     if (type === 'in') {
//       // Handle stock addition (purchase)
//       transaction.type = 'in';
//       stockEntry.transactions.push(transaction);
//       stockEntry.qty += qty; // Update total quantity
//     } else if (type === 'out') {
//       // Handle stock removal (sale)
//       transaction.type = 'out';
//       stockEntry.transactions.push(transaction);
//       stockEntry.qty -= qty; // Update total quantity
//     }

//     // Save updated stock entry
//     await stockEntry.save();
//   } catch (error) {
//     throw new Error(`Error updating stock: ${error.message}`);
//   }
// }

// const getStock= async (itemId) =>{
//   try {
//     const stockEntry = await StockLedger.findOne({ item: itemId });
//     return stockEntry ? stockEntry.qty : 0; // Return stock quantity or 0 if not found
//   } catch (error) {
//     throw new Error(`Error retrieving stock: ${error.message}`);
//   }
// }

// const getTransactionHistory= async(itemId) =>{
//   try {
//     const stockEntry = await StockLedger.findOne({ item: itemId }).populate('transactions');
//     return stockEntry ? stockEntry.transactions : [];
//   } catch (error) {
//     throw new Error(`Error retrieving transaction history: ${error.message}`);
//   }
// }

const generateStockReportDb = async (itemNameStart = '', startDate = '', endDate = '') => {
  try {
    const nameRegex = itemNameStart ? new RegExp(`^${itemNameStart}`, 'i') : null;

    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 3));
    const end = endDate ? new Date(endDate) : new Date();

    // Fetch all items with matching names and their batch information
    const items = await Inventory.find({
      ...(nameRegex ? { 'itemId.name': { $regex: nameRegex } } : {})
    }).populate({
      path: 'itemId',
      match: nameRegex ? { name: { $regex: nameRegex } } : {}, // Match item name if regex is provided
      select: 'name hsncode' // Only include necessary fields
    }).lean();

    // Prepare the report data
    const report = items.map(item => {
      // Ensure the itemId was populated correctly before proceeding
      if (!item.itemId) return null;

      const reportData = {
        _id: {
          item: item.itemId._id,
          batchNo: null // Default value, to be set later per batch
        },
        itemName: item.itemId.name,
        hsnCode: item.itemId.hsncode,
        openingBalance: { qty: 0, price: 0, value: 0 },
        inwards: { qty: 0, price: 0, value: 0 },
        outwards: { qty: 0, price: 0, value: 0 },
        closingBalance: { qty: 0, price: 0, value: 0 }
      };

      // Iterate over batches to accumulate data
      item.batches.forEach(batch => {
        reportData._id.batchNo = batch.batchNo;

        // Calculate opening quantity and value based on purchase events before the start date
        const openingPurchases = batch.purchaseEvent.filter(pe => pe.purchaseDate < start);
        const openingSales = batch.salesEvent.filter(se => se.orderDate < start);

        const openingQty = openingPurchases.reduce((sum, pe) => sum + pe.quantity, 0) -
                           openingSales.reduce((sum, se) => sum + se.quantity, 0);
        const openingPrice = openingPurchases.length > 0 ? openingPurchases[0].price : 0;

        reportData.openingBalance.qty += openingQty;
        reportData.openingBalance.price = openingPrice || 0;
        reportData.openingBalance.value += openingQty * openingPrice;

        // Calculate inwards quantity and value based on purchase events within the date range
        const inwardsPurchases = batch.purchaseEvent.filter(pe => pe.purchaseDate >= start && pe.purchaseDate <= end);
        const inwardsQty = inwardsPurchases.reduce((sum, pe) => sum + pe.quantity, 0);
        const inwardsPrice = inwardsPurchases.length > 0 ? inwardsPurchases[0].price : 0;

        reportData.inwards.qty += inwardsQty;
        reportData.inwards.price = inwardsPrice || 0;
        reportData.inwards.value += inwardsQty * inwardsPrice;

        // Calculate outwards quantity and value based on sales events within the date range
        const outwardsSales = batch.salesEvent.filter(se => se.orderDate >= start && se.orderDate <= end);
        const outwardsQty = outwardsSales.reduce((sum, se) => sum + se.quantity, 0);
        const outwardsPrice = outwardsSales.length > 0 ? outwardsSales[0].price : 0;

        reportData.outwards.qty += outwardsQty;
        reportData.outwards.price = outwardsPrice || 0;
        reportData.outwards.value += outwardsQty * outwardsPrice;
      });

      // Calculate closing balance
      reportData.closingBalance.qty = reportData.openingBalance.qty + reportData.inwards.qty - reportData.outwards.qty;
      reportData.closingBalance.price = reportData.inwards.price || 0;
      reportData.closingBalance.value = reportData.closingBalance.qty * reportData.closingBalance.price;

      return reportData;
    }).filter(report => report !== null); // Filter out any null results from unmatched items

    return report;
  } catch (error) {
    throw new Error(`Error generating stock report: ${error.message}`);
  }
};


export const getBatchWiseInfoForItem = async (req, res) => {
  const { itemId } = req.params;
  const accountId = req.user.account_id;

  try {
    const inventory = await Inventory.findOne({ itemId, accountId })
      .populate('itemId') // Populate item details if needed
      .exec();

    if (!inventory || !inventory.batches) {
      return res.status(404).json({ message: 'No inventory or batches found for this item.' });
    }

    // Group batches by `batchNo`
    const groupedBatches = inventory.batches.reduce((acc, batch) => {
      const {
        batchNo, qty, costPrice, salePrice, mrp,
      } = batch;

      // Check if the batchNo already exists in the accumulator
      if (!acc[batchNo]) {
        acc[batchNo] = {
          batchNo,
          quantity: 0,
          hsn: inventory.itemId.hsncode, // Assuming hsncode exists on item details
          costPrice,
          salePrice,
          mrp,
        }; // Initialize group
      }

      acc[batchNo].quantity += qty; // Sum the quantity
      return acc;
    }, {});

    // Convert the grouped object back to an array
    const result = Object.values(groupedBatches);

    return res.json(result);
  } catch (error) {
    console.error('Error retrieving batch-wise information:', error);
    return res.status(500).json({ message: 'Server error. Could not retrieve batch-wise information.' });
  }
};
export const getItemHistory = async (req, res) => {
  const { itemId } = req.params;
  const accountId = req.user.account_id;

  try {
    const inventory = await Inventory.findOne({ itemId, accountId })
      .populate('itemId') // Populate item details if necessary
      .exec();

    if (!inventory || !inventory.batches) {
      return res.status(404).json({ message: 'No inventory or batches found for this item.' });
    }

    // Extract purchase and sales history from each batch
    const purchaseHistory = [];
    const salesHistory = [];

    inventory.batches.forEach(batch => {
      const {
        batchNo, costPrice, salePrice, mrp,
      } = batch;

      // Process purchase events
      batch.purchaseEvent.forEach(purchase => {
        purchaseHistory.push({
          batchNo,
          purchaseId: purchase.purchaseId,
          purchaseDate: purchase.purchaseDate,
          quantity: purchase.quantity,
          price: purchase.price,
          costPrice,
          mrp,
        });
      });

      // Process sales events
      batch.salesEvent.forEach(sale => {
        salesHistory.push({
          batchNo,
          salesId: sale.salesId,
          orderDate: sale.orderDate,
          quantity: sale.quantity,
          price: sale.price,
          salePrice,
          mrp,
        });
      });
    });

    // Structure response data
    const result = {
      itemDetails: {
        name: inventory.itemId.name,
        hsncode: inventory.itemId.hsncode,
      },
      purchaseHistory,
      salesHistory,
    };

    return res.json(result);
  } catch (error) {
    console.error('Error retrieving item history:', error);
    return res.status(500).json({ message: 'Server error. Could not retrieve item history.' });
  }
};


export const generateStockReport = async (req, res) => {
  // const { itemId } = req.params;
  const account = req.user.account_id;
  const { item ,startDate,endDate} = req.query;
  
  try {
    // Convert the grouped object back to an array
    const result = await generateStockReportDb(item,startDate,endDate);
    return res.json(result);
  } catch (error) {
    console.error('Error retrieving batch-wise information:', error);
    return res.status(500).json({ message: 'Server error. Could not retrieve batch-wise information' });
  }
};



