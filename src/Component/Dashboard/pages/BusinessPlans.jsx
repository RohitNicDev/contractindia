import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge, gradBtn, glass } from "../../common/uiUtiles";
import CustomHeading from "../../common/CustomHeading";
import { Form, Input, InputNumber, Select, Switch, Table, Button } from "antd";

import {
  Briefcase,
  Plus,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Blocks,
} from "lucide-react";

import CommonModal from "../../common/CommonModal";

import {
  planMasterSave,
  planMasterUpdate,
  planMasterDelete,
  planMasterGet,
} from "../../../services/api";

const planMasterGetApi = async () => {
  const response = await planMasterGet();
  return response?.data ?? [];
};

const planMasterDeleteApi = async (planId) => {
  const response = await planMasterDelete(planId);
  return response ?? [];
};

const planMasterSaveApi = async (payload) => {
  const response = await planMasterSave(payload);
  return response ?? [];
};

const planMasterUpdateApi = async (payload) => {
  const response = await planMasterUpdate(payload);
  return response ?? [];
};

const BusinessPlans = () => {
  const [form] = Form.useForm();
  const [planModal, setPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(0);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    plan: null,
  });

  const [viewModal, setViewModal] = useState({
    open: false,
    plan: null,
  });
  const {
    data: fetchedPlans = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["planMasterList"],
    queryFn: planMasterGetApi,

    retry: 1,
  });

  const plans = fetchedPlans && fetchedPlans.length > 0 ? fetchedPlans : [];

  const resetForm = () => {
    setSelectedPlanId(0);
    form.resetFields();
    form.setFieldsValue({
      durationType: "Monthly",
      isActive: true,
    });
  };
 
  const handleOpenCreateModal = () => {
    setSelectedPlanId(0);

    form.resetFields();

    form.setFieldsValue({
      durationType: "Monthly",
      isActive: true,
    });

    setPlanModal(true);
  };
  const handleOpenEditModal = (plan) => {
    console.log("Edit Plan:", plan);

    const planId = plan?.PlanID ?? plan?.planID ?? plan?.id ?? 0;

    setSelectedPlanId(planId);

    form.setFieldsValue({
      planName: plan?.PlanName ?? plan?.planName ?? "",
      price: plan?.Price ?? plan?.price ?? 0,
      creditsIncluded:
        plan?.CreditsIncluded ?? plan?.creditsIncluded ?? plan?.credits ?? 0,
      durationType:
        plan?.DurationType ?? plan?.durationType ?? plan?.duration ?? "Monthly",
      remark: plan?.Remark ?? plan?.remark ?? plan?.features ?? "",
      isActive:
        plan?.IsActive === 1 || plan?.isActive === 1 || plan?.isActive === true,
    });

    setPlanModal(true);
  };
  //   const handleOpenEditModal = (plan) => {
  //     setSelectedPlanId(plan.planID ?? plan.id ?? 0);
  //     form.setFieldsValue({
  //       planName: plan.planName ?? plan.name ?? "",
  //       price: plan.price ?? 0,
  //       creditsIncluded: plan.creditsIncluded ?? plan.credits ?? 0,
  //       durationType: plan.durationType ?? plan.duration ?? "Monthly",
  //       remark: plan.remark ?? plan.features ?? "",
  //       isActive: plan.isActive === 0 ? false : true,
  //     });
  //     setIsModalOpen(true);
  //   };

  //   const handleCancelModal = () => {
  //     setIsModalOpen(false);
  //     resetForm();
  //   };
  const handleCancelModal = () => {
    setPlanModal(false);

    setSelectedPlanId(0);

    form.resetFields();
  };
  const { mutate: planMasterSaveMutate, isPending: planMasterSaveIsPending } =
    useMutation({
      mutationFn: planMasterSaveApi,
      onSuccess: (response) => {
        if (!response?.status) {
          toast.error(response?.message || "Failed to create plan.");
          return;
        }
        toast.success(response?.message || "Plan created successfully.");
        setPlanModal(false);
        resetForm();
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || "Unable to create plan.");
      },
    });

  const { mutate: planMasterupdateMutation, isPending: updateIsLoading } =
    useMutation({
      mutationFn: planMasterUpdateApi,
      onSuccess: (response) => {
        if (!response?.status) {
          toast.error(response?.message || "Failed to update plan.");
          return;
        }
        toast.success(response?.message || "Plan updated successfully.");
        setPlanModal(false);
        resetForm();
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || "Unable to update plan.");
      },
    });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: planMasterDeleteApi,
    onSuccess: (response) => {
      if (!response?.status) {
        toast.error(response?.message || "Failed to delete plan.");
        return;
      }
      toast.success(response?.message || "Plan deleted successfully.");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.message || "Unable to delete plan.");
    },
  });

  const handleDelete = (plan) => {
    setDeleteModal({
      open: true,
      plan,
    });
  };

  const onFinish = (values) => {
    const payload = {
      planID: selectedPlanId || 0,
      planName: values.planName,
      price: Number(values.price),
      creditsIncluded: Number(values.creditsIncluded),
      durationType: values.durationType,
      remark: values.remark,
      enterredIP: window.location.hostname,
      enterredBy: 0,
      enterDate: new Date().toISOString(),
      isActive: values.isActive ? 1 : 0,
    };
    if (selectedPlanId) {
      planMasterupdateMutation(payload);
    } else {
      planMasterSaveMutate(payload);
    }
  };

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "PlanName",
      key: "PlanName",
      render: (text) => (
        <span className="font-semibold text-slate-800">{text}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (price) => `₹${price ?? 0}`,
    },
    {
      title: "Credits",
      dataIndex: "CreditsIncluded",
      key: "CreditsIncluded",
      render: (_, record) => record?.CreditsIncluded ?? 0,
    },
    {
      title: "Duration",
      dataIndex: "DurationType",
      key: "DurationType",
      render: (_, record) => record.DurationType ?? "",
    },
    // {
    //     title: "Remark",
    //     dataIndex: "remark",
    //     key: "remark",
    // },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (_, record) => (
        <Badge color={Number(record.IsActive) === 1 ? "green" : "yellow"}>
          {Number(record.IsActive) === 1 ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setViewModal({
                open: true,
                plan: record,
              })
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleOpenEditModal(record)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(record)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.07),_transparent_55%),#f8fafc] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <CustomHeading
          title="Business Plans"
          subtitle="Manage plan master entries with create, update, delete, and list operations."
          icon={Briefcase}
          badge={isLoading ? undefined : `${plans.length} plan(s)`}
          badgeColor="violet"
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Create New Plan
              </button>
            </div>
          }
        />

        <div style={{ ...glass, padding: "20px" }}>
          <Table
            columns={columns}
            dataSource={plans}
            rowKey={(record) => record.PlanID ?? record.planID ?? record.id ?? Math.random()}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
            className="modern-table"
          />
        </div>
        <CommonModal
          isOpen={planModal}
          onClose={handleCancelModal}
          title={
            selectedPlanId ? "Update Business Plan" : "Create Business Plan"
          }
          subtitle="Manage pricing and credits"
          icon={<Briefcase className="h-4 w-4" />}
          variant="default"
          size="lg"
          confirmLabel={selectedPlanId ? "Update Plan" : "Create Plan"}
          onConfirm={() => form.submit()}
          isLoading={planMasterSaveIsPending || updateIsLoading}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-4"
            initialValues={{ durationType: "Monthly", isActive: true }}
          >
            <Form.Item
              name="planName"
              label={
                <span className="font-medium text-slate-600">Plan Name</span>
              }
              rules={[
                { required: true, message: "Please enter the plan name" },
              ]}
            >
              <Input
                placeholder="e.g. Basic Plan"
                className="rounded-xl px-3 py-2"
              />
            </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="price"
                  label={
                    <span className="font-medium text-slate-600">
                      Price (₹)
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter the price" },
                  ]}
                >
                  <InputNumber
                    className="w-full rounded-xl"
                    placeholder="0"
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  name="creditsIncluded"
                  label={
                    <span className="font-medium text-slate-600">
                      Credits Included
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter credits" }]}
                >
                  <InputNumber
                    className="w-full rounded-xl"
                    placeholder="0"
                    min={0}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="durationType"
                label={
                  <span className="font-medium text-slate-600">
                    Duration Type
                  </span>
                }
              >
                <Select className="rounded-xl">
                  <Select.Option value="Monthly">Monthly</Select.Option>
                  <Select.Option value="Yearly">Yearly</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="remark"
                label={
                  <span className="font-medium text-slate-600">
                    Remark / Features
                  </span>
                }
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Add any details or features..."
                  className="rounded-xl resize-none"
                />
              </Form.Item>

              <Form.Item name="isActive" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>

              {/* <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handleCancelModal}
                className="rounded-xl font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={planMasterSaveIsPending || updateIsLoading}
                style={gradBtn}
                className="rounded-xl font-semibold border-none"
              >
                {selectedPlanId ? "Update Plan" : "Create Plan"}
              </Button>
            </div> */}
          </Form>
        </CommonModal>
        <CommonModal
          isOpen={viewModal.open}
          onClose={() =>
            setViewModal({
              open: false,
              plan: null,
            })
          }
          title="Plan Details"
          subtitle="View plan information"
          icon={<Eye className="h-4 w-4" />}
          variant="info"
          size="md"
          hideFooter
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Plan Name</p>
              <p className="font-semibold">{viewModal.plan?.PlanName}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Price</p>
              <p className="font-semibold">₹{viewModal.plan?.Price}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Credits</p>
              <p className="font-semibold">{viewModal.plan?.CreditsIncluded}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Duration</p>
              <p className="font-semibold">{viewModal.plan?.DurationType}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Remark</p>
              <p className="font-semibold">{viewModal.plan?.Remark}</p>
            </div>
          </div>
        </CommonModal>
        <CommonModal
          isOpen={deleteModal.open}
          onClose={() =>
            setDeleteModal({
              open: false,
              plan: null,
            })
          }
          title="Delete Plan"
          subtitle="This action cannot be undone"
          icon={<Trash2 className="h-4 w-4" />}
          variant="danger"
          size="sm"
          confirmLabel="Delete"
          onConfirm={async () => {
            const response = await planMasterDeleteApi(deleteModal.plan.PlanID);

            if (response?.status) {
              toast.success(response.message);

              refetch();

              setDeleteModal({
                open: false,
                plan: null,
              });
            } else {
              toast.error(response?.message || "Delete failed");
            }
          }}
        >
          <p className="text-sm text-slate-600">
            Are you sure you want to delete
            <span className="font-semibold text-slate-900">
              {" "}
              {deleteModal.plan?.PlanName}
            </span>
            ?
          </p>
        </CommonModal>
        {/* <Modal
          title={selectedPlanId ? "Update Plan" : "Create New Plan"}
          open={isModalOpen}
          onCancel={handleCancelModal}
          footer={null}
          centered
          destroyOnClose
        >
   
        </Modal> */}
      </div>
    </div>
  );
};

export default BusinessPlans;
