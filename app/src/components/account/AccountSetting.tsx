'use client';
import { useAuth } from '@/middleware/auth/AuthContext';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { ChevronDownIcon, Document, Email, FiscY, Location, PhoneIcon, Reg2, User2 } from '@/icons';
import Select from '../form/Select';
import DropzoneComponent2 from '../form/form-elements/DropZone2';
import DropzoneComponent from '../form/form-elements/DropZone';

const initialValues = {
  company: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  website: '',
  info: '',
  gst: '',
  pan: '',
  regNo: '',
  fiscalYear: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  country: '',
  zip: '',
};

const validationSchema = Yup.object({
  company: Yup.string().required('Company is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  website: Yup.string().url('Invalid URL'),
  info: Yup.string(),
  gst: Yup.string()
    .matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/, 'Invalid GST number')
    .required('GST number is required'),
  pan: Yup.string()
    .matches(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, 'Invalid PAN number')
    .required('PAN number is required'),
  regNo: Yup.string().required('Registration number is required'),
  fiscalYear: Yup.string().required('Fiscal year is required'),
  address1: Yup.string().required('Address Line 1 is required'),
  address2: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zip: Yup.string().matches(/^[0-9]{6}$/, 'Invalid Postal Code'),
});

const AccountSetting = () => {
  const { user } = useAuth();
  const handleSubmit = (values: any,actions:any) => {
    console.log('Form Submitted', values);
     actions.resetForm();  
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-1/3 border border-gray-200 p-6 rounded-xl bg-white dark:bg-gray-900">
            <DropzoneComponent2 />
            <div className="mt-4 ml-8 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {values.firstName || 'Welcome'} {values.lastName || 'User'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {values.company || '10xTech'}
              </p>
            </div>

            <div className="mt-6 space-y-4"> {[{ icon: <Email />, Label: "Email", value: values.email || "Not specified" }, { icon: <PhoneIcon />, Label: "Phone", value:values.phone || "Not specified" }, { icon: <Location />, Label: "Location", value: values.state || "Not specified" ,value2:values.country || "Not specified"}, { icon: <Document />, Label: "GST Number", value:values.gst || "Not specified" }, { icon: <Reg2 />, Label: "PAN Number", value:values.pan || "Not specified" }, { icon: <FiscY />, Label: "Fiscal Year", value: "1-12" }, { icon: <User2 />, Label: "Registration Number", value: values.regNo ||"Not specified" },].map(({ icon, Label, value,value2 }, i) => (<div key={i} className="flex items-start gap-3"> <div className="w-5 h-5 text-gray-500 dark:text-gray-300 mt-1">{icon}</div> <div> <p className="text-xs text-gray-500 dark:text-gray-400">{Label}</p> <p className="text-sm font-medium text-gray-700 dark:text-white">{value}</p>  {value2 && (
          <p className="text-sm font-medium text-gray-700 dark:text-white">{value2}</p>
        )}</div> </div>))} </div>
          </div> 

          <div className="w-full lg:w-2/3 p-1 pl-8 bg-white dark:bg-gray-900">
            <h2 className="text-base font-md text-gray-800 dark:text-white mb-4">Organization Profile</h2>

            <div className="space-y-4">
              <div>
                <Label>Company</Label>
                <Field as={Input} name="company" placeholder="Company" />
                <ErrorMessage name="company" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Field as={Input} name="firstName" placeholder="First Name" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Field as={Input} name="lastName" placeholder="Last Name" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Field as={Input} name="phone" placeholder="Phone" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Field as={Input} name="email" placeholder="Email" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Website</Label>
                  <Field as={Input} name="website" placeholder="Website" />
                  <ErrorMessage name="website" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Info</Label>
                  <Field as={Input} name="info" placeholder="Info" />
                </div>
              </div>

              <h2 className="text-base font-md text-gray-800 dark:text-white mb-4">Account Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GST No.</Label>
                  <Field as={Input} name="gst" placeholder="GST No." />
                  <ErrorMessage name="gst" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>PAN No.</Label>
                  <Field as={Input} name="pan" placeholder="PAN No." />
                  <ErrorMessage name="pan" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Registration No.</Label>
                  <Field as={Input} name="regNo" placeholder="Registration No." />
                  <ErrorMessage name="regNo" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Fiscal Year</Label>
                  <div className="relative">
                    <Select
                      options={[
                        { label: 'Jan - Dec (1 - 12)', value: '1-12' },
                        { label: 'Apr - Mar (4 - 3)', value: '4-3' },
                        { label: 'Jul - Jun (7 - 6)', value: '7-6' },
                      ]}
                      placeholder="Select Fiscal Year"
                      value={values.fiscalYear}
                      onChange={(val: string) => setFieldValue('fiscalYear', val)}
                    />
                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                      <ChevronDownIcon />
                    </span>
                  </div>
                  <ErrorMessage name="fiscalYear" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Address Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Address Line 1</Label>
                  <Field as={Input} name="address1" placeholder="Address Line 1" />
                  <ErrorMessage name="address1" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Field as={Input} name="address2" placeholder="Address Line 2" />
                </div>
                <div>
                  <Label>City</Label>
                  <Field as={Input} name="city" placeholder="City" />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>State</Label>
                  <Field as={Input} name="state" placeholder="State" />
                  <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Field as={Input} name="zip" placeholder="Postal Code" />
                  <ErrorMessage name="zip" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label>Country</Label>
                  <div className="relative">
                    <Select
                      options={[
                        { label: 'India', value: 'India' },
                        { label: 'United States', value: 'USA' },
                        { label: 'United Kingdom', value: 'UK' },
                        { label: 'Canada', value: 'Canada' },
                        { label: 'Australia', value: 'Australia' },
                        { label: 'Germany', value: 'Germany' },
                      ]}
                      placeholder="Select Country"
                      value={values.country}
                      onChange={(val: string) => setFieldValue('country', val)}
                    />
                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                      <ChevronDownIcon />
                    </span>
                  </div>
                  <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AccountSetting;
