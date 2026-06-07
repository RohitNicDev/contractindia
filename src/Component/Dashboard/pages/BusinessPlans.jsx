import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, gradBtn, glass } from "../../uiUtiles";
import { existingPlans } from "../../../data/json";
import {
    planMasterSave,
    planMasterUpdate,
    planMasterDelete,
    planMasterGet,
    planMasterGetById,
} from "../../../services/api";




const planMasterGetApi = async () => {
    const response = await planMasterGet();
    console.log(response, "response");

    return response ?? [];
};
const planMasterGetByIdApi = async (planId) => {
    const response = await planMasterGetById(planId);
    console.log(response, "response");

    return response ?? [];
};
 
const planMasterDeleteApi = async (planId) => {
    const response = await planMasterDelete(planId);
    console.log(response, "response");

    return response ?? [];
};
const planMasterSaveApi = async (payload) => {
    const response = await planMasterSave({
        planName: payload?.planName,
        price: payload?.price,
        creditsIncluded: payload?.creditsIncluded,
        durationType: payload?.durationType,
        remark: payload?.remark,
    });
    console.log(response, "response");

    return response ?? [];
};
const planMasterUpdateApi = async (payload) => {
    const response = await planMasterUpdate({
        planID: payload?.planID,
        planName: payload?.planName,
        price: payload?.price,
        creditsIncluded: payload?.creditsIncluded,
        durationType: payload?.durationType,
        remark: payload?.remark,
    });
    console.log(response, "response");

    return response ?? [];
};


const BusinessPlans = () => {

    const [planDraft, setPlanDraft] = useState({
        planID: 0,
        planName: "",
        price: "",
        creditsIncluded: "",
        durationType: "Monthly",
        remark: "",
        isActive: true,
    });
    const [selectedPlanId, setSelectedPlanId] = useState(0);

    const { data: fetchedPlans = [], isLoading, error, refetch } = useQuery({
        queryKey: ["planMasterList"],
        queryFn: planMasterGetApi,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const plans = fetchedPlans && fetchedPlans.length > 0 ? fetchedPlans : [];

    const resetForm = () => {
        setSelectedPlanId(0);
        setPlanDraft({
            planID: 0,
            planName: "",
            price: "",
            creditsIncluded: "",
            durationType: "Monthly",
            remark: "",

        });
    };

   

    const { mutate: planMasterSaveMutate, planMasterSaveIsPending } = useMutation({
        mutationFn: planMasterSaveApi,
        onSuccess: (response) => {
            if (!response?.status) {
                toast.error(response?.message || "Failed to create plan.");
                return;
            }
            toast.success(response?.message || "Plan created successfully.");
            resetForm();
            refetch(); // Refetch the plan list to show the new plan  
        },
        onError: (error) => {
            toast.error(error?.message || "Unable to create plan.");
        },
    });

    const { mutate: planMasterupdateMutation, isLoading: updateIsLoading } = useMutation( {
        mutationFn: planMasterUpdateApi,
        onSuccess: (response) => {
            if (!response?.status) {
                toast.error(response?.message || "Failed to update plan.");
                return;
            }
            toast.success(response?.message || "Plan updated successfully.");
            resetForm();
            refetch(); // Refetch the plan list to show the updated plan
        },
        onError: (error) => {
            toast.error(error?.message || "Unable to update plan.");
        },
    }); 

    const { mutate: deleteMutation, isLoading: deleteIsLoading } = useMutation({
        mutationFn: planMasterDeleteApi,
        onSuccess: (response) => {
            if (!response?.status) {
                toast.error(response?.message || "Failed to delete plan.");
                return;
            }
            toast.success(response?.message || "Plan deleted successfully.");
            refetch(); // Refetch the plan list to show the updated plan
        },
        onError: (error) => {
            toast.error(error?.message || "Unable to delete plan.");
        },
    });

    const handleEdit = (plan) => {
        setSelectedPlanId(plan.planID ?? plan.id ?? 0);
        setPlanDraft({
            planID: plan.planID ?? plan.id ?? 0,
            planName: plan.planName ?? plan.name ?? "",
            price: String(plan.price ?? ""),
            creditsIncluded: String(plan.creditsIncluded ?? plan.credits ?? ""),
            durationType: plan.durationType ?? plan.duration ?? "Monthly",
            remark: plan.remark ?? plan.features ?? "",
            isActive: plan.isActive === 0 ? false : true,
        });
    };

    const handleDelete = (plan) => {
        const planId = plan.planID ?? plan.id;
        if (!planId) {
            toast.error("Cannot delete plan without valid id.");
            return;
        }
        deleteMutation.mutate(planId);
    };

    const onSubmit = () => {
        if (!planDraft.planName.trim()) {
            toast.error("Plan name is required.");
            return;
        }

        const payload = {
            planID: selectedPlanId || 0,
            planName: planDraft.planName,
            price: Number(planDraft.price) || 0,
            creditsIncluded: Number(planDraft.creditsIncluded) || 0,
            durationType: planDraft.durationType,
            remark: planDraft.remark,
            enterredIP: window.location.hostname || "",
            enterredBy: 0,
            enterDate: new Date().toISOString(),
            isActive: planDraft.isActive ? 1 : 0,
        };

        if (selectedPlanId) {
            planMasterupdateMutation(payload);
        } else {
            //   saveMutation.mutate(payload);
            planMasterSaveMutate(payload); // Directly call the API function instead of using the mutation for demonstration
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Business Plans</h2>
                    <p className="text-sm text-slate-500">
                        Manage plan master entries with backend create, update, delete, and list operations.
                    </p>
                </div>
                <div className="text-xs text-slate-500">
                    {isLoading ? "Loading plans..." :"" + plans.length + " plan(s) found."}
                </div>
            </div>

            <div style={{ ...glass, padding: "20px" }}>
                <h3 className="font-semibold text-slate-700 mb-4">Current Plans</h3>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.planID ?? plan.planName}
                            style={{
                                background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))",
                                border: "1px solid rgba(99,102,241,0.15)",
                                borderRadius: "12px",
                                padding: "18px",
                            }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">{plan.planName}</p>
                                    <p className="text-sm text-slate-500 mt-1">{plan.durationType || "Monthly"}</p>
                                </div>
                                <Badge color={plan.isActive ? "green" : "yellow"}>
                                    {plan.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">{typeof plan.price === "number" ? `₹${plan.price}` : plan.price}</p>
                            <p className="text-sm text-slate-500 mt-2">Credits: {plan.creditsIncluded ?? plan.credits}</p>
                            <p className="text-sm text-slate-500 mt-2">{plan.remark}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(plan)}
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(plan)}
                                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                                    disabled={deleteMutation.isLoading}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ ...glass, padding: "20px" }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-700">{selectedPlanId ? "Update Plan" : "Create New Plan"}</h3>
                        <p className="text-sm text-slate-500 mt-1">Use this form to add a new plan or update an existing one.</p>
                    </div>
                    {selectedPlanId ? (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel Edit
                        </button>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-600">
                        Plan Name
                        <input
                            value={planDraft.planName}
                            onChange={(e) => setPlanDraft({ ...planDraft, planName: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-600">
                        Price
                        <input
                            type="number"
                            value={planDraft.price}
                            onChange={(e) => setPlanDraft({ ...planDraft, price: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-600">
                        Credits Included
                        <input
                            type="number"
                            value={planDraft.creditsIncluded}
                            onChange={(e) => setPlanDraft({ ...planDraft, creditsIncluded: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-600">
                        Duration
                        <select
                            value={planDraft.durationType}
                            onChange={(e) => setPlanDraft({ ...planDraft, durationType: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                        >
                            <option>Monthly</option>
                            <option>Yearly</option>
                        </select>
                    </label>

                    <label className="col-span-1 block text-sm font-medium text-slate-600 md:col-span-2">
                        Remark
                        <textarea
                            value={planDraft.remark}
                            onChange={(e) => setPlanDraft({ ...planDraft, remark: e.target.value })}
                            rows={3}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 resize-none"
                        />
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                        <input
                            type="checkbox"
                            checked={planDraft.isActive}
                            onChange={(e) => setPlanDraft({ ...planDraft, isActive: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                        />
                        Active
                    </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={planMasterSaveIsPending || updateIsLoading}
                        style={gradBtn}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    >
                        {selectedPlanId ? (updateIsLoading ? "Updating…" : "Update Plan") : planMasterSaveIsPending ? "Saving…" : "Create Plan"}
                    </button>
                    {selectedPlanId ? (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Reset
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default BusinessPlans;
