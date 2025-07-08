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
import { Agent } from "@/types/agent";
import { SlideModal } from "@/components/ui/slide-modal";
import EditAgent from "@/components/agent/EditAgent";
import { useModal } from '@/hooks/useModal';
import { toast } from "react-toastify";

const columns = [
    "Agent Name",
    "City",
    "Contact",
    "Last Shipment Book Date"
];

export default function AgentList() {
    const [Agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const agentModal = useModal();
    const [slectedAgentId, setSlectedAgentId] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAgents();
                setAgents(data);
            } catch (err) {
                toast.error("Failed to fetch Agents: " + (err instanceof Error ? err.message : "Unknown error"));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (agentsId?: string) => {
        if (!agentsId) {
            toast.error("Agent ID is required for deletion");
            return;
        }
         // Uncomment the next line when deleteShipment function is implemented
        if (!window.confirm("Are you sure you want to delete this agent?")) return;
        try {
            //await deleteShipment(agentsId);
            setAgents((prev) => prev.filter(s => s._id !== agentsId));
        } catch (err) {
            toast.error("Failed to delete agent: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for edit
    // const handleEdit = (agentsId?: string) => {
    //     if (!agentsId) {
    //         toast.error("Agent ID is required for editing");
    //         return;
    //     }
    //     // Logic to open edit modal or navigate to edit page
    //     console.log("Edit agent with ID:", agentsId);
    // };

    const handleEdit = (AgentsId?: string) => {
        if (AgentsId) {
            setSlectedAgentId(AgentsId);
        } else {
            setSlectedAgentId(null);
        }
        agentModal.openModal();
    };
    const handleOnSave = async (type: string, data: Agent) => {
        if (type === 'Agent') {
        if (slectedAgentId) {
            setAgents((prev) => prev.map(c => c._id === slectedAgentId ? data : c));
        } else {
            setAgents((prev) => [...prev, data]);
        }
        const updatedList = await getAgents();
        setAgents(updatedList);
        }
        agentModal.closeModal();
    };
    return (
        <div>
            <PageBreadcrumb pageTitle="Agent" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <Button size="sm" variant="primary" onClick={() => handleEdit(undefined)}>
                        + Add Agent
                    </Button>
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
                                            {Agents.map((row) => (
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
                <SlideModal title={slectedAgentId ? 'Edit Agent' : 'Add Agent'} isOpen={agentModal.isOpen} onClose={agentModal.closeModal}>
                    <EditAgent onSave={(data:Agent) => handleOnSave('Agent', data)} onCancel={() => agentModal.closeModal()} selectedId={slectedAgentId}/>
                </SlideModal>
            </div>
        </div>
    );
} 