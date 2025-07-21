import { ErrorMessage, Field, Formik } from 'formik';
import React from 'react'
import Label from '../form/Label';
import Input from '../form/input/InputField';


const initialValues = { biltynumber: '' };
const ShippingSetting = () => {
    const handleSubmit = (values: any,actions:any) => {
    console.log('Form Submitted', values);
     actions.resetForm();  
  };
  return (
    <div className="w-full space-y-8">
       <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Shipping Settings
      </h2>
      <hr className="w-full border-t border-gray-200 dark:border-white/10" />
         <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            
            <div className="space-y-4 mt-">
              <div>
                <Label>Billty Number</Label>
                <Field as={Input} name="biltynumber" placeholder="Billty Number" />
                <ErrorMessage name="biltynumber" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              </div>
         </Formik>
      </div>
  )
}

export default ShippingSetting