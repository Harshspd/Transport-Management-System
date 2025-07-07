import * as Yup from 'yup';

export const consigneeSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});

export const consignerSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});

export const driverSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});

export const vehicleSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});
