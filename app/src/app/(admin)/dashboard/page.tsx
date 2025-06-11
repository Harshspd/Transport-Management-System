import type { Metadata } from "next";
import ShipmentForm from "@/components/ShipmentForm"

export const metadata: Metadata = {
  title:
    " Shipment Booking",
  description: "HomePage of Shipment Booking portal",
};

export default function Ecommerce() {
  
  return (
    <div>
      <div className = "col-span-12 space-y-6 xl:col-span-7">
        <ShipmentForm />
        </div>
{/* 
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
      </div> */}
    </div>
  );
}
