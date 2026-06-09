import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle, XCircle, RefreshCw, Download, Users } from "lucide-react";
import CustomHeading from "../../../components/CustomHeading";
import DataTableComponent from "../../dataTable";
import { Badge, handleExport } from "../../uiUtiles";

const initIndividual = [
    { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", mobile: "9876543210", date: "2025-06-01", status: "Pending" },
    { id: 2, name: "Priya Mehta", email: "priya@gmail.com", mobile: "9123456789", date: "2025-06-03", status: "Pending" },
    { id: 3, name: "Amit Verma", email: "amit@gmail.com", mobile: "9988776655", date: "2025-06-05", status: "Verified" },
    { id: 4, name: "Sunita Rao", email: "sunita@gmail.com", mobile: "9001122334", date: "2025-06-07", status: "Rejected" },
];

const initCommercial = [
    { id: 1, name: "Shapoorji Pallonji & Co.", email: "shapoorjipallonji@gmail.com", mobile: "9811223344", date: "2025-05-28", status: "Verified" },
    { id: 2, name: "Design Arc Architects", email: "designarcarchitects@gmail.com", mobile: "9922334455", date: "2025-06-02", status: "Verified" },
    { id: 3, name: "UrbanSpace Interiors", email: "urbanSpaceinteriors@gmail.com", mobile: "9033445566", date: "2025-06-06", status: "Verified" },
    { id: 4, name: "Volt & Wire Electrical", email: "vote@voltwireelectrical.com", mobile: "9033446532", date: "2025-02-06", status: "Verified" },
    { id: 5, name: "Shivam Brothers", email: "shivam@patelinteriors.com", mobile: "9033446589", date: "2025-01-06", status: "Pending" },
];

export default function UserVerification() {
    const [tab, setTab] = useState("individual");
    const [indUsers, setIndUsers] = useState(initIndividual);
    const [comUsers, setComUsers] = useState(initCommercial);
    const [isFetching, setIsFetching] = useState(false);

    const users = tab === "individual" ? indUsers : comUsers;
    const setUsers = tab === "individual" ? setIndUsers : setComUsers;

    const updateStatus = (id, status) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
        toast.success(`User ${status.toLowerCase()} successfully`);
    };

    const refetch = () => {
        setIsFetching(true);
        setTimeout(() => {
            setIsFetching(false);
            toast.success("List refreshed");
        }, 600);
    };


    const columns = [
        { title: "Name", dataIndex: "name", key: "name", render: (val) => val ?? "—" },
        { title: "Email", dataIndex: "email", key: "email", render: (val) => val ?? "—" },
        { title: "Mobile", dataIndex: "mobile", key: "mobile", render: (val) => val ?? "—" },
        { title: "Registered", dataIndex: "date", key: "date", render: (val) => val ?? "—" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (val) => (
                <Badge color={val === "Verified" ? "green" : val === "Rejected" ? "red" : "yellow"}>
                    {val}
                </Badge>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => updateStatus(row.id, "Verified")}
                        disabled={row.status === "Verified"}
                        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-40"
                    >
                        <CheckCircle className="h-3 w-3" />
                        Verify
                    </button>
                    <button
                        onClick={() => updateStatus(row.id, "Rejected")}
                        disabled={row.status === "Rejected"}
                        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-40"
                    >
                        <XCircle className="h-3 w-3" />
                        Reject
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <CustomHeading
                title="User Verification"
                subtitle="Review and verify newly registered users."
                icon={ShieldCheck}
                badge={`${users.length} records`}
                badgeColor="indigo"
                // actions={
                //     <div className="flex items-center gap-2">
                //         <button
                //             type="button"
                //             onClick={refetch}
                //             disabled={isFetching}
                //             title="Refresh"
                //             className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
                //         >
                //             <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                //         </button>
                //         <button
                //             type="button"
                //             onClick={() => handleExport(users)}
                //             disabled={users.length === 0}
                //             className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
                //         >
                //             <Download className="h-3.5 w-3.5" />
                //             Export CSV
                //         </button>
                //     </div>
                // }
            />

            {/* Tabs */}
            <div className="flex gap-2">
                {["individual", "commercial"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-sm ${tab === t
                            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        {t === "individual" ? "Individual Users" : "Commercial Users"}
                    </button>
                ))}
            </div>

            <DataTableComponent
                title={tab === "individual" ? "Individual Applications" : "Commercial Applications"}
                icon={Users}
                accent="indigo"
                cols={columns}
                rows={users}
                onRefresh={refetch}
                onExport={handleExport}
                loading={isFetching}
            />
        </div>
    );
}