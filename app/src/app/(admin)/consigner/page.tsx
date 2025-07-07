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
//import { updateConsignerstatus, deleteShipment } from '@/utils/api/consignerApi';
import { getConsigners } from "@/utils/api/consignerApi";
import { Consigner } from "@/types/consigner";
import { SlideModal } from "@/components/ui/slide-modal";
import EditConsigner from "@/components/consigner/EditConsigner";
import { useModal } from '@/hooks/useModal';
import { toast } from "react-toastify";

const columns = [
    "Consigner Name",
    "City",
    "Contact",
    "Last Shipment Book Date"
];

export default function ConsignerList() {
    const [Consigners, setConsigners] = useState<Consigner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const consignerModal = useModal();
    const [slectedConsignerId, setSlectedConsignerId] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getConsigners();
                setConsigners(data);
            } catch (err) {
                toast.error("Failed to fetch Consigners: " + (err instanceof Error ? err.message : "Unknown error"));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (consignersId?: string) => {
        if (!consignersId) {
            toast.error("Consigner ID is required for deletion");
            return;
        }
         // Uncomment the next line when deleteShipment function is implemented
        if (!window.confirm("Are you sure you want to delete this consigner?")) return;
        try {
            //await deleteShipment(consignersId);
            setConsigners((prev) => prev.filter(s => s._id !== consignersId));
        } catch (err) {
            toast.error("Failed to delete consigner: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for edit
    // const handleEdit = (consignersId?: string) => {
    //     if (!consignersId) {
    //         toast.error("Consigner ID is required for editing");
    //         return;
    //     }
    //     // Logic to open edit modal or navigate to edit page
    //     console.log("Edit consigner with ID:", consignersId);
    // };

    const handleEdit = (ConsignersId?: string) => {
        if (ConsignersId) {
            setSlectedConsignerId(ConsignersId);
        } else {
            setSlectedConsignerId(null);
        }
        consignerModal.openModal();
    };
    const handleOnSave = async (type: string, data: Consigner) => {
        if (type === 'Consigner') {
        if (slectedConsignerId) {
            setConsigners((prev) => prev.map(c => c._id === slectedConsignerId ? data : c));
        } else {
            setConsigners((prev) => [...prev, data]);
        }
        const updatedList = await getConsigners();
        setConsigners(updatedList);
        }
        consignerModal.closeModal();
    };
    return (
        <div>
            <PageBreadcrumb pageTitle="Consigner" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <Button size="sm" variant="primary" onClick={() => handleEdit(undefined)}>
                        + Add Consigner
                    </Button>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading Consigners...</div>
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
                                            {Consigners.map((row) => (
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
                <SlideModal title={slectedConsignerId ? 'Edit Consigner' : 'Add Consigner'} isOpen={consignerModal.isOpen} onClose={consignerModal.closeModal}>
                    <EditConsigner onSave={(data: Consigner) => handleOnSave('Consigner', data)} onCancel={() => consignerModal.closeModal()} selectedId={slectedConsignerId}/>
                </SlideModal>
            </div>
        </div>
    );
} 