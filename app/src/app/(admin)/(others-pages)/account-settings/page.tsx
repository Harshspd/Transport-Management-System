
"use client";
import React, { use, useState } from 'react';

import EditConsignee from '@/components/consignee/EditConsignee';
import Tabs,{ Tab }  from '@/components/ui/tabs/Tabs';

export default function AccountSettings() {
    const [activeTab, setActiveTab] = useState('account');
    const tabData: Tab[] = [
        {
            title: "Tab 1",
            content: <EditConsignee onSave={() => alert('Profile saved!')}></EditConsignee>,
        },
        
    ];
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <Tabs tabs={tabData} >
          </Tabs>
        </div>
      </div>
    </div>
  );
};


