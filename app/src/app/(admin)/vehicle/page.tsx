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
//import { updateVehiclestatus, deleteShipment } from '@/utils/api/shipmentApi';
import { getVehicles } from "@/utils/api/vehicleApi";

const columns = [
    "ID",
    "Vehicle Number",
    "Type",
    "Capacity Weight",
    "Capacity Volume",
    "Last Shipment Book Date"
];

export default function VehicleList() {
    const [Vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getVehicles();
                setVehicles(data);
                // Build status map for controlled Selects
                const map: { [id: string]: string } = {};
                data.forEach((vehicle: any) => {
                    map[vehicle._id] = vehicle.status;
                });
            } catch (err: any) {
                setError("Failed to fetch Vehicles");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (VehiclesId: string) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            //await deleteShipment(VehiclesId);
            setVehicles((prev) => prev.filter(s => s._id !== VehiclesId));
        } catch (err) {
            alert("Failed to delete vehicle");
        }
    };

    // Placeholder for edit
    const handleEdit = (VehiclesId: string) => {
        alert(`Edit vehicle ${VehiclesId} (implement navigation or modal)`);
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Vehicle" />
            <div className="space-y-6">
                <ComponentCard title="Vehicle Table">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading Vehicles...</div>
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
                                            {Vehicles.map((row) => (
                                                <TableRow key={row?._id}>
                                                     <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?._id || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.vehicle_number || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.vehicle_type || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.capacity_weight || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.capacity_volume || "-"}
                                                    </TableCell>
                                                     <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        { "-"}
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