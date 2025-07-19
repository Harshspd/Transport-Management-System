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
//import { updateAgentstatus, deleteShipment } from '@/utils/api/agentApi';
import { getAgents } from "@/utils/api/agentApi";
import { getRates, updateRates } from "@/utils/api/rateApi";
import { Agent } from "@/types/agent";
import { SlideModal } from "@/components/ui/slide-modal";
import EditAgent from "@/components/agent/EditAgent";
import { useModal } from '@/hooks/useModal';
import { toast } from "react-toastify";

const columns = [
    "Bilty Number",
    "Shipment Id",
    "Provider Rate",
    "Consigner Rate",
    "Actions"
];

// Types for rate-management table
export type GoodsDetails = {
    description: string;
    quantity: number;
    bill_no: string;
    bill_date: string;
    bill_value: number;
    mode: string;
    actual_dimensions: number;
    charged_dimensions: number;
    unit_of_weight: string;
    actual_weight: number;
    charged_weight: number;
    special_instructions: string;
};

export type Shipment = {
    _id: string;
    goods_details: GoodsDetails;
    consigner: string;
    consignee: string;
    delivery_location: string;
    expected_delivery_date_and_time: string;
    driver: string;
    vehicle: string;
    service_type: string;
    provider: string;
    eway_bill_number: string;
    status: string;
    bility_no: number;
    created_by: string;
    organization_id: string;
    createdAt: string;
    updatedAt: string;
    updated_by: string;
    agent: string;
    negotiated_rate: number;
};

export type Rate = {
    _id: string;
    shipment_id: Shipment;
    consigner_rate: number;
    provider_rate: number;
};

export default function AgentList() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllRate()
    }, []);

    const getAllRate = () => {
        setLoading(true);
        setError(null);
        getRates()
            .then((data) => {
                console.log("data", data)
                setRates(data);
                // setRates([
                //     {
                //         "_id": "68792ca791791b248ede9b33",
                //         "shipment_id": {
                //             "goods_details": {
                //                 "description": "",
                //                 "quantity": 1000,
                //                 "bill_no": "SH1111",
                //                 "bill_date": "1970-01-01T00:00:00.000Z",
                //                 "bill_value": 10000,
                //                 "mode": "Transport",
                //                 "actual_dimensions": 60,
                //                 "charged_dimensions": 50,
                //                 "unit_of_weight": "Per Kg",
                //                 "actual_weight": 30,
                //                 "charged_weight": 25,
                //                 "special_instructions": ""
                //             },
                //             "_id": "68677a9338d4a3e577f54001",
                //             "consigner": "68665d4f17b406bfb04a1edb",
                //             "consignee": "68665dbc17b406bfb04a1edf",
                //             "delivery_location": "mumbai",
                //             "expected_delivery_date_and_time": "2025-07-15T06:49:00.000Z",
                //             "driver": "68663c32d713f625f68758b3",
                //             "vehicle": "68666ac9d832caa4ff0378a4",
                //             "service_type": "Standard",
                //             "provider": "Owner",
                //             "eway_bill_number": "EW654321666",
                //             "status": "Delivered",
                //             "bility_no": 4003,
                //             "created_by": "685e93273f62b6cc9adac5da",
                //             "organization_id": "685e93263f62b6cc9adac5d8",
                //             "createdAt": "2025-07-04T06:54:11.156Z",
                //             "updatedAt": "2025-07-16T09:21:55.426Z",
                //             "updated_by": "685e93273f62b6cc9adac5da",
                //             "agent": "68678d85bc1e56bd55d9de05",
                //             "negotiated_rate": 13500
                //         },
                //         "consigner_rate": 4100,
                //         "provider_rate": 5500
                //     }
                // ])
            })
            .catch((err) => {
                setError("Failed to fetch rates: " + (err instanceof Error ? err.message : "Unknown error"));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // const handleDelete = async (agentsId?: string) => {
    //     if (!agentsId) {
    //         toast.error("Agent ID is required for deletion");
    //         return;
    //     }
    //     // Uncomment the next line when deleteShipment function is implemented
    //     if (!window.confirm("Are you sure you want to delete this agent?")) return;
    //     try {
    //         //await deleteShipment(agentsId);
    //         setRates((prev) => prev.filter(s => s._id !== agentsId));
    //     } catch (err) {
    //         toast.error("Failed to delete agent: " + (err instanceof Error ? err.message : "Unknown error"));
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleUpdateRate = (rateData: any) => {
       const payload = {
            "shipment_id": rateData?.shipment_id?._id,
            "provider_rate": rateData?.provider_rate,
            "consigner_rate": rateData?.consigner_rate
        }
        updateRates(payload).then((res) => {
            toast.success('Rate is updated successfully.');
            getAllRate()
        }).catch((err) => {
            toast.error('Something went wrong!!.', err);
        })
    }
   
    return (
        <div>
            <PageBreadcrumb pageTitle="Agent" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading Agents...</div>
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
                                            {rates?.map((row) => (
                                                <TableRow key={row?._id}>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start ">
                                                        {row?.shipment_id?.bility_no || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start ">
                                                        {row?.shipment_id?._id || "-"}
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start ">
                                                        <input
                                                            type="number"
                                                            value={row?.provider_rate ?? ""}
                                                            onChange={e => {
                                                                const newValue = parseFloat(e.target.value);
                                                                setRates(prev => prev.map(rate => rate._id === row._id ? { ...rate, provider_rate: isNaN(newValue) ? 0 : newValue } : rate));
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter provider rate"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 sm:px-6 text-start ">
                                                        <input
                                                            type="number"
                                                            value={row?.consigner_rate ?? ""}
                                                            onChange={e => {
                                                                const newValue = parseFloat(e.target.value);
                                                                setRates(prev => prev.map(rate => rate._id === row._id ? { ...rate, consigner_rate: isNaN(newValue) ? 0 : newValue } : rate));
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter consigner rate"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="px-2 py-1 text-start">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="primary" onClick={() => handleUpdateRate(row)}>
                                                                {(row?.provider_rate || row?.consigner_rate) ? "Update" : "Save"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                startIcon={<TrashBinIcon width={18} height={18} />}
                                                                className="!p-2 border border-gray-200 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:border-red-700"
                                                                // onClick={() => handleDelete(row._id)}
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