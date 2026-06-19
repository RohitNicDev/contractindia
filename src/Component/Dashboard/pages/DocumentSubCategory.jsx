import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form, Input, Switch, Table, Select } from "antd";
import { FolderOpen, Plus, RefreshCw, Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "../../common/uiUtiles";
import CustomHeading from "../../common/CustomHeading";
import CommonModal from "../../common/CommonModal";

import {
  DocumentSubCategoryGet,
  DocumentSubCategorySave,
  DocumentSubCategoryUpdate,
  DocumentSubCategoryDelete,
  DocumentCategoryGet,
} from "../../../services/api";
import DataTableComponent from "../../common/dataTable";

/* ==========================================================================
   API ADAPTERS
   ========================================================================== */
const DocumentSubCategoryGetApi = async () => {
  const response = await DocumentSubCategoryGet();
  return response?.data ?? response ?? [];
};

const DocumentCategoryGetApi = async () => {
  const response = await DocumentCategoryGet();
  return response?.data ?? response ?? [];
};

const DocumentSubCategorySaveApi = async (payload) => {
  const response = await DocumentSubCategorySave(payload);
  return response ?? {};
};

const DocumentSubCategoryUpdateApi = async (payload) => {
  const response = await DocumentSubCategoryUpdate(payload);
  return response ?? {};
};

const DocumentSubCategoryDeleteApi = async (id) => {
  const response = await DocumentSubCategoryDelete(id);
  return response ?? {};
};

/* ==========================================================================
   HELPERS
   ========================================================================== */
const resolveActive = (record) =>
  record?.IsActive === true ||
  record?.IsActive === 1 ||
  record?.isActive === true ||
  record?.isActive === 1;

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const DocumentSubCategory = () => {
  const [form] = Form.useForm();
  const [selectedId, setSelectedId] = useState(0);
  const [formModal, setFormModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [viewModal, setViewModal] = useState({ open: false, record: null });

  /* ── Fetch sub-category list ── */
  const {
    data: fetchedList = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["DocumentSubCategoryList"],
    queryFn: DocumentSubCategoryGetApi,
    retry: 1,
  });

  /* ── Fetch parent categories for the dropdown ── */
  const { data: categoryList = [], isLoading: catLoading } = useQuery({
    queryKey: ["DocumentCategoryList"],
    queryFn: DocumentCategoryGetApi,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const list = Array.isArray(fetchedList) ? fetchedList : [];

  /* ── Category lookup helper ── */
  const getCategoryName = (id) => {
    const found = categoryList.find(
      (c) => (c?.documentCategoryID ?? c?.DocumentCategoryID) === id,
    );
    return (
      found?.documentCategoryName ?? found?.DocumentCategoryName ?? `ID: ${id}`
    );
  };

  /* ── Category options for Select ── */
  const categoryOptions = categoryList.map((c) => ({
    value: c?.documentCategoryID ?? c?.DocumentCategoryID,
    label: c?.documentCategoryName ?? c?.DocumentCategoryName ?? "—",
  }));

  /* ── Modal helpers ── */
  const openCreateModal = () => {
    setSelectedId(0);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setFormModal(true);
  };

  const openEditModal = (record) => {
    const id =
      record?.DocumentSubCategoryID ??
      record?.documentSubCategoryID ??
      record?.id ??
      0;
    setSelectedId(id);
    form.setFieldsValue({
      documentSubCategoryName:
        record?.DocumentSubCategoryName ??
        record?.documentSubCategoryName ??
        "",
      documentCategoryID:
        record?.DocumentCategoryID ?? record?.documentCategoryID ?? undefined,
      isActive: resolveActive(record),
    });
    setFormModal(true);
  };

  const closeModal = () => {
    setFormModal(false);
    setSelectedId(0);
    form.resetFields();
  };

  /* ── Save mutation ── */
  const { mutate: saveMutate, isPending: isSaving } = useMutation({
    mutationFn: DocumentSubCategorySaveApi,
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || "Failed to create sub-category.");
        return;
      }
      toast.success(res?.message || "Sub-category created successfully.");
      closeModal();
      refetch();
    },
    onError: (err) =>
      toast.error(err?.message || "Unable to create sub-category."),
  });

  /* ── Update mutation ── */
  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: DocumentSubCategoryUpdateApi,
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || "Failed to update sub-category.");
        return;
      }
      toast.success(res?.message || "Sub-category updated successfully.");
      closeModal();
      refetch();
    },
    onError: (err) =>
      toast.error(err?.message || "Unable to update sub-category."),
  });

  /* ── Delete mutation ── */
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: DocumentSubCategoryDeleteApi,
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || "Failed to delete sub-category.");
        return;
      }
      toast.success(res?.message || "Sub-category deleted successfully.");
      setDeleteModal({ open: false, record: null });
      refetch();
    },
    onError: (err) =>
      toast.error(err?.message || "Unable to delete sub-category."),
  });

  /* ── Form submit ── */
  const onFinish = (values) => {
    const payload = {
      documentSubCategoryID: selectedId || 0,
      documentSubCategoryName: values.documentSubCategoryName?.trim(),
      documentCategoryID: values.documentCategoryID,
      isActive: values.isActive ? 1 : 0,
    };

    if (selectedId) {
      updateMutate(payload);
    } else {
      saveMutate(payload);
    }
  };

  /* ── Table columns ── */
  const columns = [
    {
      title: "Sub-Category Name",
      key: "documentSubCategoryName",
      render: (_, record) => (
        <span className="font-semibold text-slate-800">
          {record?.DocumentSubCategoryName ??
            record?.documentSubCategoryName ??
            "—"}
        </span>
      ),
    },
    {
      title: "Parent Category",
      key: "documentCategoryID",
      render: (_, record) => {
        const catId = record?.DocumentCategoryID ?? record?.documentCategoryID;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            {getCategoryName(catId)}
          </span>
        );
      },
    },

    {
      title: "Status",
      key: "isActive",
      width: 110,
      render: (_, record) => {
        const active = resolveActive(record);
        return (
          <Badge color={active ? "green" : "yellow"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      title: "Created",
      key: "createdDate",
      width: 120,
      render: (_, record) => (
        <span className="text-xs text-slate-500">
          {formatDate(record?.CreatedDate ?? record?.createdDate)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewModal({ open: true, record })}
            title="View"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => openEditModal(record)}
            title="Edit"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, record })}
            title="Delete"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.07),_transparent_55%),#f8fafc] p-4 sm:p-6">
      <div className="mx-auto  space-y-5">
        {/* ── Heading ── */}
        <CustomHeading
          title="Document Sub-Categories"
          subtitle="Manage sub-categories nested under each document category."
          icon={FolderOpen}
          badge={
            isLoading
              ? undefined
              : `${list.length} sub-categor${list.length === 1 ? "y" : "ies"}`
          }
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
                onClick={openCreateModal}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                New Sub-Category
              </button>
            </div>
          }
        />

        {/* ── Table ── */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <DataTableComponent
            title={"Document Sub-Categories"}
            icon={FolderOpen}
            accent="indigo"
            cols={columns}
            rows={list}
            onRefresh={refetch}
            loading={isLoading}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            CREATE / EDIT MODAL
        ══════════════════════════════════════════════════════════════ */}
        <CommonModal
          isOpen={formModal}
          onClose={closeModal}
          title={
            selectedId
              ? "Edit Document Sub-Category"
              : "New Document Sub-Category"
          }
          subtitle={
            selectedId
              ? "Update the sub-category name, parent, or status."
              : "Add a new sub-category under an existing document category."
          }
          icon={<FolderOpen className="h-4 w-4" />}
          variant="default"
          size="sm"
          confirmLabel={selectedId ? "Save Changes" : "Create Sub-Category"}
          onConfirm={() => form.submit()}
          isLoading={isSaving || isUpdating}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-3"
            initialValues={{ isActive: true }}
          >
            {/* Sub-Category Name */}
            <Form.Item
              name="documentSubCategoryName"
              label={
                <span className="text-sm font-medium text-slate-600">
                  Sub-Category Name
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter a sub-category name.",
                },
              ]}
            >
              <Input
                placeholder="e.g. GST Certificate, PAN Card"
                className="rounded-xl"
              />
            </Form.Item>

            {/* Parent Category */}
            <Form.Item
              name="documentCategoryID"
              label={
                <span className="text-sm font-medium text-slate-600">
                  Parent Category
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please select a parent category.",
                },
              ]}
            >
              <Select
                placeholder="Select parent category"
                loading={catLoading}
                options={categoryOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="rounded-xl"
              />
            </Form.Item>

            {/* Active toggle */}
            <Form.Item name="isActive" valuePropName="checked" className="mb-0">
              <div className="flex items-center gap-3">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                <span className="text-xs text-slate-500">
                  Mark as active on creation
                </span>
              </div>
            </Form.Item>
          </Form>
        </CommonModal>

        {/* ══════════════════════════════════════════════════════════════
            VIEW MODAL
        ══════════════════════════════════════════════════════════════ */}
        <CommonModal
          isOpen={viewModal.open}
          onClose={() => setViewModal({ open: false, record: null })}
          title="Sub-Category Details"
          subtitle="Full details of the selected document sub-category"
          icon={<Eye className="h-4 w-4" />}
          variant="info"
          size="sm"
          hideFooter
        >
          {viewModal.record && (
            <div className="mt-3 space-y-4">
              {[
                {
                  label: "Sub-Category Name",
                  value:
                    viewModal.record?.DocumentSubCategoryName ??
                    viewModal.record?.documentSubCategoryName,
                },
                {
                  label: "Sub-Category ID",
                  value: `#${viewModal.record?.DocumentSubCategoryID ?? viewModal.record?.documentSubCategoryID ?? "—"}`,
                  mono: true,
                },
                {
                  label: "Parent Category",
                  value: getCategoryName(
                    viewModal.record?.DocumentCategoryID ??
                      viewModal.record?.documentCategoryID,
                  ),
                },
                {
                  label: "Status",
                  custom: (
                    <Badge
                      color={
                        resolveActive(viewModal.record) ? "green" : "yellow"
                      }
                    >
                      {resolveActive(viewModal.record) ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
                {
                  label: "Created Date",
                  value: formatDate(
                    viewModal.record?.CreatedDate ??
                      viewModal.record?.createdDate,
                  ),
                },
                {
                  label: "Last Updated",
                  value: formatDate(
                    viewModal.record?.UpdatedDate ??
                      viewModal.record?.updatedDate,
                  ),
                },
              ].map(({ label, value, mono, custom }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-xs font-medium text-slate-500">
                    {label}
                  </span>
                  {custom ?? (
                    <span
                      className={`text-sm font-semibold text-slate-800 ${
                        mono ? "font-mono text-xs text-slate-500" : ""
                      }`}
                    >
                      {value ?? "—"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CommonModal>

        {/* ══════════════════════════════════════════════════════════════
            DELETE CONFIRM MODAL
        ══════════════════════════════════════════════════════════════ */}
        <CommonModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, record: null })}
          title="Delete Sub-Category"
          subtitle="This action cannot be undone"
          icon={<Trash2 className="h-4 w-4" />}
          variant="danger"
          size="sm"
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={() => {
            const id =
              deleteModal.record?.DocumentSubCategoryID ??
              deleteModal.record?.documentSubCategoryID ??
              deleteModal.record?.id;
            if (!id) {
              toast.error("Cannot delete — no valid ID found.");
              return;
            }
            deleteMutate(id);
          }}
        >
          <p className="text-sm text-slate-600 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">
              "
              {deleteModal.record?.DocumentSubCategoryName ??
                deleteModal.record?.documentSubCategoryName}
              "
            </span>
            ?
          </p>
        </CommonModal>
      </div>
    </div>
  );
};

export default DocumentSubCategory;
