import * as Yup from 'yup';

export const consigneeSchema = Yup.object().shape({
  name: Yup.string().required('Consignee name is required'),
});
