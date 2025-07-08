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
import { getShipments, updateShipmentStatus, deleteShipment } from '@/utils/api/shipmentApi';
import { Shipment } from "@/types/shipment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const statusOptions = [
    { value: "pending", label: "Pending" },
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

export default function ShipmentList() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getShipments();
                setShipments(data);
                // Build status map for controlled Selects
                const map: { [id: string]: string } = {};
                data.forEach((shipment: Shipment) => {
                    if(shipment._id){
                        map[shipment._id] = shipment.status;
                    }
                });
            } catch (err) {
                setError("Failed to fetch shipments: " + (err instanceof Error ? err.message : "Unknown error"));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusChange = async (shipmentId?: string, value?: string) => {
        try {
            if (!shipmentId || !value) {
                toast.error("Invalid shipment ID");
                return;
            }
            await updateShipmentStatus(shipmentId, value);
            setShipments((prev) => prev.map(s => s._id === shipmentId ? { ...s, status: value } : s));
        } catch (err) {
            toast.error("Failed to update shipment status: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    const handleDelete = async (shipmentId?: string) => {
        if (!shipmentId) {
            toast.error("Invalid shipment ID");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this shipment?")) return;
        try {
            await deleteShipment(shipmentId);
            setShipments((prev) => prev.filter(s => s._id !== shipmentId));
        } catch (err) {
            toast.error("Failed to delete shipment: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    // Placeholder for edit
    const handleEdit = (shipmentId?: string) => {
        if (!shipmentId) {
            toast.error("Invalid shipment ID");
            return;
        }
         router.push(`/shipment/edit/${shipmentId}`);

    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Shipment Tracking" />
            <div className="space-y-6">
                <ComponentCard title="Shipment Tracking Table">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading shipments...</div>
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
                                            {shipments.map((row) => (
                                                <TableRow key={row?._id}>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-blue-500">
                                                        {row?.bility_no || row._id}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row?.createdAt?.toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row?.consignee.name || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row?.delivery_location || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row?.goods_details?.actual_weight || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row.goods_details?.quantity || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row?.agent?.contact.person}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row.expected_delivery_date_and_time ? new Date(row.expected_delivery_date_and_time).toLocaleDateString() : "-"}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {row.vehicle?.vehicle_number || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <div>
                                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                {row?.driver?.name || "-"}
                                                            </span>
                                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                                {row?.driver?.contact?.phone || "-"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-start">
                                                        <Select
                                                            options={statusOptions}
                                                            value={row.status}
                                                            onChange={(value) => handleStatusChange(row._id, value)}
                                                            className={
                                                                row.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200"
                                                                    : row.status === "in-transit"
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