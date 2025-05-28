import Item from '../models/Item.mjs';
import Inventory from '../models/Inventory.mjs';

class InventoryService {

  // Add stock to inventory (for purchases)
  async addStock(itemId, qty, batchInfo = null, purchaseId, accountId) {
    try {
      // Fetch the item and check if it's managed by batches
      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error('Item not found');
      };

      // Fetch or create the inventory entry
      let stockEntry = await Inventory.findOneAndUpdate(
        { itemId: itemId, accountId },
        { $setOnInsert: { itemId: itemId, accountId, totalAvailableStock: 0, openingStock: 0 } },
        { new: true, upsert: true }
      );

      if (!stockEntry) throw new Error('Stock entry not found');

      // If the item is batch-managed
      // TODO: add flag item.isBatchInventory
      const isBatchInventory =true;
      if (isBatchInventory) {
        const batch = this.findOrCreateBatch(stockEntry, batchInfo, qty, purchaseId);
        stockEntry.totalAvailableStock += parseInt(qty);
      } else {
        // For non-batch-managed items, just update total stock
        stockEntry.totalAvailableStock += parseInt(qty);
      }

      await stockEntry.save();
    } catch (error) {
      throw new Error(`Error adding stock: ${error.message}`);
    }
  }

  // Reduce stock from inventory (for sales)
  async reduceStock(itemId, qty, batchNo = null, salesId, accountId) {
    try {
      const item = await Item.findById(itemId);
      if (!item) throw new Error('Item not found');

      let stockEntry = await Inventory.findOne({ itemId: itemId, accountId });
      if (!stockEntry) throw new Error('Stock entry not found');

      // If the item is batch-managed
      if (item.isBatchInventory) {

        const batch = this.findBatch(stockEntry, batchNo);

       if (!batch || batch.qty < qty) throw new Error(`Insufficient stock in batch ${batchNo}`);

        // Reduce quantity from batch
        batch.qty -= qty;

        this.logSalesEvent(batch, salesId, qty, item.salePrice);

        // Remove batch if quantity reaches 0
        // if (batch.qty <= 0) {
        //  stockEntry.batches = stockEntry.batches.filter(b => b.batchNo !== batchNo);
        // }
        stockEntry.totalAvailableStock -= qty;
      } else {
        // For non-batch-managed items, just reduce total stock
         if (stockEntry.totalAvailableStock < qty) throw new Error('Insufficient stock');
        stockEntry.totalAvailableStock -= qty;
      }

      await stockEntry.save();
    } catch (error) {
      throw new Error(`Error reducing stock: ${error.message}`);
    }
  }

  // Create or find batch for the given stock entry
  findOrCreateBatch(stockEntry, batchInfo, qty, transactionId) {
    const { batchNo, expDate, costPrice, salePrice, mrp, mfgDate,purchaseDate } = batchInfo;

    let batch = stockEntry.batches.find(b => b.batchNo === batchNo);
    if (batch) {
      // Update existing batch
      batch.qty += Number(qty);
      this.logPurchaseEvent(batch, transactionId, qty, costPrice);
    } else {
      // Create a new batch
      batch = {
        batchNo,
        expDate,
        qty,
        costPrice,
        salePrice,
        mrp,
        mfgDate,
        purchaseEvent: [{
          purchaseId: transactionId,
          purchaseDate, 
          quantity: qty,
          price: costPrice,
        }],
      };
      stockEntry.batches.push(batch);
    }
    return batch;
  }

  // Find batch by batchNo in stock entry
  findBatch(stockEntry, batchNo) {
    return stockEntry.batches.find(b => b.batchNo === batchNo);
  }

  // Log purchase event in the batch
  logPurchaseEvent(batch, purchaseId, qty, price) {
    batch.purchaseEvent.push({
      purchaseId,
      purchaseDate: new Date(),
      quantity: qty,
      price,
    });
  }

  // Log sales event in the batch
  logSalesEvent(batch, salesId, qty, price) {
    batch.salesEvent.push({
      salesId: salesId,
      orderDate: new Date(),
      quantity: qty,
      price,
    });
  }
}

export default new InventoryService();
