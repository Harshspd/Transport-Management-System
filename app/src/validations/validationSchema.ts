import * as Yup from 'yup';

export const consigneeSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});

export const consignerSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});

export const agentSchema = Yup.object().shape({
  name: Yup.string().required('Agent name is required'),
});

// Yup Validation Schema
export const driverSchema = Yup.object().shape({
  name: Yup.string()
    .required('Driver name is required'),
  contact: Yup.object().shape({
    phone: Yup.string()
      .required('Contact phone is required')
      .matches(/^[0-9]+$/, 'Phone number must contain only digits') // Basic phone number validation
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot exceed 15 digits'),
  }),
  license_number: Yup.string().optional(),
  license_file: Yup.mixed()
  .optional()
  .test(
    'fileSize',
    'File too large (max 2MB)',
    (value): boolean => {
      if (!value) return true; // Allow empty file (optional)
      if (typeof value === 'string') return true; // If it's a string (e.g., URL from existing data), it's valid
      
      // Type guard to check if value is a File object
      if (value instanceof File) {
        return value.size <= 2 * 1024 * 1024; // 2 MB limit
      }
      
      return true; // Allow other types to pass through
    }
  ),
  // Add validation for other fields as needed
});

export const vehicleSchema = Yup.object().shape({
  vehicle_number: Yup.string().required('Vehicle Number is required'),
  rc_file: Yup.mixed()
  .optional()
  .test(
    'fileSize',
    'File too large (max 2MB)',
    (value): boolean => {
      if (!value) return true; // Allow empty file (optional)
      if (typeof value === 'string') return true; // If it's a string (e.g., URL from existing data), it's valid
      
      // Type guard to check if value is a File object
      if (value instanceof File) {
        return value.size <= 2 * 1024 * 1024; // 2 MB limit
      }
      
      return true; // Allow other types to pass through
    }
  ),
});
