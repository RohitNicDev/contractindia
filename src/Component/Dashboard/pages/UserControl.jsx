import { useState } from "react";
import { toast } from "sonner";
import { Users, Shield, RefreshCw, Download } from "lucide-react";
import CustomHeading from "../../../components/CustomHeading";
import DataTableComponent from "../../dataTable";
import { Badge, handleExport } from "../../uiUtiles";

const initAllUsers = [
    { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", type: "Individual", status: "Active" },
    { id: 2, name: "Sharma Builders", email: "info@sharmabuilders.com", type: "Commercial", status: "Active" },
    { id: 3, name: "Priya Mehta", email: "priya@gmail.com", type: "Individual", status: "Blocked" },
    { id: 4, name: "Gupta Contractors", email: "contact@guptacontractors.com", type: "Commercial", status: "Active" },
    { id: 5, name: "Amit Verma", email: "amit@gmail.com", type: "Individual", status: "Active" },
];

const UserControl = () => {
    const [users, setUsers] = useState(initAllUsers);
    const [isFetching, setIsFetching] = useState(false);

    const toggleStatus = (id) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u
            )
        );
        toast.success("User status updated");
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
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (val) => <Badge color={val === "Commercial" ? "indigo" : "slate"}>{val}</Badge>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (val) => <Badge color={val === "Active" ? "green" : "red"}>{val}</Badge>
        },
        {
            title: "Action",
            key: "action",
            render: (_, row) => (
                <button
                    onClick={() => toggleStatus(row.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 ${row.status === "Active"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        }`}
                >
                    {row.status === "Active" ? "Block" : "Unblock"}
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <CustomHeading
                title="User Control"
                subtitle="Manage user access and account states."
                icon={Users}
                badge={`${users.length} users`}
                badgeColor="indigo"
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={refetch}
                            disabled={isFetching}
                            title="Refresh"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleExport(users)}
                            disabled={users.length === 0}
                            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Export CSV
                        </button>
                    </div>
                }
            />

            <DataTableComponent
                title="All Users"
                icon={Shield}
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
export default UserControl;