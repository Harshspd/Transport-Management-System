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
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
//import { updateConsigneestatus, deleteShipment } from '@/utils/api/shipmentApi';
import { getConsignees } from "@/utils/api/consigneeApi";
import { Consignee } from "@/types/consignee";
import { SlideModal } from "@/components/ui/slide-modal";
import EditConsignee from "@/components/consignee/EditConsignee";
import { useModal } from '@/hooks/useModal';
import { toast } from "react-toastify";


const columns = [
    "Consignee Name",
    "City",
    "Contact",
    "Last Shipment Book Date"
];

export default function ConsigneeList() {
    const [Consignees, setConsignees] = useState<Consignee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const consigneeModal = useModal();
    const [slectedConsigneeId, setSlectedConsigneeId] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getConsignees();
                setConsignees(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError("Failed to fetch Consignees: " + err.message);
                } else {
                    setError("Failed to fetch Consignees: Unknown error");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handleOnSave = async (type: string, data: Consignee) => {
        if (type === 'Consignee') {
            if (slectedConsigneeId) {
                setConsignees((prev) => prev.map(c => c._id === slectedConsigneeId ? data : c));
            } else {
                setConsignees((prev) => [...prev, data]);
            }
            const updatedList = await getConsignees();
            setConsignees(updatedList);
        }
        consigneeModal.closeModal();
    };
    const handleDelete = async (ConsigneesId?: string) => {
        if (!ConsigneesId) {
            toast.error("Consignee ID is required for editing");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this consignee?")) return;
        try {
            //await deleteShipment(ConsigneesId);
            setConsignees((prev) => prev.filter(s => s._id !== ConsigneesId));
        } catch (err: unknown) {
                if (err instanceof Error) {
                    setError("Failed to fetch Consignees: " + err.message);
                } else {
                    setError("Failed to fetch Consignees: Unknown error");
                }
            } finally {
                setLoading(false);
        }
    };

    // Placeholder for edit
    const handleEdit = (ConsigneesId?: string) => {
        if (ConsigneesId) {
            setSlectedConsigneeId(ConsigneesId);
        }else{
            setSlectedConsigneeId(null);
        }
        consigneeModal.openModal();
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Consignee" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <Button size="sm" variant="primary" onClick={()=>handleEdit(undefined)}>
                        + Add Consignee
                    </Button>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading Consignees...</div>
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
                                                        className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                    >
                                                        {col}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {Consignees.map((row) => (
                                                <TableRow key={row?._id}>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start text-blue-500">
                                                        {row?.name || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start text-blue-500">
                                                        {row?.address?.city || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 text-start">
                                                        <div>
                                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                {row?.contact?.person || "-"}
                                                            </span>
                                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                                {row?.contact?.phone || "-"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start text-blue-500">
                                                        {"-"}
                                                    </TableCell>

                                                    <TableCell className="px-2 py-1 text-start">
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
                <SlideModal title={slectedConsigneeId ? 'Edit Consignee' : 'Add Consignee'}  isOpen={consigneeModal.isOpen} onClose={consigneeModal.closeModal}>
                    <EditConsignee onSave={(data:Consignee)=>handleOnSave('Consignee',data)} onCancel={()=>consigneeModal.closeModal()} selectedId={slectedConsigneeId??undefined}/>
                </SlideModal>
            </div>
        </div>
    );
} 