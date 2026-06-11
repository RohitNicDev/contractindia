import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Users,
  Eye,
} from "lucide-react";
import CustomHeading from "../../common/CustomHeading";
import DataTableComponent, { StatusBadge } from "../../common/dataTable";
import { Badge } from "../../common/uiUtiles";
import {
  userType,
  UserVerificationGet,
  verifyUserRegistration,
} from "../../../services/api";
import { useQuery } from "@tanstack/react-query";
import { ConfirmModal } from "../../common/ConfirmModal";
import { UserDetailDrawer } from "../../common/UserDetailDrawer";

// ── API helpers ────────────────────────────────────────────────────────────
const userVerificationGetApi = async (type, usertype) => {
  const response = await UserVerificationGet(type, usertype);
  return response?.data ?? [];
};

const verifyUserRegistrationApi = async (payload) => {
  console.log(payload, "payload");
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
export default function UserVerification() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [status, setStatus] = useState(0); // 0=Pending,1=Approved,2=Rejected
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

  // Fetch users for active tab
  const {
    data: userVerificationdata = [],
    isLoading: userVerificationisLoading,
    refetch: userVerificationrefetch,
    isFetching: userVerificationisFetching,
  } = useQuery({
    queryKey: ["userVerificationGetApi", status, tab],
    queryFn: () => userVerificationGetApi(status, tab),
    enabled: true,
    retry: 2,
  });

  // Confirm → update status
  const handleConfirmAction = async () => {
    if (!confirmState) return;
    const { action, row } = confirmState;
    try {
      // API call here when available:
      // await UpdateUserStatusApi(row.userId, action);
      toast.success(`User ${action.toLowerCase()} successfully`);
      userVerificationrefetch();
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setConfirmState(null);
    }
  };

  const handleRefetch = async () => {
    await userVerificationrefetch();
    toast.success("List refreshed");
  };

  // Navigate to detail action page (ActionWrapperMain pattern)
  const openActionPage = (row, actionType) => {
    navigate(`/admin/user-action/${row.userId ?? row.id ?? "unknown"}`, {
      state: {
        actionType,
        userRow: row,
        userTab: tab,
      },
    });
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
    {
      title: "Pin Code",
      dataIndex: "PinCode",
      key: "PinCode",
      render: (val) => val ?? "—",
    },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   key: "Status",
    //   render: (val) => <StatusBadge val={val} />,
    // },
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
        <div className="flex items-center gap-2">
          {/* View */}
          <button
            onClick={() => setSelectedUser(row)}
            className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Pending List */}
          {status === 0 && (
            <>
              <button
                onClick={() =>
                  setConfirmState({
                    action: "Verified",
                    row,
                  })
                }
                className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
              >
                <CheckCircle className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  setConfirmState({
                    action: "Rejected",
                    row,
                  })
                }
                className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Approved List
          {status === 1 && (
            <button
              onClick={() =>
                setConfirmState({
                  action: "Rejected",
                  row,
                })
              }
              className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
            >
              <XCircle className="h-4 w-4" />
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
              className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )} */}
        </div>
      ),
    },
  ];

  const currentTabLabel =
    userTypeList.find((t) => t.value === tab)?.label ??
    (tab === 1 ? "Individual" : "Commercial");

  const isLoading =
    userVerificationisLoading || userVerificationisFetching || userTypeLoading;

  return (
    <>
      <div className="space-y-6">
        {/* Page heading */}
        <CustomHeading
          title="User Verification"
          subtitle="Review, verify, or reject newly registered users."
          icon={ShieldCheck}
          badge={`${userVerificationdata.length} records`}
          badgeColor="indigo"
        />
        {/* 
<div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
 
        <div className="flex gap-2">
          {userTypeList.map((item) => (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold
        ${tab === item.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      
        <div className="flex gap-2">
          {[
            { id: 0, label: "Pending" },
            { id: 1, label: "Approved" },
            { id: 2, label: "Rejected" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatus(item.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium
        ${status === item.id
                  ? "bg-slate-900 text-white"
                  : "bg-white border"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div> this is looking ok ok but not amazing lokking  */}
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
                  id: 0,
                  label: "Pending",
                  // count: userVerificationdata?.length || 0,
                  color: "bg-amber-100 text-amber-700",
                },
                {
                  id: 1,
                  label: "Approved",
                  // count: userVerificationdata?.length || 0,
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  id: 2,
                  label: "Rejected",
                  // count: userVerificationdata?.length || 0,
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

                  {/* <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.color}`}
                  >
                    {item.count}
                  </span> */}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Data table */}
        <DataTableComponent
          title={`${currentTabLabel} Applications`}
          icon={Users}
          accent="indigo"
          cols={columns}
          rows={userVerificationdata}
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
            action={confirmState?.action}
            user={confirmState?.row}
            onConfirm={async ({ reason }) => {
              const response = await verifyUserRegistrationApi({
                userId: confirmState?.row?.userId,
                approved: confirmState?.action === "Verified" ? 1 : 2,
                reason,
              });

              userVerificationrefetch();
              setConfirmState(null);

              return response;
            }}
            onCancel={() => setConfirmState(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
