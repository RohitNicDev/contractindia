
import {
    ChevronRight,
    ChevronLeft,
    GripVertical,
    Layers3,
    EyeOff,
    Zap,
    ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SERVICES_HIERARCHY } from "../../../../data/services_hierarchy";
import { useUserStore } from "../../../../store/store";
import { useQuery } from "@tanstack/react-query";
import { UserRegistrationUserIdGet } from "../../../../services/api";
import SubscriptionPlansFlow from "../SubscriptionPlansFlow";


const Step5ServiceListing = ({ store, nextStep, prevStep }) => {
    const loginResponce = useUserStore((state) => state?.loginResponce);
    const userId = loginResponce?.userId;

    const { data: UserData = [], refetch: refetchUserData } = useQuery({
        queryKey: ["UserData", userId],
        queryFn: async () => {
            const response = await UserRegistrationUserIdGet(userId);
            return response?.data ?? [];
        },
        enabled: !!userId,
        retry: false,
    });

    const [showPlans, setShowPlans] = useState(false);
    const [services, setServices] = useState(SERVICES_HIERARCHY);

    const colorMap = {
        violet: { border: "#c4b5fd", bg: "#f5f3ff", text: "#7c3aed", glow: "rgba(124, 58, 237, 0.4)" },
        cyan: { border: "#a5f3fc", bg: "#ecfeff", text: "#0891b2", glow: "rgba(8, 145, 178, 0.4)" },
        amber: { border: "#fde68a", bg: "#fffbeb", text: "#d97706", glow: "rgba(217, 119, 6, 0.4)" },
        rose: { border: "#fecdd3", bg: "#fff1f2", text: "#e11d48", glow: "rgba(225, 29, 72, 0.4)" },
        emerald: { border: "#a7f3d0", bg: "#ecfdf5", text: "#059669", glow: "rgba(5, 150, 105, 0.4)" },
    };
    const [activeIds, setActiveIds] = useState(store?.activeServices || []);
    const [expandedIds, setExpandedIds] = useState(store?.expandedServices || []);

    // Sync with store when it is loaded
    useEffect(() => {
        if (store?.activeServices) {
            setActiveIds(store.activeServices);
        }
        if (store?.expandedServices) {
            setExpandedIds(store.expandedServices);
        }
    }, [store]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);

    const toggleExpanded = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleActive = (id) => {
        const userObj = Array.isArray(UserData) ? UserData[0] : UserData;
        const hasPlan = userObj?.PlanID || userObj?.planID || userObj?.planId || userObj?.PlanId;
        const isCurrentlyActive = activeIds.includes(id);

        if (!isCurrentlyActive && !hasPlan) {
            toast.error("An active subscription plan is required to activate services.");
            setShowPlans(true);
            return;
        }

        setActiveIds((prev) => {
            if (isCurrentlyActive) {
                toast.success("Service deactivated");
                return prev.filter((x) => x !== id);
            }
            toast.success("Service activated");
            return [...prev, id];
        });
    };

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.currentTarget.style.opacity = "0.5";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
        setDraggedItem(null);
        setDragOverId(null);
    };

    const handleDragOver = (e, targetId) => {
        e.preventDefault();
        setDragOverId(targetId);
    };

    const countTotalChildren = (item) => {
        let count = 0;
        const children = item?.subServices || item?.children || [];
        children.forEach((child) => {
            count++;
            if (child.children || child.subServices) {
                count += countTotalChildren(child);
            }
        });
        return count;
    };

    const renderServiceItem = (item, level = 0, parentColor = "violet") => {
        const isExpanded = expandedIds.includes(item?.id);
        const isActive = activeIds.includes(item?.id);
        const hasChildren = (item?.subServices || item?.children)?.length > 0;
        const children = item?.subServices || item?.children || [];
        const color = item?.color || parentColor;
        const colors = colorMap[color];
        const isDraggedOver = dragOverId === item?.id;

        return (
            <div key={item?.id} className="relative">
                {/* Connecting line */}
                {level > 0 && (
                    <div
                        className="absolute left-0 top-0 h-full w-[2px] -translate-x-6 opacity-30"
                        style={{
                            background: `linear-gradient(to bottom, ${colors.border}, transparent)`,
                        }}
                    />
                )}

                {/* Service Card */}
                <motion.div
                    // draggable
                    // onDragStart={(e) => handleDragStart(e, item)}
                    // onDragEnd={handleDragEnd}
                    // onDragOver={(e) => handleDragOver(e, item?.id)}
                    whileHover={{ scale: 1.01 }}
                    className={`
            group relative mb-3 overflow-hidden rounded-2xl
            border-2 transition-all duration-300
            cursor-move
            ${isDraggedOver ? "scale-[1.02] ring-4 ring-offset-2" : ""}
            ${isActive ? "bg-white" : "bg-slate-50/50"}
          `}
                    style={{
                        borderColor: isDraggedOver ? colors.border : (isActive ? colors.border : "#e5e7eb"),
                        marginLeft: `${level * 40}px`,
                        boxShadow: isActive
                            ? `0 0 30px ${colors.glow}, 0 10px 40px -12px rgba(0,0,0,0.15)`
                            : "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                >
                    {/* Main content */}
                    <div className="relative p-4">
                        <div className="flex items-start gap-3">
                            {/* Drag handle */}
                            <GripVertical className="mt-1 h-5 w-5 flex-shrink-0 cursor-grab text-slate-300 transition-colors group-hover:text-slate-500" />

                            {/* Expand/Collapse button */}
                            {hasChildren && (
                                <button
                                    onClick={() => toggleExpanded(item?.id)}
                                    className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: isExpanded ? "rgb(241 245 250)" : "white",
                                    }}
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-3.5 w-3.5" style={{ color: colors.text }} />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5" style={{ color: colors.text }} />
                                    )}
                                </button>
                            )}

                            {/* Icon & Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        {/* Service Icon */}
                                        {level === 0 && item?.icon && (
                                            <div
                                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                                                style={{ backgroundColor: colors.bg }}
                                            >
                                                {item?.icon}
                                            </div>
                                        )}

                                        {/* Name & Details */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-bold ${level === 0 ? "text-base" : "text-sm"} text-slate-800`}>
                                                    {item?.name}
                                                </h4>

                                                {/* Level badge */}
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                    style={{
                                                        backgroundColor: colors.bg,
                                                        color: colors.text,
                                                    }}
                                                >
                                                    L{level}
                                                </span>
                                            </div>

                                            {/* Meta info */}
                                            {hasChildren && (
                                                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Layers3 className="h-3 w-3" />
                                                        {children?.length} items
                                                    </span>

                                                    {level === 0 && (
                                                        <span className="text-[10px]">
                                                            {countTotalChildren(item)} nested items
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active toggle */}
                                    <button
                                        onClick={() => toggleActive(item?.id)}
                                        className={`
                      flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 flex-shrink-0
                      text-xs font-bold transition-all
                      ${isActive ? "shadow-lg hover:shadow-xl" : "hover:scale-105"}
                    `}
                                        style={{
                                            borderColor: isActive ? colors.border : "#e5e7eb",
                                            backgroundColor: isActive ? colors.bg : "white",
                                            color: isActive ? colors.text : "#64748b",
                                            boxShadow: isActive ? `0 0 20px ${colors.glow}` : undefined,
                                        }}
                                    >
                                        {isActive ? (
                                            <>
                                                <Zap className="h-3 w-3" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="h-3 w-3 opacity-50" />
                                                Inactive
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active indicator glow */}
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

                {/* Render children recursively */}
                {isExpanded && hasChildren && (
                    <div className="relative ml-6 mt-2 space-y-2 border-l-2 border-dashed border-slate-200 pl-4">
                        {children.map((child) => renderServiceItem(child, level + 1, color))}
                    </div>
                )}
            </div>
        );
    };

    const handleSave = () => {
        store.setActiveServices(activeIds);
        store.setExpandedServices(expandedIds);
        toast.success(`✓ ${activeIds.length} services activated!`);
        nextStep();
    };

    const totalActive = activeIds.length;
    const totalServices = services.reduce((acc, s) => acc + 1 + countTotalChildren(s), 0);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-emerald-50 px-4 py-2 border-2 border-emerald-200">
                    <div className="text-xs font-medium text-emerald-600">Active Services</div>
                    <div className="text-2xl font-black text-emerald-700">{totalActive}</div>
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

            {/* Info */}
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                <GripVertical className="h-4 w-4" />
                <span className="font-medium">
                    Drag any service to reorder • Click chevron to expand/collapse • Click status badge to toggle
                </span>
            </div>

            {/* Service Tree */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-lg rounded-3xl p-6">
                <div className="space-y-4">
                    {services.map((service) => renderServiceItem(service))}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between gap-3 pt-6 border-t border-slate-100">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                >
                    Save & Continue <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            <SubscriptionPlansFlow
                open={showPlans}
                onClose={() => {
                    setShowPlans(false);
                    refetchUserData();
                }}
            />
        </div>
    );
}
export default Step5ServiceListing;