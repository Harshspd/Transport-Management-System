"use client"
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Select from "@/components/form/Select";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";

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

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in-transit", label: "In-Transit" },
    { value: "delivered", label: "Delivered" },
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
    "Status",
    "Actions",
];

export default function ShipmentTracking() {
    // Add status state for each row
    const [statuses, setStatuses] = React.useState(
        shipmentData.map(() => "open")
    );

    const handleStatusChange = (idx: number, value: string) => {
        setStatuses((prev) => {
            const updated = [...prev];
            updated[idx] = value;
            return updated;
        });
    };

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
                                                <TableCell className="px-4 py-3 text-start">
                                                    <Select
                                                        options={statusOptions}
                                                        defaultValue={statuses[idx]}
                                                        onChange={(value) => handleStatusChange(idx, value)}
                                                        className={
                                                            statuses[idx] === "open"
                                                                ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200"
                                                                : statuses[idx] === "in-transit"
                                                                    ? "bg-yellow-200 text-yellow-900 border-yellow-400 dark:bg-yellow-800 dark:text-yellow-100"
                                                                    : "bg-green-200 text-green-900 border-green-400 dark:bg-green-800 dark:text-green-100"
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-start">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            startIcon={<PencilIcon width={18} height={18} />}
                                                            className="!p-2 border border-gray-200 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:border-yellow-700"
                                                            onClick={() => {/* handle edit */ }}
                                                        >
                                                            {""}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            startIcon={<TrashBinIcon width={18} height={18} />}
                                                            className="!p-2 border border-gray-200 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:border-red-700"
                                                            onClick={() => {/* handle delete */ }}
                                                        >
                                                            {""}
                                                        </Button>
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