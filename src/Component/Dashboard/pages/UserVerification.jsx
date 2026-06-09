import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle, XCircle, Users } from "lucide-react";
import CustomHeading from "../../../components/CustomHeading";
import DataTableComponent from "../../dataTable";
import { Badge, handleExport } from "../../uiUtiles";
import { userType, UserVerificationGet } from "../../../services/api"; // Note: Add your update status API here if available
import { useQuery, useQueryClient } from "@tanstack/react-query";

const userVerificationGetApi = async (type, usertype) => {
  console.log("Fetching user verification data for tab ID:", usertype);
  const response = await UserVerificationGet(type, usertype); // Ensure your API accepts the tab ID filter
  return response?.data ?? [];
};

const getuserTypeApi = async () => {
  const response = await userType();
  console.log("User types loaded:", response);
  return response ?? [];
};

export default function UserVerification() {
  const queryClient = useQueryClient();

  // 1. Manage active tab state (1 = Individual by default)
  const [tab, setTab] = useState(1);

  // 2. Fetch Tab Configurations
  const { data: userTypeList = [], isLoading: userTypeLoading } = useQuery({
    queryKey: ["userType"],
    queryFn: getuserTypeApi,
    staleTime: Infinity,
  });

  // 3. Keep Active Tab synced with whatever the API delivers first
  useEffect(() => {
    if (userTypeList.length > 0 && !userTypeList.some((t) => t.value === tab)) {
      setTab(userTypeList[0].value);
    }
  }, [userTypeList, tab]);

  // 4. Fetch User Data filtered by Active Tab ID
  const {
    data: userVerificationdata = [],
    isLoading: userVerificationisLoading,
    refetch: userVerificationrefetch,
    isFetching: userVerificationisFetching,
  } = useQuery({
    queryKey: ["userVerificationGetApi", tab],
    queryFn: () => userVerificationGetApi(0, tab),
    enabled: tab !== undefined,
    retry: 2,
  });
  useEffect(() => {
    console.log(userVerificationdata, "datad");
  }, [userVerificationdata]);

  // 5. Update Status Logic
  const updateStatus = async (id, status) => {
    try {
      // OPTIONAL: Call your backend API mutation here if you have one, e.g.:
      // await UpdateUserStatusApi(id, status);

      toast.success(`User ${status.toLowerCase()} successfully`);

      // Refresh the data grid for the current tab from the server
      userVerificationrefetch();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  // Explicit global refetch execution triggered by the user grid refresh button
  const handleRefetchAll = async () => {
    await userVerificationrefetch();
    toast.success("List refreshed");
  };

  // Columns Layout Data Configuration
  const columns = [
     ...(tab === 2
      ? [
          {
            title: "Company Name",
            dataIndex: "CompanyName",
            key: "CompanyName",
            render: (val) => val ?? "—",
          },
        ]
      : []),
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (val) => val ?? "—",
    },
    {
      title: "Email",
      dataIndex: "EmailId",
      key: "EmailId",
      render: (val) => val ?? "—",
    },
    {
      title: "Mobile",
      dataIndex: "MobileNo",
      key: "MobileNo",
      render: (val) => val ?? "—",
    },
    {
      title: "State Name",
      dataIndex: "StateName",
      key: "StateName",
      render: (val) => val ?? "—",
    },
    {
      title: "Pin Code",
      dataIndex: "PinCode",
      key: "PinCode",
      render: (val) => val ?? "—",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (val) => (
        <Badge
          color={
            val === "Verified" ? "green" : val === "Rejected" ? "red" : "yellow"
          }
        >
          {val}
        </Badge>
      ),
    },
    ...(tab === 2
      ? [
          {
            title: "Service Name",
            dataIndex: "ServiceName",
            key: "ServiceName",
            render: (val) => val ?? "—",
          },
        ]
      : []),
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

  const currentTabLabel =
    userTypeList.find((t) => t.value === tab)?.label ??
    (tab === 1 ? "Individual" : "Commercial");

  return (
    <div className="space-y-6">
      <CustomHeading
        title="User Verification"
        subtitle="Review and verify newly registered users."
        icon={ShieldCheck}
        badge={`${userVerificationdata.length} records`}
        badgeColor="indigo"
      />

      {/* Tabs Row Layout */}
      <div className="flex gap-2">
        {userTypeLoading ? (
          <div className="text-sm text-slate-400 animate-pulse py-2">
            Loading tabs...
          </div>
        ) : (
          userTypeList.map((elm) => (
            <button
              key={elm?.value}
              onClick={() => setTab(elm?.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-sm ${
                tab === elm?.value
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {elm?.label} Users
            </button>
          ))
        )}
      </div>

      {/* Main Data Content Grid */}
      <DataTableComponent
        title={`${currentTabLabel} Applications`}
        icon={Users}
        accent="indigo"
        cols={columns}
        rows={userVerificationdata}
        onRefresh={handleRefetchAll}
        onExport={handleExport}
        loading={
          userVerificationisLoading ||
          userVerificationisFetching ||
          userTypeLoading
        }
      />
    </div>
  );
}
