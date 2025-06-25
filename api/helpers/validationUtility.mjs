import mongoose from 'mongoose';

// Helper to safely access nested fields like "contact.name"
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Validate missing fields (supports nested like "goods_details.bill_no")
export const validateRequiredFields = (requiredFields, body) => {
  const missing = requiredFields.filter(field => {
    const value = getNestedValue(body, field);
    return value === undefined || value === null || value === '';
  });
  return missing;
};

// Validate ObjectId fields
export const validateObjectIdFields = (idFields, body) => {
  const invalid = idFields.filter(field => {
    const value = getNestedValue(body, field);
    return value && !mongoose.Types.ObjectId.isValid(value);
  });
  return invalid;
};

// Duplicate record check
export const checkDuplicate = async (model, uniqueFields) => {
  const query = {};
  for (const key in uniqueFields) {
    query[key] = uniqueFields[key];
  }
  const existing = await model.findOne(query);
  return existing;
};
