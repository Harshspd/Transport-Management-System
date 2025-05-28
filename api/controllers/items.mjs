import Item from '../models/Item.mjs';
import Category from '../models/Category.mjs';
import { sendErrorResponse } from '../helpers/responseUtility.mjs';
import UtilityService from '../services/UtilityService.mjs';
import ItemService from '../services/ItemService.mjs';

export const createItem = async (req, res) => {
  try {
    const { name, category } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: 'Item name is required' });
    }

    // Check if an item with the same name already exists
    const existingItem = await Item.findOne({
      name,
      account_id: req.user.account_id,
    });
    if (existingItem) {
      return res.status(400).json({ message: 'Item name already exists' });
    }



    // Create the item
    const newItem = new Item({
      ...req.body,
      category,
      account_id: req.user.account_id,
    });

    // Save the item to the database
    await newItem.save();

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const {
      name,
      description,
      hsncode,
      sku,
      category,
      subcategory,
      cost,
      price,
      taxable,
      archived,
      taxes,
      taxMode,
    } = req.body;
    
    // Retrieve the item from the database
    const item = await Item.findOne({
      _id: itemId,
      account_id: req.user.account_id,
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update the item properties only if they are provided in the request body
    if (name) item.name = name;
    if (description) item.description = description;
    if (hsncode) item.hsncode = hsncode;
    if (sku) item.sku = sku;
    if (category) item.category = category;
    if (taxMode) item.taxMode = taxMode;
    if (subcategory) item.subcategory = subcategory;
    if (cost) item.cost = cost;
    if (price) item.price = price;
    if (taxable !== undefined) item.taxable = taxable;
    if (archived !== undefined) item.archived = archived;
    if (taxes) item.taxes = taxes;

    // Save the updated item
    const updatedItem = await item.save();

    return res.status(200).json(updatedItem);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to edit item' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOne({
      _id: itemId,
      account_id: req.user.account_id,
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to get item by ID' });
  }
};

export const copyItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const itemToCopy = await Item.findOne({
      _id: itemId,
      account_id: req.user.account_id,
    });

    if (!itemToCopy) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newItem = new Item({
      name: `${itemToCopy.name} copy`,
      account_id: req.user.account_id,
    });

    const savedItem = await newItem.save();

    return res.status(201).json(savedItem);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to copy item' });
  }
};

export const archiveItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { archived } = req.body;

    const itemArchive = await Item.findOne({
      _id: itemId,
      account_id: req.user.account_id,
    });
    if (!itemArchive) {
      return res.status(404).json({ error: 'Item not found' });
    }

    itemArchive.archived = archived;

    const updatedItem = await itemArchive.save();
    return res.status(200).json(updatedItem);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to archive Item' });
  }
};

export const searchItemByName = async (req, res) => {
  try {
    const { name } = req.query;
    const items = await Item.find({
      name: { $regex: new RegExp(name, 'i') },
      account_id: req.user.account_id,
    }).populate('category');
    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No items found with the provided name',
      });
    }
    return res
      .status(200)
      .json({ success: true, message: 'Items retrieved successfully', items });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to search item by name',
      error: error.message,
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({
      archived: false,
      account_id: req.user.account_id,
    }).populate('category');
    return res.json(items);
  } catch (err) {
    return res
      .status(400)
      .json({ error: err.message, message: 'Failed to get items' });
  }
};

export const getArchivedItems = async (req, res) => {
  try {
    const items = await Item.find({
      archived: true,
      account_id: req.user.account_id,
    }).populate('category');
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to get archived items' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Item.findOneAndDelete({
      _id: itemId,
      account_id: req.user.account_id,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, message: 'Failed to delete item' });
  }
};
export const updateItemsWithIds = async (req, res) => {
  const items = req.body;
  const { account_id } = req.user;

  if (!Array.isArray(items) || !items.length) {
    return sendErrorResponse(
      res,
      "Items required",
      "Something Went Wrong",
      400
    );
  }

  const errors = ItemService.validateItems(items);

  try {
    const normalizeName = (name) => {
      if (!name) return ""; // Handle undefined or null name
      return name.replace(/\s+/g, "").toLowerCase();
    };

    const names = items.map((item) => normalizeName(item.name));

    // Find all items in the account and populate taxes
    const existingItems = await Item.find({ account_id })
      .select("name _id taxes")
      .populate("taxes");

    const existingNameMap = {};
    existingItems.forEach((item) => {
      const normalizedDbName = normalizeName(item.name);
      existingNameMap[normalizedDbName] = {
        id: item._id,
        taxes: item.taxes || [], // Store taxes or default to an empty array
      };
    });

    // Map items and update taxes based on the normalized name
    const updatedItems = await Promise.all(
      items.map(async (item, index) => {
        const normalizedItem = existingNameMap[normalizeName(item.name)] || {};
        const updatedItem = {
          ...item,
          id: normalizedItem.id || null, // Add id or null if not found
          error: errors[index],
        };

        // If the item exists
        if (updatedItem.id) {
          // If item.taxes is missing, use existing taxes from DB or empty array if none exist
          const taxIds = item.taxes && item.taxes.length > 0 
            ? item.taxes.map((tax) => tax.id) // Use provided tax IDs if available
            : normalizedItem.taxes.map((tax) => tax._id); // Use existing taxes from DB if available, else empty array

          await Item.findByIdAndUpdate(updatedItem.id, {
            taxes: taxIds, // Update taxes with an array of ObjectId references
          });

          // Attach populated taxes to updatedItem for returning in the response
          updatedItem.taxes = taxIds;
        } else {
          // If item doesn't exist, return provided taxes or an empty array if none are found
          updatedItem.taxes = item.taxes || [];
        }

        return updatedItem;
      })
    );

    // Fetch updated items with populated taxes for the response
    const updatedItemIds = updatedItems.map((item) => item.id).filter((id) => id);
    const populatedUpdatedItems = await Item.find({ _id: { $in: updatedItemIds } })
      .populate("taxes")
      .lean(); // Convert Mongoose document to plain JS object

    // Merge the populated tax data with the updatedItems array
    const finalUpdatedItems = updatedItems.map((item) => {
      const populatedItem = populatedUpdatedItems.find(
        (populated) => populated._id?.toString() === item.id?.toString()
      );
      return {
        ...item,
        taxes: populatedItem?.taxes || item.taxes || [], // Use populated taxes, or provided taxes if item doesn't exist
      };
    });

    return res.status(200).json({ data: finalUpdatedItems });
  } catch (error) {
    console.error("Error updating item taxes:", error);
    return sendErrorResponse(res, "Server Error", "Something Went Wrong", 500);
  }
};

export const createItems = async (req, res) => {
  try {
    const { account_id } = req.user;
    let items = req.body;

    if (!Object.keys(items)?.length) {
      return sendErrorResponse(
        res,
        'Items required',
        'Something Went Wrong',
        400,
      );
    }

    // Filter out items without a name
    items = items.filter((x) => x.name && x?.name !== '');

    // Prepare valid items for database insertion
    const validItems = items.map((item) => ({
      name: item.name,
      sku: item?.sku,
      category: item?.category,
      hsncode: item.hsncode,
      taxable: !!item?.taxes?.length,
      taxes: item?.taxes,
      account_id,
      isBatchInventory:!!item?.batchNo,
      type:'goods'
    }));

    // Insert items into the database
    const createdItems = await Item.insertMany(validItems);

    // Populate the taxes field for the created items
    const populatedItems = await Item.find({
      _id: { $in: createdItems.map((item) => item._id) },
    })
      .populate('taxes')
      .exec();

    // Attach batch, pricing details, and errors for each created item
    const createdItemsWithBatch = populatedItems.map((createdItem, index) => {
      const itemData = items[index]; // Get corresponding item data from the request body
      return {
        ...createdItem.toObject(), // Convert the document to a plain object
        batchNo: itemData.batchNo || null, // Attach batch and pricing details
        costPrice: itemData.costPrice || null,
        expDate: itemData.expDate || null,
        mfgDate: itemData.mfgDate || null,
        mrp: itemData.mrp || null,
        ptr: itemData.ptr || null,
        pts: itemData.pts || null,
        quantity: itemData.quantity || null,
        salePrice: itemData.salePrice || null,
        vendor: itemData.vendor || null,
        error: itemData.error || null, // Attach the error field from the request if it exists
      };
    });

    // Send the created items along with batch, pricing, and error details in the response
    res.status(201).json({ data: createdItemsWithBatch });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, 'Server Error', 'Something Went Wrong', 500);
  }
};
