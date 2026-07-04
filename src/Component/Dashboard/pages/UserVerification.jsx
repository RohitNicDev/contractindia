import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle, XCircle, Users, Eye } from "lucide-react";
import CustomHeading from "../../common/CustomHeading";
import DataTableComponent from "../../common/dataTable";
import {
  userType,
  UserVerificationGet,
  verifyUserRegistration,
} from "../../../services/api";
import { useQuery } from "@tanstack/react-query";
import { ConfirmModal } from "../../common/ConfirmModal";
import { UserDetailDrawer } from "../../common/UserDetailDrawer";
import CompanyDetailModal from "./CompanyDetailModal";

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
export default function UserVerification() {
  const [tab, setTab] = useState(1);
  const [status, setStatus] = useState(0); // 0=Pending 1=Approved 2=Rejected
  const [selectedUser, setSelectedUser] = useState(null); // drawer (individual)
  const [confirmState, setConfirmState] = useState(null); // { action, row }
  const [companyDetailUserId, setCompanyDetailUserId] = useState(null); // full modal (commercial)
  const [companyDetailRow, setCompanyDetailRow] = useState(null);
  useEffect(() => {
    console.log(confirmState, "confirmState");
  }, [confirmState]);

  // ── Fetch user-type tabs ─────────────────────────────────────────────────
  const { data: userTypeList = [], isLoading: userTypeLoading } = useQuery({
    queryKey: ["userType"],
    queryFn: getuserTypeApi,
    staleTime: Infinity,
  });

  // Sync active tab with first API-delivered value
  useEffect(() => {
    if (userTypeList.length > 0 && !userTypeList.some((t) => t.value === tab)) {
      setTab(userTypeList[0].value);
    }
  }, [userTypeList, tab]);

  // ── Fetch verification list ──────────────────────────────────────────────
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

  const handleRefetch = async () => {
    await userVerificationrefetch();
    toast.success("List refreshed");
  };

  // ── Open commercial detail modal ─────────────────────────────────────────
  const openCompanyDetail = (row) => {
    const userId = row?.UserId ?? row?.userId ?? row?.UserID ?? row?.id;
    if (!userId) {
      toast.error("User ID not found for this record.");
      return;
    }
    setCompanyDetailUserId(userId);
    setCompanyDetailRow(row);
  };

  // ── Column definitions ───────────────────────────────────────────────────
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
      width: 200,
      render: (_, row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* ── View (individual = drawer, commercial = full profile modal) ── */}
          {tab === 2 ? (
            <button
              onClick={() => openCompanyDetail(row)}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-3.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-95"
              title="View full company profile"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setSelectedUser(row)}
              className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-indigo-200 transition-colors"
              title="View user details"
            >
              <Eye className="h-4 w-4 text-slate-500" />
            </button>
          )}

          {/* ── Pending: Verify + Reject ── */}
          {status === 0 && (
            <>
              <button
                onClick={() => setConfirmState({ action: "Verified", row })}
                className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                title="Verify user"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => setConfirmState({ action: "Rejected", row })}
                className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Reject user"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
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
        {/* ── Page heading ── */}
        <CustomHeading
          title="User Verification"
          subtitle="Review, verify, or reject newly registered users."
          icon={ShieldCheck}
          badge={`${userVerificationdata.length} records`}
          badgeColor="indigo"
        />

        {/* ── Tab + status switcher ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* User type tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {userTypeLoading
                ? [1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-28 rounded-lg bg-slate-200 animate-pulse"
                    />
                  ))
                : userTypeList.map((item) => (
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

            {/* Status filter */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                { id: 0, label: "Pending" },
                { id: 1, label: "Approved" },
                { id: 2, label: "Rejected" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStatus(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

        {/* ── Data table ── */}
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

      {/* ── Individual detail drawer ── */}
      <AnimatePresence>
        {selectedUser && tab !== 2 && (
          <>
            <motion.div
              key="drawer-backdrop"
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

      {/* ── Commercial full-profile modal ── */}
      <AnimatePresence>
        {companyDetailUserId && (
          <CompanyDetailModal
            userId={companyDetailRow?.userId}
            row={companyDetailRow}
            onClose={() => {
              setCompanyDetailUserId(null);
              setCompanyDetailRow(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Confirm verify/reject modal ── */}
      <AnimatePresence>
        {confirmState && (
          <ConfirmModal
            action={confirmState.action}
            user={confirmState.row}
            onConfirm={async ({ reason }) => {
              const response = await verifyUserRegistrationApi({
                userId: confirmState.row?.UserId ?? confirmState.row?.userId,
                approved: confirmState.action === "Verified" ? 1 : 2,
                reason,
              });
              userVerificationrefetch();
              setConfirmState(null);
              return response;
            }}
            onCancel={() => setConfirmState(null)}
            isOpen={!!confirmState}
            variant={confirmState.action === "Verified" ? "verify" : "reject"}
            message={`Are you sure you want to ${
              confirmState.action === "Verified" ? "verify" : "reject"
            } this user?`}
              requireReason={confirmState.action === "Rejected"}
          />
        )}
      </AnimatePresence>
    </>
  );
}
