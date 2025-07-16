"use client";
import { Estimate, Invoice, Notification, Shield, User3 } from "@/icons";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
   { label: "Account", icon: User3 },
  { label: "Account Security", icon: Shield },
  { label: "Shipping Settings", icon: Invoice },
  // { label: "Estimate", icon: Estimate },
  { label: "Notifications", icon: Notification },
];

export default function SettingsTabs() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const activeTab = searchParams.get("tab") || "Account";

  const handleTabClick = (tabLabel: string) => {
    router.push(`?tab=${tabLabel}`);
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 dark:border-white/10">
        <div className="flex space-x-6 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab.label)}
              className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors
                ${
                  activeTab === tab.label
                    ? "text-black dark:text-white border-b-3 border-blue-500"
                    : "text-gray-500 hover:text-black dark:text-white/60 dark:hover:text-white"
                }`}
            >
              <tab.icon className='w-4 h-4 fill-gray-500 dark:fill-white' />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
      
      </div>
    </div>
  );
}
