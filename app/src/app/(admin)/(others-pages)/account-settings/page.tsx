"use client";
import React from "react";
import Tabs, { Tab } from "@/components/ui/tabs/Tabs";
import AccountSetting from "@/components/account/AccountSetting";
import AccountSecurity from "@/components/account/AccountSecurity";
import { User3, Shield, Invoice, Notification } from "@/icons";
import ShippingSetting from "@/components/account/ShippingSetting";

export default function AccountSettings() {
  const tabData: Tab[] = [
     {
    title: "Account Setting",
    icon: <User3 className="w-4 h-4 fill-current  dark:text-white" />, 
    content: <AccountSetting />,
  },
  {
    title: "Account Security",
    icon: <Shield className="w-4 h-4 fill-current  dark:text-white" />,
    content: <AccountSecurity />,
  },
    {
      title: "Shipping Setting",
      icon: <Invoice className="w-4 h-4 fill-current  dark:text-white" />,
      content: (
       <ShippingSetting/>
      ),
    },
    {
      title: "Notifications",
      icon: <Invoice className="w-4 h-4 fill-current  dark:text-white" />,
      content: (
        <div>
          
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <Tabs tabs={tabData} initialIndex={0} />
        </div>
      </div>
    </div>
  );
}
