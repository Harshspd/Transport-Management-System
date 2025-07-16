import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";
import UserSetting from "@/components/user-profile/UserSetting";
import SettingsTabs from "@/components/user-profile/SettingTabs";
import { redirect } from "next/navigation";
import AccountSecurity from "@/components/user-profile/AccountSecurity";

export const metadata: Metadata = {
  title: " Profile | TenXAdmin ",
  description:"This is Profile page for TenXAdmin",
};

export default function Profile({ searchParams }: { searchParams: { tab?: string } }) {
    const tab = searchParams.tab || "Account";
  return (
    <div>
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        // </h3> */}
        <SettingsTabs/>
        <div className="space-y-6">
          {/* <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard /> */}
           {tab === "Account" && <UserSetting />}
           {tab === "Account Security" && <AccountSecurity />}
        </div>
      </div>
    </div>
  );
}
