import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// import Badge from "@/components/ui/badge/Badge";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const shipmentData = [
    {
        bilityNo: "SHP-001",
        bilityDate: "2025-05-08",
        party: "EternoCare",
        town: "Chandigarh",
        weight: "1550",
        cases: 245,
        agent: "Chaudhary",
        deliveryDate: "2025-05-08",
        vehicleNumber: "KA-01-AB-1234",
        driver: {
            name: "Ravi Kumar",
            phone: "9876543210",
        },
    },
    {
        bilityNo: "SHP-002",
        bilityDate: "2025-05-08",
        party: "EternoCare",
        town: "Chandigarh",
        weight: "1550",
        cases: 245,
        agent: "Chaudhary",
        deliveryDate: "2025-05-08",
        vehicleNumber: "KA-01-AB-1234",
        driver: {
            name: "Ravi Kumar",
            phone: "9876543210",
        },
    },
    {
        bilityNo: "SHP-003",
        bilityDate: "2025-05-08",
        party: "EternoCare",
        town: "Chandigarh",
        weight: "1550",
        cases: 245,
        agent: "Chaudhary",
        deliveryDate: "2025-05-08",
        vehicleNumber: "KA-01-AB-1234",
        driver: {
            name: "Ravi Kumar",
            phone: "9876543210",
        },
    },
    
];

const columns = [
    "Bilty No",
    "Bilty Date",
    "Party Name",
    "Town",
    "Weight",
    "Cases",
    "Agent",
    "Delivery Date",
    "Vehicle Number",
    "Driver",
];

export default function ShipmentTracking() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Shipment Tracking" />
            <div className="space-y-6">
                <ComponentCard title="Shipment Tracking Table">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col}
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    {col}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {shipmentData.map((row, idx) => (
                                            <TableRow key={row.bilityNo + idx}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                    {row.bilityNo}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.bilityDate}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.party}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.town}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.weight}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.cases}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.agent}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.deliveryDate}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {row.vehicleNumber}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                            {row.driver.name}
                                                        </span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                            {row.driver.phone}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
} 