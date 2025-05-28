/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import Category from '../models/Category.mjs';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required for creating a category' });
    }

    const existingCategory = await Category.findOne({ name, account_id:req.user.account_id});
    if (existingCategory) {
      return res.status(400).json({ success: false, error: `Category with name ${name} already exists` });
    }

    const newCategory = new Category(req.body);
    newCategory.account_id=req.user.account_id
    const savedCategory = await newCategory.save();
    return res.status(201).json({ success: true, category: savedCategory });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'Internal server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subcategories } = req.body;
    if (!name || name === '') {
      return res.status(400).json({
        success: false,
        error: 'Name is required for updating a category',
      });
    }
    const category = await Category.findOne({_id:id,account_id:req.user.account_id});
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }
    category.name = name;
    if (subcategories && subcategories.length > 0) {
      category.subcategories = subcategories;
    }
    await category.save();
    return res.json({
      success: true,
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal server error',
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ archived: false,account_id:req.user.account_id });
    return res.json(categories);
  } catch (err) {
    return res.status(400).json({ error: err.message, message: 'Failed to get categories' });
  }
};

export const archiveCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { archived } = req.body; // Get the 'archived' value from the request body

    const categoryArchive = await Category.findOne({_id:categoryId,account_id:req.user.account_id});
    if (!categoryArchive) {
      return res.status(404).json({ error: 'Category not found' });
    }

    categoryArchive.archived = archived; // Set the 'archived' property based on the request body

    const updatedCategory = await categoryArchive.save();
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to update category archive status' });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    const category = await Category.findOne({_id:categoryId,account_id:req.user.account_id});

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const subcategory = category.subcategories.find((x) => x._id.equals(subcategoryId));
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }
    category.subcategories = category.subcategories.filter((x) => !x._id.equals(subcategoryId));
    await category.save();
    return res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete subcategory', error: error.message });
  }
};

export const searchCategory = async (req, res) => {
  try {
    const { name } = req.query;

    const categories = await Category.find({ name: { $regex: new RegExp(name, 'i') },account_id:req.user.account_id });

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'No categories found with the provided name' });
    }

    return res.status(200).json({ success: true, message: 'Category retrieved successfully', categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to search category by name', error: error.message });
  }
};

export const copyCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryToCopy = await Category.findOne({_id:categoryId,account_id:req.user.account_id});

    if (!categoryToCopy) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newCategory = new Category({
      name: `${categoryToCopy.name} copy`,

    });

    const savedCategory = await newCategory.save();

    return res.status(201).json(savedCategory);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to copy category' });
  }
};

export const getArchivedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ archived: true,account_id:req.user.account_id });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to get archived categories' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findOneAndDelete({_id:categoryId,account_id:req.user.account_id});

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message, message: 'Failed to delete category' });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findOne({_id:categoryId,account_id:req.user.account_id});

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { subcategories } = category;

    return res.status(200).json({ success: true, subcategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve subcategories', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({_id:id,account_id:req.user.account_id});
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: 'Internal server error' });
  }
};
