'use client';

import { useAuth } from '@/middleware/auth/AuthContext';
import React, { useState } from 'react';
import Label from '../form/Label';
import { Formik, Form, Field } from 'formik';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

const AccountSecurity = () => {
  const { user } = useAuth();
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const initialEmailValues = { email: '' };
  const initialPasswordValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleEmailSubmit = (values: any) => {
    console.log('Submitted Email:', values);
    setEditEmail(false);
  };

  const handlePasswordSubmit = (values: any) => {
    console.log('Password Change Submitted:', values);
    setEditPassword(false);
  };

  return (
    <div className="w-full space-y-8">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Account Settings
      </h2>

      <hr className="w-full border-t border-gray-200 dark:border-white/10" />

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Account Email
        </Label>

        {editEmail ? (
          <Formik initialValues={initialEmailValues} onSubmit={handleEmailSubmit}>
            {() => (
              <Form className="space-y-2 w-1/2">
                <Field as={Input} name="email" placeholder="Enter new email" />
                <Button>Send OTP</Button>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <span className="text-sm text-gray-800 dark:text-white block mb-2">
              {user?.email}
            </span>
            <Button variant="outline"onClick={() => setEditEmail(true)}>
              Change Email
            </Button>
          </div>
        )}
      </div>

      {/* PASSWORD SECTION */}
      <hr className="w-full border-t border-gray-200 dark:border-white/10" />

      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Change Password
      </Label>

      {editPassword ? (
        <Formik initialValues={initialPasswordValues} onSubmit={handlePasswordSubmit}>
          {() => (
            <Form className="space-y-2 w-1/2">
              <Field
                as={Input}
                name="currentPassword"
                placeholder="Current Password"
                type="password"
              />
              <Field
                as={Input}
                name="newPassword"
                placeholder="New Password"
                type="password"
              />
              <Field
                as={Input}
                name="confirmPassword"
                placeholder="Confirm New Password"
                type="password"
              />
              <Button>Update Password</Button>
            </Form>
          )}
        </Formik>
      ) : (
        <div>
          <span className="text-sm text-gray-800 dark:text-white block mb-2">
            ********
          </span>
          <Button variant="outline" onClick={() => setEditPassword(true)}>
            Change Password
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountSecurity;
