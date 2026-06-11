import React, { useState } from 'react';
import { btnPrimary, Inputs, StatCard, Badge, handleExport } from '../../common/uiUtiles';

import { Plus, Loader2, RefreshCw, Download, List } from 'lucide-react';
import { motion, } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leadGet, leadSave, leadUpdate, leadDelete } from "../../../services/api";

import CustomHeading from "../../common/CustomHeading";
import DataTableComponent from "../../common/dataTable";

const LeadManagement = () => {
    const queryClient = useQueryClient();
    const [isFetching, setIsFetching] = useState(false);

    const { data: rawLeads, isLoading, refetch: refetchQuery } = useQuery({
        queryKey: ["leadsList"],
        queryFn: async () => {
            const response = await leadGet();
            let list = response;
            if (typeof list === "string") {
                try { list = JSON.parse(list); } catch (e) { list = []; }
            }
            return Array.isArray(list) ? list : [];
        },

        retry: 2,
        onError: () => toast.error("Failed to load leads.")
    });

    const leads = rawLeads || [
        {
            id: 1,
            name: "Rajesh Kumar",
            service: "Consulting",
            phone: "9876543210",
            email: "rajesh@gmail.com",
            date: "2026-05-10",
            status: "New",
            notes: "Interested in EPC consultancy",
        },
        {
            id: 2,
            name: "Priya Sharma",
            service: "Legal Contracts",
            phone: "9898989898",
            email: "priya@gmail.com",
            date: "2026-05-08",
            status: "In Progress",
            notes: "Need contract drafting",
        },
        {
            id: 3,
            name: "Amit Singh",
            service: "Tender Services",
            phone: "9090909090",
            email: "amit@gmail.com",
            date: "2026-05-05",
            status: "Closed",
            notes: "Tender submitted successfully",
        },
    ];

    const refetch = () => {
        setIsFetching(true);
        refetchQuery().finally(() => {
            setIsFetching(false);
            toast.success("List refreshed");
        });
    };

    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [editingLead, setEditingLead] = useState(null);

    const [form, setForm] = useState({
        name: "",
        service: "",
        phone: "",
        email: "",
        status: "New",
        notes: "",
    });

    /* -------------------------------------------------------------------------- */
    /* OPEN ADD MODAL */
    /* -------------------------------------------------------------------------- */

    const openAddModal = () => {
        setEditingLead(null);
        setForm({
            name: "",
            service: "",
            phone: "",
            email: "",
            status: "New",
            notes: "",
        });
        setShowModal(true);
    };

    /* -------------------------------------------------------------------------- */
    /* EDIT LEAD */
    /* -------------------------------------------------------------------------- */

    const editLead = (lead) => {
        setEditingLead(lead);
        setForm({
            name: lead.name,
            service: lead.service,
            phone: lead.phone,
            email: lead.email,
            status: lead.status,
            notes: lead.notes,
        });
        setShowModal(true);
    };

    /* -------------------------------------------------------------------------- */
    /* SAVE LEAD */
    /* -------------------------------------------------------------------------- */

    const { mutate: addLeadMutate, isPending: isAdding } = useMutation({
        mutationFn: leadSave,
        onSuccess: (res) => {
            if (res && res.status === false) {
                toast.error(res.message || "Failed to create lead");
                return;
            }
            toast.success("Lead created successfully");
            setShowModal(false);
            refetchQuery();
        },
        onError: () => toast.error("Failed to create lead")
    });

    const { mutate: updateLeadMutate, isPending: isUpdating } = useMutation({
        mutationFn: leadUpdate,
        onSuccess: (res) => {
            if (res && res.status === false) {
                toast.error(res.message || "Failed to update lead");
                return;
            }
            toast.success("Lead updated successfully");
            setShowModal(false);
            refetchQuery();
        },
        onError: () => toast.error("Failed to update lead")
    });

    const { mutate: deleteLeadMutate, isPending: isDeleting } = useMutation({
        mutationFn: leadDelete,
        onSuccess: (res) => {
            if (res && res.status === false) {
                toast.error(res.message || "Failed to delete lead");
                return;
            }
            toast.success("Lead deleted successfully");
            refetchQuery();
        },
        onError: () => toast.error("Failed to delete lead")
    });

    const saveLead = () => {
        if (!form.name || !form.phone) {
            toast.error("Name and phone are required");
            return;
        }

        const payload = {
            name: form.name,
            service: form.service,
            phone: form.phone,
            email: form.email,
            status: form.status,
            notes: form.notes,
            date: new Date().toISOString().split("T")[0]
        };

        if (editingLead) {
            updateLeadMutate({ ...payload, id: editingLead.id });
        } else {
            addLeadMutate(payload);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* DELETE LEAD */
    /* -------------------------------------------------------------------------- */

    const deleteLead = (id) => {
        deleteLeadMutate(id);
    };

    /* -------------------------------------------------------------------------- */
    /* EXPORT & FILTER */
    /* -------------------------------------------------------------------------- */

    const filteredLeads = leads.filter((lead) => {
        return statusFilter === "All" || lead.status === statusFilter;
    });


    const columns = [
        { title: "Name", dataIndex: "name", key: "name", render: (val) => val ?? "—" },
        { title: "Phone", dataIndex: "phone", key: "phone", render: (val) => val ?? "—" },
        { title: "Email", dataIndex: "email", key: "email", render: (val) => val ?? "—" },
        { title: "Service", dataIndex: "service", key: "service", render: (val) => val ?? "—" },
        { title: "Date", dataIndex: "date", key: "date", render: (val) => val ?? "—" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (val) => {
                let color = "slate";
                if (val === "New") color = "blue";
                else if (val === "In Progress") color = "amber";
                else if (val === "Closed") color = "green";
                return <Badge color={color}>{val}</Badge>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => editLead(row)}
                        className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-100"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => deleteLead(row.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-all hover:bg-red-100"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <CustomHeading
                title="Lead Management"
                subtitle="Manage customer leads efficiently"
                icon={List}
                badge={`${leads.length} leads`}
                badgeColor="indigo"
                actions={
                    <div className="flex items-center gap-2">
                         
                        <button
                            onClick={openAddModal}
                            className="flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all"
                            style={btnPrimary}
                        >
                            <Plus className="h-4 w-4" />
                            Add Lead
                        </button>
                    </div>
                }
            />

            {/* STATS */}
            <div className="grid gap-3 sm:grid-cols-4">
                <StatCard title="Total Leads" value={leads.length} />
                <StatCard title="New" value={leads.filter((x) => x.status === "New").length} />
                <StatCard title="In Progress" value={leads.filter((x) => x.status === "In Progress").length} />
                <StatCard title="Closed" value={leads.filter((x) => x.status === "Closed").length} />
            </div>

            {/* FILTERS */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none w-48 shadow-sm"
                >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <DataTableComponent
                title="Leads List"
                icon={List}
                accent="indigo"
                cols={columns}
                rows={filteredLeads}
                onRefresh={refetch}
                onExport={handleExport}
                loading={isLoading || isFetching}
            />

            {/* MODAL */}
            {showModal && (
                <div
                    className="
            fixed inset-0 z-[999]
            flex items-center justify-center
            bg-black/50 p-4
            backdrop-blur-sm
          "
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="
              w-full max-w-2xl
              rounded-[30px]
              bg-white p-6
              shadow-2xl
            "
                    >
                        {/* HEADER */}
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">
                                    {editingLead ? "Edit Lead" : "Add New Lead"}
                                </h3>
                                <p className="text-sm text-slate-400">Manage lead details</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* FORM */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Inputs
                                label="Full Name"
                                value={form.name}
                                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                            />
                            <Inputs
                                label="Phone"
                                value={form.phone}
                                onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                            />
                            <Inputs
                                label="Email"
                                value={form.email}
                                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                            />
                            <Inputs
                                label="Service"
                                value={form.service}
                                onChange={(v) => setForm((p) => ({ ...p, service: v }))}
                            />

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-xs font-bold text-slate-600">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"
                                >
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-xs font-bold text-slate-600">Notes</label>
                                <textarea
                                    rows={4}
                                    value={form.notes}
                                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveLead}
                                disabled={isAdding || isUpdating}
                                className="rounded-xl bg-violet-600 px-5 py-2.5 flex items-center justify-center min-w-[120px] text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {isAdding || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Lead"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LeadManagement;