import stringSimilarity from 'string-similarity';
import Item from '../models/Item.mjs';
import UtilityService from './UtilityService.mjs';

class ItemService {
  validateItems(items) {
    const errorMap = {};

    items.forEach((item, index) => {
      const {
        name, quantity, costPrice, salePrice, expDate, mfgDate,
      } = item;

      const addError = (message) => {
        if (!errorMap[index]) {
          errorMap[index] = [];
        }
        errorMap[index].push(message);
      };

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        addError('Item name is required and must be a non-empty string.');
      }

      if (!quantity || !parseInt(quantity)) {
        addError('Valid item quantity is required.');
      }

      if (!costPrice || !parseFloat(costPrice)) {
        addError('Item Cost price is required.');
      }
      if (!salePrice || !parseFloat(salePrice)) {
        addError('Item Sale price is required.');
      }

      if (!!expDate && !UtilityService.validateDate(expDate)) {
        addError('Invalid expiration date. Expiration date must be a valid date in YYYY-MM-DD format.');
      }

      if (!!mfgDate && !UtilityService.validateDate(mfgDate)) {
        addError('Invalid manufacturing date. Manufacturing date must be a valid date in YYYY-MM-DD format.');
      }

      if (new Date(mfgDate) >= new Date(expDate)) {
        addError('Manufacturing date cannot be later than or equal to expiration date.');
      }
    });

    // If any errors were found, return the errors grouped by index
    if (Object.keys(errorMap).length > 0) {
      return errorMap;
    }
    return null;
  }

  async processAndValidateItems(items, account_id) {
    const itemsData = await Item.find({ account_id }).populate('taxes');
    return Promise.all(
      items.map(async (itemData) => {
        const item = await this.findOrCreateItem(itemData, itemsData, account_id);
        // Populate the item details
        return {
          item: item._id,
          quantity: itemData.quantity || 1, // Default quantity to 1 if not provided
          line_total: (itemData.quantity || 1) * (itemData.price || item.price),
          name: item.name,
          description: item.description,
          price: itemData.price || item.price,
          itemTax: item.taxes,
          taxable:item.taxable
        };
      }),
    );
  }

  async findOrCreateItem(itemData, items, account_id) {
    try {
      if (items.length === 0) {
        const newItem = new Item({
          name: itemData.name,
          description: itemData.description || '',
          price: itemData.price || 0,
          taxes: itemData.itemTax || [],
          account_id,
        });
        await newItem.save();
        return newItem; // Return newly created item
      }

      // Extract item names for fuzzy matching
      const itemNames = items.map((item) => item.name);

      // Find the closest match using string similarity
      const bestMatch = stringSimilarity.findBestMatch(itemData.name, itemNames);

      // Similarity threshold to determine if a match is found
      const similarityThreshold = 0.8; // You can adjust this threshold as needed

      if (bestMatch.bestMatch.rating >= similarityThreshold) {
        // Find the item with the closest name match
        const matchedItem = items.find((item) => item.name === bestMatch.bestMatch.target);
        return matchedItem; // Return matched item
      }

      // If no sufficient match is found, create a new item
      const newItem = new Item({
        name: itemData.name,
        description: itemData.description || '',
        price: itemData.price || 0,
        taxes: itemData.itemTax || [],
        account_id,
      });
      await newItem.save();
      return newItem; // Return newly created item
    } catch (error) {
      console.error('Error finding or creating item:', error);
      throw new Error('Error processing item');
    }
  }
}
export default new ItemService();
