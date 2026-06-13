import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form, Input, Switch, Table } from "antd";
import { FileText, Plus, RefreshCw, Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "../../common/uiUtiles";
import CustomHeading from "../../common/CustomHeading";
import CommonModal from "../../common/CommonModal";

import {
  DocumentCategoryGet,
  DocumentCategorySave,
  DocumentCategoryUpdate,
  DocumentCategoryDelete,
} from "../../../services/api";
import DataTableComponent from "../../common/dataTable";

/* ==========================================================================
   API ADAPTERS
   ========================================================================== */
const DocumentCategoryGetApi = async () => {
  const response = await DocumentCategoryGet();
  return response?.data ?? response ?? [];
};

const DocumentCategorySaveApi = async (payload) => {
  const response = await DocumentCategorySave(payload);
  return response ?? {};
};

const DocumentCategoryUpdateApi = async (payload) => {
  const response = await DocumentCategoryUpdate(payload);
  return response ?? {};
};

const DocumentCategoryDeleteApi = async (id) => {
  const response = await DocumentCategoryDelete(id);
  return response ?? {};
};

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const DocumentationCategory = () => {
  const [form] = Form.useForm();
  const [selectedId, setSelectedId] = useState(0);
  const [planModal, setPlanModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [viewModal, setViewModal] = useState({ open: false, record: null });

  /* ── Fetch list ── */
  const {
    data: fetchedList = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["DocumentCategoryList"],
    queryFn: DocumentCategoryGetApi,
    retry: 1,
  });

  const list = Array.isArray(fetchedList) ? fetchedList : [];

  /* ── Modal helpers ── */
  const openCreateModal = () => {
    setSelectedId(0);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setPlanModal(true);
  };

  const openEditModal = (record) => {
    const id =
      record?.documentCategoryID ??
      record?.DocumentCategoryID ??
      record?.id ??
      0;
    setSelectedId(id);
    form.setFieldsValue({
      documentCategoryName:
        record?.documentCategoryName ??
        record?.DocumentCategoryName ??
        "",
      isActive:
        record?.isActive === 1 ||
        record?.isActive === true ||
        record?.IsActive === 1,
    });
    setPlanModal(true);
  };

  const closeModal = () => {
    setPlanModal(false);
    setSelectedId(0);
    form.resetFields();
  };

  /* ── Save mutation ── */
  const { mutate: saveMutate, isPending: isSaving } = useMutation({
    mutationFn: DocumentCategorySaveApi,
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || "Failed to create category.");
        return;
      }
      toast.success(res?.message || "Category created successfully.");
      closeModal();
      refetch();
    },
    onError: (err) => toast.error(err?.message || "Unable to create category."),
  });

  /* ── Update mutation ── */
  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: DocumentCategoryUpdateApi,
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || "Failed to update category.");
        return;
      }
      toast.success(res?.message || "Category updated successfully.");
      closeModal();
      refetch();
    },
    onError: (err) => toast.error(err?.message || "Unable to update category."),
  });

  /* ── Delete mutation ── */
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: DocumentCategoryDeleteApi,
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || "Failed to delete category.");
        return;
      }
      toast.success(res?.message || "Category deleted successfully.");
      setDeleteModal({ open: false, record: null });
      refetch();
    },
    onError: (err) => toast.error(err?.message || "Unable to delete category."),
  });

  /* ── Form submit ── */
  const onFinish = (values) => {
    const payload = {
      documentCategoryID: selectedId || 0,
      documentCategoryName: values.documentCategoryName?.trim(),
      isActive: values.isActive ? 1 : 0,
      createdBy: 0,
      createdDate: new Date().toISOString(),
      updatedBy: 0,
      updatedDate: new Date().toISOString(),
    };

    if (selectedId) {
      updateMutate(payload);
    } else {
      saveMutate(payload);
    }
  };

  /* ── Table columns ── */
  const columns = [
    // {
    //   title: "S.No.",
    //   key: "index",
    //   width: 80,
    //   render: (_, __, idx) => (
    //     <span className="text-xs text-slate-400 font-mono">{idx + 1}</span>
    //   ),
    // },
    {
      title: "Category Name",
      key: "documentCategoryName",
      render: (_, record) => (
        <span className="font-semibold text-slate-800">
          {record?.documentCategoryName ??
            record?.DocumentCategoryName ??
            "—"}
        </span>
      ),
    },
    // {
    //   title: "ID",
    //   key: "documentCategoryID",
    //   width: 80,
    //   render: (_, record) => (
    //     <span className="text-xs font-mono text-slate-400">
    //       #{record?.documentCategoryID ?? record?.DocumentCategoryID ?? "—"}
    //     </span>
    //   ),
    // },
    {
      title: "Status",
      key: "isActive",
      width: 110,
      render: (_, record) => {
        const active =
          record?.isActive === 1 ||
          record?.isActive === true ||
          record?.IsActive === 1;
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
      render: (_, record) => {
        const d = record?.createdDate ?? record?.CreatedDate;
        if (!d) return <span className="text-slate-400">—</span>;
        return (
          <span className="text-xs text-slate-500">
            {new Date(d).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
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
      <div className="mx-auto   space-y-5">

        {/* ── Heading ── */}
        <CustomHeading
          title="Document Categories"
          subtitle="Create and manage document category types for your platform."
          icon={FileText}
          badge={isLoading ? undefined : `${list.length} categor${list.length === 1 ? "y" : "ies"}`}
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
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={openCreateModal}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                New Category
              </button>
            </div>
          }
        />

        {/* ── Table ── */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">

          <DataTableComponent
          title={`Document Categories ${isFetching ? "(Refreshing...)" : ""}`}
          icon={FileText}
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
          isOpen={planModal}
          onClose={closeModal}
          title={selectedId ? "Edit Document Category" : "New Document Category"}
          subtitle={
            selectedId
              ? "Update the category name or status."
              : "Add a new document category to the platform."
          }
          icon={<FileText className="h-4 w-4" />}
          variant="default"
          size="sm"
          confirmLabel={selectedId ? "Save Changes" : "Create Category"}
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
            <Form.Item
              name="documentCategoryName"
              label={<span className="text-sm font-medium text-slate-600">Category Name</span>}
              rules={[{ required: true, message: "Please enter a category name." }]}
            >
              <Input
                placeholder="e.g. Photos, Contracts, Invoices"
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" className="mb-0">
              <div className="flex items-center gap-3">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                <span className="text-xs text-slate-500">Mark as active on creation</span>
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
          title="Category Details"
          subtitle="Full details of the selected document category"
          icon={<Eye className="h-4 w-4" />}
          variant="info"
          size="sm"
          hideFooter
        >
          {viewModal.record && (
            <div className="mt-3 space-y-4">
              {[
                {
                  label: "Category Name",
                  value:
                    viewModal.record?.documentCategoryName ??
                    viewModal.record?.DocumentCategoryName,
                },
                {
                  label: "Category ID",
                  value: `#${viewModal.record?.documentCategoryID ?? viewModal.record?.DocumentCategoryID ?? "—"}`,
                  mono: true,
                },
                {
                  label: "Status",
                  value: null,
                  custom: (
                    <Badge
                      color={
                        viewModal.record?.isActive === 1 ||
                          viewModal.record?.isActive === true ||
                          viewModal.record?.IsActive === 1
                          ? "green"
                          : "yellow"
                      }
                    >
                      {viewModal.record?.isActive === 1 ||
                        viewModal.record?.isActive === true ||
                        viewModal.record?.IsActive === 1
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  ),
                },
                {
                  label: "Created Date",
                  value: viewModal.record?.createdDate
                    ? new Date(viewModal.record.createdDate).toLocaleString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )
                    : "—",
                },
                {
                  label: "Last Updated",
                  value: viewModal.record?.updatedDate
                    ? new Date(viewModal.record.updatedDate).toLocaleString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )
                    : "—",
                },
              ].map(({ label, value, mono, custom }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-xs font-medium text-slate-500">{label}</span>
                  {custom ?? (
                    <span
                      className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono text-xs text-slate-500" : ""}`}
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
          title="Delete Category"
          subtitle="This action cannot be undone"
          icon={<Trash2 className="h-4 w-4" />}
          variant="danger"
          size="sm"
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={() => {
            const id =
              deleteModal.record?.documentCategoryID ??
              deleteModal.record?.DocumentCategoryID ??
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
              {deleteModal.record?.documentCategoryName ??
                deleteModal.record?.DocumentCategoryName}
              "
            </span>
            ?
          </p>
        </CommonModal>

      </div>
    </div>
  );
};

export default DocumentationCategory;