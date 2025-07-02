"use client"
import React, { useEffect, useState } from "react";
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
//import { updateDrivertatus, deleteShipment } from '@/utils/api/shipmentApi';
import { getDrivers } from "@/utils/api/driverApi";

const columns = [
    "ID",
    "Name",
    "Phone",
    "License Number",
    "Last Shipment Book Date"
];

export default function VehicleList() {
    const [Driver, setDriver] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getDrivers();
                setDriver(data);
                // Build status map for controlled Selects
                const map: { [id: string]: string } = {};
                data.forEach((driver: any) => {
                    map[driver._id] = driver.status;
                });
            } catch (err: any) {
                setError("Failed to fetch Driver");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (DriverId: string) => {
        if (!window.confirm("Are you sure you want to delete this driver?")) return;
        try {
            //await deleteShipment(DriverId);
            setDriver((prev) => prev.filter(s => s._id !== DriverId));
        } catch (err) {
            alert("Failed to delete driver");
        }
    };

    // Placeholder for edit
    const handleEdit = (DriverId: string) => {
        alert(`Edit driver ${DriverId} (implement navigation or modal)`);
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Driver " />
            <div className="space-y-6">
                <ComponentCard title="Driver  Table">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading Driver...</div>
                                ) : error ? (
                                    <div className="p-8 text-center text-red-500">{error}</div>
                                ) : (
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
                                            {Driver.map((row) => (
                                                <TableRow key={row?._id}>
                                                     <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?._id || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.name || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.contact.phone || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.license_number || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {"-"}
                                                    </TableCell>

                                                    <TableCell className="px-4 py-3 text-start">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                startIcon={<PencilIcon width={18} height={18} />}
                                                                className="!p-2 border border-gray-200 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:border-yellow-700"
                                                                onClick={() => handleEdit(row._id)}
                                                            >
                                                                {""}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                startIcon={<TrashBinIcon width={18} height={18} />}
                                                                className="!p-2 border border-gray-200 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:border-red-700"
                                                                onClick={() => handleDelete(row._id)}
                                                            >
                                                                {""}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
} 