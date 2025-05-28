import express from 'express';
import {
  // eslint-disable-next-line max-len
  getItems, archiveItem, searchItemByName, copyItem, getArchivedItems, createItem, updateItem, getItemById,deleteItem,
  updateItemsWithIds,
  createItems
} from '../controllers/items.mjs';
import {
  // eslint-disable-next-line max-len
  createCategory, updateCategory, getCategoryById, getCategories, archiveCategory, deleteSubcategory, searchCategory, copyCategory, getArchivedCategories, deleteCategory, getSubcategories,
} from '../controllers/categories.mjs';
import {
  addTax, getTax, getTaxById, updateTax, archiveTax, getArchivedTax, deleteTax, searchTax,
} from '../controllers/taxes.mjs';

import { authCheck } from '../middlewares/authCheck.js';
const router = express.Router();
router.use(authCheck)
// item routes
router.get('/', getItems);
router.get('/archiveditems', getArchivedItems);
router.patch('/:itemId', archiveItem);
router.get('/searchitem', searchItemByName);
router.post('/:itemId/copy', copyItem);
router.post('/', createItem);
router.put('/:itemId', updateItem);
router.delete('/:itemId', deleteItem); // Add the route for deleteItem
// categories routes
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id/subcategories/:subcategoryId', updateCategory);
router.get('/categories', getCategories);
router.patch('/categories/:categoryId', archiveCategory);
router.delete('/categories/:categoryId/subcategories/:subcategoryId', deleteSubcategory);
router.get('/search', searchCategory);
router.post('/categories/:categoryId/copy', copyCategory);
router.get('/archived', getArchivedCategories);
router.delete('/categories/:categoryId', deleteCategory);

router.get('/categories/:categoryId/subcategories/:subcategoryId', getSubcategories);
// taxes routes
router.post('/taxes', addTax);
router.put('/taxes/:id', updateTax);
router.get('/taxes', getTax);
router.patch('/taxes/:taxId', archiveTax);
router.get('/taxes/archived', getArchivedTax);
router.delete('/taxes/:taxId', deleteTax);

router.get('/taxes/search', searchTax);
router.get('/taxes/:id', getTaxById);
router.get('/:itemId', getItemById);

router.post('/check-new-items', updateItemsWithIds);
router.post('/create-items', createItems);
export default router;
