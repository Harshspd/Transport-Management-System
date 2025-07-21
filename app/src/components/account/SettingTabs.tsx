"use client";
import { Estimate, Invoice, Notification, Shield, User3 } from "@/icons";
import React, { useState } from "react";
import AccountSetting from "./AccountSetting";
import AccountSecurity from "./AccountSecurity";
import Button from "../ui/button/Button"; // Make sure this is a regular styled <button />

const tabs = [
  { label: "Account", icon: User3 },
  { label: "Account Security", icon: Shield },
  { label: "Shipping Settings", icon: Invoice },
  { label: "Notifications", icon: Notification },
];

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("Account");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <div className="flex space-x-6 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <Button
                key={tab.label}
                onClick={() => handleTabClick(tab.label)}
                className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-black dark:text-white border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-black dark:text-white/60 dark:hover:text-white border-b-2 border-transparent"
                }`}
              >
                <tab.icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "fill-blue-500 dark:fill-blue-400"
                      : "fill-gray-400 dark:fill-white/60"
                  }`}
                />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "Account" && <AccountSetting />}
        {activeTab === "Account Security" && <AccountSecurity />}
        {activeTab === "Shipping Settings" && <p>Shipping Settings</p>}
        {activeTab === "Notifications" && (
          <p>
            Render <strong>Notifications</strong>
          </p>
        )}
      </div>
    </div>
  );
}
