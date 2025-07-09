import type { Metadata } from "next";
// import ShipmentForm from "@/components/ShipmentForm";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";

export const metadata: Metadata = {
  title:
    " Shipment Booking",
  description: "HomePage of Shipment Booking portal",
};

export default function Ecommerce() {
  
  return (
     <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}


