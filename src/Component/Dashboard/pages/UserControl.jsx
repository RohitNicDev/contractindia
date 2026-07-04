import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Users, Shield, Eye, Ban, ShieldCheck } from "lucide-react";
import CustomHeading from "../../common/CustomHeading";
import DataTableComponent from "../../common/dataTable";
import { Badge } from "../../common/uiUtiles";
import { ConfirmModal } from "../../common/ConfirmModal";
import { UserDetailDrawer } from "../../common/UserDetailDrawer";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserVerificationGet,
  userType,
  verifyUserRegistration,
} from "../../../services/api";
import { useQuery } from "@tanstack/react-query";

// ── API helpers ────────────────────────────────────────────────────────────
const userVerificationGetApi = async (status, usertype) => {
  const response = await UserVerificationGet(status, usertype);
  return response?.data ?? [];
};

const verifyUserRegistrationApi = async (payload) => {
  const response = await verifyUserRegistration({
    userId: payload.userId,
    approved: payload.approved,
  });
  return response ?? [];
};

const getuserTypeApi = async () => {
  const response = await userType();
  return response ?? [];
};

// ── Main component ─────────────────────────────────────────────────────────
const UserControl = () => {
  const [tab, setTab] = useState(1);
  const [status, setStatus] = useState(1); // 1=Approved, 2=Rejected
  const [selectedUser, setSelectedUser] = useState(null); // for detail drawer
  const [confirmState, setConfirmState] = useState(null); // { action, row }

  // Fetch tab types
  const { data: userTypeList = [], isLoading: userTypeLoading } = useQuery({
    queryKey: ["userType"],
    queryFn: getuserTypeApi,
    staleTime: Infinity,
  });

  // Sync active tab with first available tab from API
  useEffect(() => {
    if (userTypeList.length > 0 && !userTypeList.some((t) => t.value === tab)) {
      setTab(userTypeList[0].value);
    }
  }, [userTypeList, tab]);

  // Fetch users for active tab and status
  const {
    data: userData = [],
    isLoading: userDataLoading,
    refetch: userDataRefetch,
    isFetching: userDataFetching,
  } = useQuery({
    queryKey: ["userControl", status, tab],
    queryFn: () => userVerificationGetApi(status, tab),
    enabled: true,
    retry: 2,
  });

  const handleRefetch = async () => {
    await userDataRefetch();
    toast.success("List refreshed");
  };

  // Column definitions
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
      title: "State",
      dataIndex: "StateName",
      key: "StateName",
      render: (val) => val ?? "—",
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
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (val) => {
        const statusMap = {
          1: { color: "green", label: "Approved" },
          2: { color: "red", label: "Rejected" },
        };
        const statusInfo = statusMap[status] || { color: "slate", label: "—" };
        return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedUser(row)}
            className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
          </button>

          {status === 1 && (
            <button
              onClick={() =>
                setConfirmState({
                  action: "Rejected",
                  row,
                })
              }
              className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
            >
<Ban className="h-4 w-4 text-red-600" />
            </button>
          )}

          {status === 2 && (
            <button
              onClick={() =>
                setConfirmState({
                  action: "Verified",
                  row,
                })
              }
              className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const currentTabLabel =
    userTypeList.find((t) => t.value === tab)?.label ??
    (tab === 1 ? "Individual" : "Commercial");

  const isLoading =
    userDataLoading || userDataFetching || userTypeLoading;


  return (
    <>
      <div className="space-y-6">
        {/* Page heading */}
        <CustomHeading
          title="User Control"
          subtitle="Manage user access and account."
          icon={Users}
          badge={`${userData.length} records`}
          badgeColor="indigo"
        />

        {/* Tab switcher */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* User Type */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {userTypeList.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setTab(item.value)}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    tab === item.value
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                {
                  id: 1,
                  label: "Approved",
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  id: 2,
                  label: "Rejected",
                  color: "bg-red-100 text-red-700",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStatus(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === item.id
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data table */}
        <DataTableComponent
          title={`${currentTabLabel} Users`}
          icon={Shield}
          accent="indigo"
          cols={columns}
          rows={userData}
          onRefresh={handleRefetch}
          loading={isLoading}
        />
      </div>

      {/* Detail drawer overlay */}
      <AnimatePresence>
        {selectedUser && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
            />
            <UserDetailDrawer
              user={selectedUser}
              tab={tab}
              onClose={() => setSelectedUser(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
  {confirmState && (
    <ConfirmModal
      isOpen={!!confirmState}
      variant={
        confirmState.action === "Verified"
          ? "verify"
          : "reject"
      }
      title={
        confirmState.action === "Verified"
          ? "Approve User"
          : "Reject User"
      }
      message={`Are you sure you want to ${
        confirmState.action === "Verified"
          ? "approve"
          : "reject"
      } this user?`}
      data={{
        username: confirmState.row?.Name,
      }}
      showDetails={[
        {
          label: "Name",
          value: confirmState.row?.Name,
        },
        {
          label: "Email",
          value: confirmState.row?.EmailId,
        },
        {
          label: "Mobile",
          value: confirmState.row?.MobileNo,
        },
        ...(tab === 2
          ? [
              {
                label: "Company",
                value: confirmState.row?.CompanyName,
              },
            ]
          : []),
      ]}
      requireReason={confirmState.action === "Rejected"}
      reasonLabel="Reason"
      reasonPlaceholder="Enter rejection reason..."
      actionLabel={
        confirmState.action === "Verified"
          ? "Approve"
          : "Reject"
      }
      onConfirm={async ({ reason }) => {
        const response = await verifyUserRegistrationApi({
          userId:
            confirmState.row?.UserId ??
            confirmState.row?.userId,
          approved:
            confirmState.action === "Verified"
              ? 1
              : 2,
          reason,
        });

        await userDataRefetch();
        setConfirmState(null);

        return response;
      }}
      onCancel={() => setConfirmState(null)}
    />
  )}
</AnimatePresence>
    </>
  );
};
export default UserControl;
