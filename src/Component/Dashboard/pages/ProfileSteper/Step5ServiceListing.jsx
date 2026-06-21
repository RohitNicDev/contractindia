import {
    ChevronRight,
    ChevronLeft,
    GripVertical,
    Layers3,
    EyeOff,
    Zap,
    ChevronDown,
    Loader,
    Crown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUserStore } from "../../../../store/store";
import { useProfileWizardStore } from "../../../../store/profileWizardStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getUserServicesByParam,
    UserSubscriptionDetailGet,
    UserServiceDetailsSave,
} from "../../../../services/api";
import SubscriptionPlansFlow from "../SubscriptionPlansFlow";

// ─── API helpers ───────────────────────────────────────────────────────────────
const fetchUserServices = async (userId) => {
    const response = await getUserServicesByParam(`userId=${userId}`);
    return response?.data ?? [];
};

const fetchUserSubscriptions = async (userId) => {
    const response = await UserSubscriptionDetailGet(`userId=${userId}`);
    return response?.data ?? [];
};

// ─── Color palette ─────────────────────────────────────────────────────────────
const colorMap = {
    violet: { border: "#c4b5fd", bg: "#f5f3ff", text: "#7c3aed", glow: "rgba(124,58,237,0.4)" },
    cyan: { border: "#a5f3fc", bg: "#ecfeff", text: "#0891b2", glow: "rgba(8,145,178,0.4)" },
    amber: { border: "#fde68a", bg: "#fffbeb", text: "#d97706", glow: "rgba(217,119,6,0.4)" },
    rose: { border: "#fecdd3", bg: "#fff1f2", text: "#e11d48", glow: "rgba(225,29,72,0.4)" },
    emerald: { border: "#a7f3d0", bg: "#ecfdf5", text: "#059669", glow: "rgba(5,150,105,0.4)" },
};
const COLOR_KEYS = Object.keys(colorMap);

// ─── Map flat API list → nested tree ──────────────────────────────────────────
const mapFlatToTree = (flat = []) => {
    const nodes = {};
    flat.forEach((it, idx) => {
        const id = String(it.ServiceID);
        nodes[id] = {
            id,
            serviceId: it.ServiceID,
            parentId: it.ParentServiceID,
            code: it.ServiceCode,
            name: it.ServiceName || it.ServiceCode || `Service ${it.ServiceID}`,
            description: it.ServiceDescription,
            icon: it.ServiceIcon || null,
            planId: it.PlanID,
            planName: it.PlanName,
            amount: it.Amount,
            isActive: !!Number(it.IsActive),
            userServiceId: it.UserServiceID ?? 0,
            color: COLOR_KEYS[idx % COLOR_KEYS.length],
            children: [],
        };
    });
    const roots = [];
    Object.values(nodes).forEach((n) => {
        const parentKey = String(n.parentId || 0);
        if (n.parentId && nodes[parentKey]) {
            nodes[parentKey].children.push(n);
        } else {
            roots.push(n);
        }
    });
    return roots;
};

// ─── Count all nested children ─────────────────────────────────────────────────
const countTotalChildren = (item) => {
    const children = item?.subServices || item?.children || [];
    return children.reduce((acc, c) => acc + 1 + countTotalChildren(c), 0);
};

// ─── Flatten tree to get all node ids ─────────────────────────────────────────
const flattenTree = (nodes) => {
    const result = [];
    const walk = (list) => list.forEach((n) => { result.push(n); walk(n.children || []); });
    walk(nodes);
    return result;
};

// ═══════════════════════════════════════════════════════════════════════════════
const Step5ServiceListing = ({ store, nextStep, prevStep, navbar = false }) => {
    const { loginResponce } = useUserStore();
    const userId = loginResponce?.userId;

    // ── Fetch services ──────────────────────────────────────────────────────────
    const {
        data: rawServices = [],
        isLoading: servicesLoading,
    } = useQuery({
        queryKey: ["userServices", userId],
        queryFn: () => fetchUserServices(userId),
        enabled: !!userId,
        retry: false,
    });

    // ── Fetch subscriptions ─────────────────────────────────────────────────────
    const {
        data: subscriptions = [],
        isLoading: subscriptionsLoading,
        refetch: refetchSubscriptions,
    } = useQuery({
        queryKey: ["userSubscriptions", userId],
        queryFn: () => fetchUserSubscriptions(userId),
        enabled: !!userId,
        retry: false,
    });

    // ── Derive active plan: index [0] = most recent, must be IsActive === 1 ───
    const activePlan = subscriptions.find((s) => s.IsActive === 1) ?? null;
    // Use index 0 if it's active, else no plan
    const latestSub = subscriptions[0] ?? null;
    const hasActivePlan = latestSub?.IsActive === 1;

    // ── Build tree & initial active ids from API ────────────────────────────────
    const [services, setServices] = useState([]);
    const [activeIds, setActiveIds] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [showPlans, setShowPlans] = useState(false);
    const [saving, setSaving] = useState(false);
    const profileStore = store ?? useProfileWizardStore();

    useEffect(() => {
        if (!rawServices.length) return;
        const tree = mapFlatToTree(rawServices);
        setServices(tree);

        // Pre-select services that are already active from API
        const alreadyActive = rawServices
            .filter((s) => Number(s.IsActive) === 1)
            .map((s) => String(s.ServiceID));
        setActiveIds(alreadyActive);
    }, [rawServices]);

    // ── Save service mutation ───────────────────────────────────────────────────
    const { mutateAsync: saveService } = useMutation({
        mutationFn: UserServiceDetailsSave,
    });

    // ── Toggle active (optimistic + API save) ─────────────────────────────────
    const toggleActive = async (item) => {
        const id = item.id;
        const isCurrentlyActive = activeIds.includes(id);

        if (!isCurrentlyActive && !hasActivePlan) {
            toast.error("An active subscription plan is required to activate services.");
            setShowPlans(true);
            return;
        }

        // optimistic UI update
        setActiveIds((prev) => (isCurrentlyActive ? prev.filter((x) => x !== id) : [...prev, id]));

        try {
            await saveService({
                userServiceID: item.userServiceId ?? 0,
                userID: userId,
                serviceID: item.serviceId,
                serviceName: item.name,
                planID: latestSub?.PlanID ?? item.planId ?? 0,
                planName: latestSub?.PlanName ?? item.planName ?? "",
                amount: item.amount ?? 0,
                remark: "",
                enterredIP: "",
                enterredBy: userId,
                enterDate: new Date().toISOString(),
                isActive: isCurrentlyActive ? 0 : 1,
            });

            toast.success(isCurrentlyActive ? "Service deactivated" : "Service activated");
        } catch (err) {
            // rollback optimistic change
            setActiveIds((prev) => (isCurrentlyActive ? [...prev, id] : prev.filter((x) => x !== id)));
            toast.error(err?.message || "Failed to update service status. Please try again.");
        }
    };

    const toggleExpanded = (id) =>
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    // ── Save local service selections only (no API call) ───────────────────────
    const handleSave = async () => {
        if (!hasActivePlan) {
            toast.error("You need an active subscription plan before saving services.");
            setShowPlans(true);
            return;
        }

        setSaving(true);

        try {
            profileStore.setActiveServices?.(activeIds);
            profileStore.setExpandedServices?.(expandedIds);
            toast.success(`✓ ${activeIds.length} service${activeIds.length !== 1 ? "s" : ""} saved!`);
            nextStep?.();
        } catch (err) {
            toast.error("Failed to save service selection. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ── Render one service card ─────────────────────────────────────────────────
    const renderServiceItem = (item, level = 0, parentColor = "violet") => {
        const isExpanded = expandedIds.includes(item?.id);
        const isActive = activeIds.includes(item?.id);
        const hasChildren = (item?.children)?.length > 0;
        const children = item?.children || [];
        const color = item?.color || parentColor;
        const colors = colorMap[color];
        const indent = level * 40;

        return (
            <div key={item?.id} className="relative">
                {level > 0 && (
                    <div
                        className="absolute left-0 top-0 h-full w-[2px] -translate-x-6 opacity-30"
                        style={{ background: `linear-gradient(to bottom, ${colors.border}, transparent)` }}
                    />
                )}

                <motion.div
                    whileHover={{ scale: 1.005 }}
                    className={`group relative mb-3 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${isActive ? "bg-white" : "bg-slate-50/50"
                        }`}
                    style={{
                        borderColor: isActive ? colors.border : "#e5e7eb",
                        marginLeft: `${indent}px`,
                        boxShadow: isActive
                            ? `0 0 30px ${colors.glow}, 0 10px 40px -12px rgba(0,0,0,0.15)`
                            : "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                >
                    <div className="relative p-4">
                        <div className="flex items-start gap-3">
                            <GripVertical className="mt-1 h-5 w-5 shrink-0 text-slate-300 group-hover:text-slate-400" />

                            {hasChildren && (
                                <button
                                    onClick={() => toggleExpanded(item?.id)}
                                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all"
                                    style={{ borderColor: colors.border, backgroundColor: isExpanded ? "#f1f5fa" : "white" }}
                                >
                                    {isExpanded
                                        ? <ChevronDown className="h-3.5 w-3.5" style={{ color: colors.text }} />
                                        : <ChevronRight className="h-3.5 w-3.5" style={{ color: colors.text }} />
                                    }
                                </button>
                            )}

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        {level === 0 && item?.icon && (
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                                                style={{ backgroundColor: colors.bg }}
                                            >
                                                {item.icon}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className={`font-bold text-slate-800 ${level === 0 ? "text-base" : "text-sm"}`}>
                                                    {item?.name}
                                                </h4>
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                    style={{ backgroundColor: colors.bg, color: colors.text }}
                                                >
                                                    L{level}
                                                </span>
                                            </div>
                                            {hasChildren && (
                                                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Layers3 className="h-3 w-3" />
                                                        {children.length} items
                                                    </span>
                                                    {level === 0 && (
                                                        <span className="text-[10px]">
                                                            {countTotalChildren(item)} nested
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Toggle button */}
                                    <button
                                        onClick={() => toggleActive(item)}
                                        className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 shrink-0 text-xs font-bold transition-all hover:scale-105"
                                        style={{
                                            borderColor: isActive ? colors.border : "#e5e7eb",
                                            backgroundColor: isActive ? colors.bg : "white",
                                            color: isActive ? colors.text : "#64748b",
                                            boxShadow: isActive ? `0 0 20px ${colors.glow}` : undefined,
                                        }}
                                    >
                                        {isActive
                                            ? <><Zap className="h-3 w-3" /> Active</>
                                            : <><EyeOff className="h-3 w-3 opacity-50" /> Inactive</>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isActive && (
                        <div
                            className="absolute bottom-0 left-0 right-0 h-[3px]"
                            style={{
                                background: `linear-gradient(to right, ${colors.glow}, ${colors.text}, ${colors.glow})`,
                                boxShadow: `0 0 10px ${colors.glow}`,
                            }}
                        />
                    )}
                </motion.div>

                {isExpanded && hasChildren && (
                    <div className="relative ml-6 mt-2 space-y-2 border-l-2 border-dashed border-slate-200 pl-4">
                        {children.map((child) => renderServiceItem(child, level + 1, color))}
                    </div>
                )}
            </div>
        );
    };

    const totalServices = services.reduce((acc, s) => acc + 1 + countTotalChildren(s), 0);
    const isLoading = servicesLoading || subscriptionsLoading;

    return (
        <div className="space-y-6">

            {/* Active plan banner */}
            {hasActivePlan ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <Crown className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-700">
                            Active Plan: {latestSub.PlanName}
                        </p>
                        <p className="text-[10px] text-emerald-600">
                            Subscription #{latestSub.SubscriptionID} · activated{" "}
                            {new Date(latestSub.EnterDate).toLocaleDateString()}
                        </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Plan ID {latestSub.PlanID}
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                        <p className="text-xs font-semibold text-amber-700">
                            No active subscription. Subscribe to activate services.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowPlans(true)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold hover:bg-amber-600 transition-colors"
                    >
                        View Plans
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-emerald-50 px-4 py-2 border-2 border-emerald-200">
                    <div className="text-xs font-medium text-emerald-600">Active Services</div>
                    <div className="text-2xl font-black text-emerald-700">{activeIds.length}</div>
                </div>
                <div className="rounded-xl bg-violet-50 px-4 py-2 border-2 border-violet-200">
                    <div className="text-xs font-medium text-violet-600">Total Services</div>
                    <div className="text-2xl font-black text-violet-700">{totalServices}</div>
                </div>
                <div className="rounded-xl bg-cyan-50 px-4 py-2 border-2 border-cyan-200">
                    <div className="text-xs font-medium text-cyan-600">Expanded</div>
                    <div className="text-2xl font-black text-cyan-700">{expandedIds.length}</div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
                <GripVertical className="h-4 w-4" />
                <span className="font-medium text-xs">
                    Click chevron to expand/collapse · Click status badge to toggle
                </span>
            </div>

            {/* Service tree */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-slate-500">Loading services…</span>
                </div>
            ) : services.length === 0 ? (
                <div className="flex items-center justify-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-sm text-slate-400">No services found for your account.</p>
                </div>
            ) : (
                <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-lg rounded-3xl p-6">
                    <div className="space-y-4">
                        {services.map((s) => renderServiceItem(s))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            {!navbar && <div className="flex justify-between gap-3 pt-6 border-t border-slate-100">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !hasActivePlan}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {saving
                        ? <><Loader className="w-4 h-4 animate-spin" /> Saving…</>
                        : <>Save & Continue <ChevronRight className="w-4 h-4" /></>
                    }
                </button>
            </div>}

            {/* Plans modal */}
            <SubscriptionPlansFlow
                open={showPlans}
                onClose={() => {
                    setShowPlans(false);
                    refetchSubscriptions();
                }}
            />
        </div>
    );
};

export default Step5ServiceListing;