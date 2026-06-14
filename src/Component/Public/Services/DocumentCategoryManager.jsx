/**
 * DocumentCategoryManager
 * Merged page — two tabs:
 *   Tab 1 → Document Categories     (Category CRUD)
 *   Tab 2 → Document Sub-Categories (SubCategory CRUD)
 *
 * Shared: CustomHeading, CommonModal, Badge, antd Table/Form
 */

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form, Input, Switch, Table, Select } from "antd";
import {
  FileText, FolderOpen, Plus, RefreshCw,
  Eye, Pencil, Trash2, Layers,
} from "lucide-react";

import { Badge }        from "../../common/uiUtiles";
import CustomHeading    from "../../common/CustomHeading";
import CommonModal      from "../../common/CommonModal";

import {
  DocumentCategoryGet,
  DocumentCategorySave,
  DocumentCategoryUpdate,
  DocumentCategoryDelete,
  DocumentSubCategoryGet,
  DocumentSubCategorySave,
  DocumentSubCategoryUpdate,
  DocumentSubCategoryDelete,
} from "../../../services/api";

/* ==========================================================================
   SHARED HELPERS
   ========================================================================== */
const resolveActive = (r) =>
  r?.IsActive === true  || r?.IsActive === 1 ||
  r?.isActive === true  || r?.isActive === 1;

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

/* ==========================================================================
   API ADAPTERS
   ========================================================================== */

/* ── Category ── */
const catGetApi    = async () => { const r = await DocumentCategoryGet();    return r?.data ?? r ?? []; };
const catSaveApi   = async (p) => { const r = await DocumentCategorySave(p);  return r ?? {}; };
const catUpdateApi = async (p) => { const r = await DocumentCategoryUpdate(p); return r ?? {}; };
const catDeleteApi = async (id) => { const r = await DocumentCategoryDelete(id); return r ?? {}; };

/* ── SubCategory ── */
const subGetApi    = async () => { const r = await DocumentSubCategoryGet();    return r?.data ?? r ?? []; };
const subSaveApi   = async (p) => { const r = await DocumentSubCategorySave(p);  return r ?? {}; };
const subUpdateApi = async (p) => { const r = await DocumentSubCategoryUpdate(p); return r ?? {}; };
const subDeleteApi = async (id) => { const r = await DocumentSubCategoryDelete(id); return r ?? {}; };

/* ==========================================================================
   VIEW ROW HELPER — reusable detail row in view modals
   ========================================================================== */
function DetailRow({ label, value, mono, custom }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {custom ?? (
        <span className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono text-xs text-slate-500" : ""}`}>
          {value ?? "—"}
        </span>
      )}
    </div>
  );
}

/* ==========================================================================
   TAB BUTTON
   ========================================================================== */
function TabBtn({ active, onClick, icon: Icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
        active
          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      {count !== undefined && (
        <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
          active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ==========================================================================
   ACTION BUTTONS — reusable cell buttons
   ========================================================================== */
function ActionButtons({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onView} title="View"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button onClick={onEdit} title="Edit"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button onClick={onDelete} title="Delete"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const DocumentCategoryManager = () => {
  const [activeTab, setActiveTab] = useState("category"); // "category" | "subcategory"

  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY STATE
  ══════════════════════════════════════════════════════════════════════ */
  const [catForm]         = Form.useForm();
  const [catSelectedId,   setCatSelectedId]   = useState(0);
  const [catFormModal,    setCatFormModal]    = useState(false);
  const [catDeleteModal,  setCatDeleteModal]  = useState({ open: false, record: null });
  const [catViewModal,    setCatViewModal]    = useState({ open: false, record: null });

  const {
    data: catFetched = [], isLoading: catLoading,
    isFetching: catFetching, refetch: catRefetch,
  } = useQuery({ queryKey: ["DocumentCategoryList"], queryFn: catGetApi, retry: 1 });

  const catList = Array.isArray(catFetched) ? catFetched : [];

  /* Category helpers */
  const openCatCreate = () => {
    setCatSelectedId(0); catForm.resetFields();
    catForm.setFieldsValue({ isActive: true }); setCatFormModal(true);
  };
  const openCatEdit = (r) => {
    const id = r?.DocumentCategoryID ?? r?.documentCategoryID ?? r?.id ?? 0;
    setCatSelectedId(id);
    catForm.setFieldsValue({
      documentCategoryName: r?.DocumentCategoryName ?? r?.documentCategoryName ?? "",
      isActive: resolveActive(r),
    });
    setCatFormModal(true);
  };
  const closeCatModal = () => { setCatFormModal(false); setCatSelectedId(0); catForm.resetFields(); };

  /* Category mutations */
  const { mutate: catSave,   isPending: catSaving }   = useMutation({
    mutationFn: catSaveApi,
    onSuccess: (res) => {
      if (!res?.status) { toast.error(res?.message || "Failed to create."); return; }
      toast.success(res?.message || "Category created."); closeCatModal(); catRefetch();
    },
    onError: (e) => toast.error(e?.message || "Unable to create."),
  });
  const { mutate: catUpdate, isPending: catUpdating } = useMutation({
    mutationFn: catUpdateApi,
    onSuccess: (res) => {
      if (!res?.status) { toast.error(res?.message || "Failed to update."); return; }
      toast.success(res?.message || "Category updated."); closeCatModal(); catRefetch();
    },
    onError: (e) => toast.error(e?.message || "Unable to update."),
  });
  const { mutate: catDelete, isPending: catDeleting } = useMutation({
    mutationFn: catDeleteApi,
    onSuccess: (res) => {
      if (!res?.status) { toast.error(res?.message || "Failed to delete."); return; }
      toast.success(res?.message || "Category deleted.");
      setCatDeleteModal({ open: false, record: null }); catRefetch();
    },
    onError: (e) => toast.error(e?.message || "Unable to delete."),
  });

  const onCatFinish = (values) => {
    const payload = {
      documentCategoryID: catSelectedId || 0,
      documentCategoryName: values.documentCategoryName?.trim(),
      isActive: values.isActive ? 1 : 0,
      createdBy: 0, createdDate: new Date().toISOString(),
      updatedBy: 0, updatedDate: new Date().toISOString(),
    };
    catSelectedId ? catUpdate(payload) : catSave(payload);
  };

  /* Category table columns */
  const catColumns = [
    {
      title: "#", key: "idx", width: 52,
      render: (_, __, i) => <span className="text-xs text-slate-400 font-mono">{i + 1}</span>,
    },
    {
      title: "Category Name", key: "name",
      render: (_, r) => (
        <span className="font-semibold text-slate-800">
          {r?.DocumentCategoryName ?? r?.documentCategoryName ?? "—"}
        </span>
      ),
    },
    {
      title: "ID", key: "id", width: 80,
      render: (_, r) => (
        <span className="text-xs font-mono text-slate-400">
          #{r?.DocumentCategoryID ?? r?.documentCategoryID ?? "—"}
        </span>
      ),
    },
    {
      title: "Status", key: "status", width: 110,
      render: (_, r) => (
        <Badge color={resolveActive(r) ? "green" : "yellow"}>
          {resolveActive(r) ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      title: "Created", key: "created", width: 120,
      render: (_, r) => (
        <span className="text-xs text-slate-500">
          {formatDate(r?.CreatedDate ?? r?.createdDate)}
        </span>
      ),
    },
    {
      title: "Actions", key: "actions", width: 120,
      render: (_, r) => (
        <ActionButtons
          onView={() => setCatViewModal({ open: true, record: r })}
          onEdit={() => openCatEdit(r)}
          onDelete={() => setCatDeleteModal({ open: true, record: r })}
        />
      ),
    },
  ];

  /* ══════════════════════════════════════════════════════════════════════
     SUBCATEGORY STATE
  ══════════════════════════════════════════════════════════════════════ */
  const [subForm]         = Form.useForm();
  const [subSelectedId,   setSubSelectedId]   = useState(0);
  const [subFormModal,    setSubFormModal]    = useState(false);
  const [subDeleteModal,  setSubDeleteModal]  = useState({ open: false, record: null });
  const [subViewModal,    setSubViewModal]    = useState({ open: false, record: null });

  const {
    data: subFetched = [], isLoading: subLoading,
    isFetching: subFetching, refetch: subRefetch,
  } = useQuery({ queryKey: ["DocumentSubCategoryList"], queryFn: subGetApi, retry: 1 });

  const subList = Array.isArray(subFetched) ? subFetched : [];

  /* Category name lookup for sub-category table/modal */
  const getCatName = (id) => {
    const found = catList.find(
      (c) => (c?.DocumentCategoryID ?? c?.documentCategoryID) === id
    );
    return found?.DocumentCategoryName ?? found?.documentCategoryName ?? `ID: ${id}`;
  };

  const catOptions = catList.map((c) => ({
    value: c?.DocumentCategoryID ?? c?.documentCategoryID,
    label: c?.DocumentCategoryName ?? c?.documentCategoryName ?? "—",
  }));

  /* SubCategory helpers */
  const openSubCreate = () => {
    setSubSelectedId(0); subForm.resetFields();
    subForm.setFieldsValue({ isActive: true }); setSubFormModal(true);
  };
  const openSubEdit = (r) => {
    const id = r?.DocumentSubCategoryID ?? r?.documentSubCategoryID ?? r?.id ?? 0;
    setSubSelectedId(id);
    subForm.setFieldsValue({
      documentSubCategoryName: r?.DocumentSubCategoryName ?? r?.documentSubCategoryName ?? "",
      documentCategoryID: r?.DocumentCategoryID ?? r?.documentCategoryID ?? undefined,
      isActive: resolveActive(r),
    });
    setSubFormModal(true);
  };
  const closeSubModal = () => { setSubFormModal(false); setSubSelectedId(0); subForm.resetFields(); };

  /* SubCategory mutations */
  const { mutate: subSave,   isPending: subSaving }   = useMutation({
    mutationFn: subSaveApi,
    onSuccess: (res) => {
      if (!res?.status) { toast.error(res?.message || "Failed to create."); return; }
      toast.success(res?.message || "Sub-category created."); closeSubModal(); subRefetch();
    },
    onError: (e) => toast.error(e?.message || "Unable to create."),
  });
  const { mutate: subUpdate, isPending: subUpdating } = useMutation({
    mutationFn: subUpdateApi,
    onSuccess: (res) => {
      if (!res?.status) { toast.error(res?.message || "Failed to update."); return; }
      toast.success(res?.message || "Sub-category updated."); closeSubModal(); subRefetch();
    },
    onError: (e) => toast.error(e?.message || "Unable to update."),
  });
  const { mutate: subDelete, isPending: subDeleting } = useMutation({
    mutationFn: subDeleteApi,
    onSuccess: (res) => {
      if (!res?.status) { toast.error(res?.message || "Failed to delete."); return; }
      toast.success(res?.message || "Sub-category deleted.");
      setSubDeleteModal({ open: false, record: null }); subRefetch();
    },
    onError: (e) => toast.error(e?.message || "Unable to delete."),
  });

  const onSubFinish = (values) => {
    const payload = {
      documentSubCategoryID: subSelectedId || 0,
      documentSubCategoryName: values.documentSubCategoryName?.trim(),
      documentCategoryID: values.documentCategoryID,
      isActive: values.isActive ? 1 : 0,
      createdBy: 0, createdDate: new Date().toISOString(),
      updatedBy: 0, updatedDate: new Date().toISOString(),
    };
    subSelectedId ? subUpdate(payload) : subSave(payload);
  };

  /* SubCategory table columns */
  const subColumns = [
    {
      title: "#", key: "idx", width: 52,
      render: (_, __, i) => <span className="text-xs text-slate-400 font-mono">{i + 1}</span>,
    },
    {
      title: "Sub-Category Name", key: "name",
      render: (_, r) => (
        <span className="font-semibold text-slate-800">
          {r?.DocumentSubCategoryName ?? r?.documentSubCategoryName ?? "—"}
        </span>
      ),
    },
    {
      title: "Parent Category", key: "parent",
      render: (_, r) => {
        const catId = r?.DocumentCategoryID ?? r?.documentCategoryID;
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
            {getCatName(catId)}
          </span>
        );
      },
    },
    {
      title: "ID", key: "id", width: 80,
      render: (_, r) => (
        <span className="text-xs font-mono text-slate-400">
          #{r?.DocumentSubCategoryID ?? r?.documentSubCategoryID ?? "—"}
        </span>
      ),
    },
    {
      title: "Status", key: "status", width: 110,
      render: (_, r) => (
        <Badge color={resolveActive(r) ? "green" : "yellow"}>
          {resolveActive(r) ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      title: "Created", key: "created", width: 120,
      render: (_, r) => (
        <span className="text-xs text-slate-500">
          {formatDate(r?.CreatedDate ?? r?.createdDate)}
        </span>
      ),
    },
    {
      title: "Actions", key: "actions", width: 120,
      render: (_, r) => (
        <ActionButtons
          onView={() => setSubViewModal({ open: true, record: r })}
          onEdit={() => openSubEdit(r)}
          onDelete={() => setSubDeleteModal({ open: true, record: r })}
        />
      ),
    },
  ];

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════ */
  const isCat = activeTab === "category";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.07),_transparent_55%),#f8fafc] p-4 sm:p-6">
      <div className="mx-auto  space-y-5">

        {/* ── Page Heading ── */}
        <CustomHeading
          title="Document Category Manager"
          subtitle="Manage document categories and their sub-categories from one place."
          icon={Layers}
          badgeColor="violet"
          badge={`${catList.length} cat · ${subList.length} sub`}
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => isCat ? catRefetch() : subRefetch()}
                disabled={isCat ? catFetching : subFetching}
                title="Refresh"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <RefreshCw className={`h-4 w-4 ${(isCat ? catFetching : subFetching) ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={isCat ? openCatCreate : openSubCreate}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                {isCat ? "New Category" : "New Sub-Category"}
              </button>
            </div>
          }
        />

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-2">
          <TabBtn
            active={activeTab === "category"}
            onClick={() => setActiveTab("category")}
            icon={FileText}
            label="Categories"
            count={catList.length}
          />
          <TabBtn
            active={activeTab === "subcategory"}
            onClick={() => setActiveTab("subcategory")}
            icon={FolderOpen}
            label="Sub-Categories"
            count={subList.length}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1 — CATEGORIES
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "category" && (
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
            <Table
              columns={catColumns}
              dataSource={catList}
              rowKey={(r) => r?.DocumentCategoryID ?? r?.documentCategoryID ?? r?.id ?? Math.random()}
              loading={catLoading}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              scroll={{ x: 600 }}
              size="middle"
              className="modern-table"
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2 — SUB-CATEGORIES
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "subcategory" && (
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
            <Table
              columns={subColumns}
              dataSource={subList}
              rowKey={(r) => r?.DocumentSubCategoryID ?? r?.documentSubCategoryID ?? r?.id ?? Math.random()}
              loading={subLoading}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              scroll={{ x: 750 }}
              size="middle"
              className="modern-table"
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            CATEGORY MODALS
        ══════════════════════════════════════════════════════════════ */}

        {/* Create / Edit */}
        <CommonModal
          isOpen={catFormModal}
          onClose={closeCatModal}
          title={catSelectedId ? "Edit Category" : "New Category"}
          subtitle={catSelectedId ? "Update the category name or status." : "Add a new document category."}
          icon={<FileText className="h-4 w-4" />}
          variant="default"
          size="sm"
          confirmLabel={catSelectedId ? "Save Changes" : "Create Category"}
          onConfirm={() => catForm.submit()}
          isLoading={catSaving || catUpdating}
        >
          <Form form={catForm} layout="vertical" onFinish={onCatFinish}
            className="mt-3" initialValues={{ isActive: true }}>
            <Form.Item
              name="documentCategoryName"
              label={<span className="text-sm font-medium text-slate-600">Category Name</span>}
              rules={[{ required: true, message: "Please enter a category name." }]}
            >
              <Input placeholder="e.g. Photos, Contracts, Invoices" className="rounded-xl" />
            </Form.Item>
            <Form.Item name="isActive" valuePropName="checked" className="mb-0">
              <div className="flex items-center gap-3">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                <span className="text-xs text-slate-500">Mark as active</span>
              </div>
            </Form.Item>
          </Form>
        </CommonModal>

        {/* View */}
        <CommonModal
          isOpen={catViewModal.open}
          onClose={() => setCatViewModal({ open: false, record: null })}
          title="Category Details"
          subtitle="Full details of the selected document category"
          icon={<Eye className="h-4 w-4" />}
          variant="info" size="sm" hideFooter
        >
          {catViewModal.record && (
            <div className="mt-3 space-y-4">
              <DetailRow label="Category Name"
                value={catViewModal.record?.DocumentCategoryName ?? catViewModal.record?.documentCategoryName} />
              <DetailRow label="Category ID"
                value={`#${catViewModal.record?.DocumentCategoryID ?? catViewModal.record?.documentCategoryID ?? "—"}`}
                mono />
              <DetailRow label="Status" custom={
                <Badge color={resolveActive(catViewModal.record) ? "green" : "yellow"}>
                  {resolveActive(catViewModal.record) ? "Active" : "Inactive"}
                </Badge>
              } />
              <DetailRow label="Created Date"
                value={formatDate(catViewModal.record?.CreatedDate ?? catViewModal.record?.createdDate)} />
              <DetailRow label="Last Updated"
                value={formatDate(catViewModal.record?.UpdatedDate ?? catViewModal.record?.updatedDate)} />
            </div>
          )}
        </CommonModal>

        {/* Delete */}
        <CommonModal
          isOpen={catDeleteModal.open}
          onClose={() => setCatDeleteModal({ open: false, record: null })}
          title="Delete Category"
          subtitle="This action cannot be undone"
          icon={<Trash2 className="h-4 w-4" />}
          variant="danger" size="sm"
          confirmLabel="Delete"
          isLoading={catDeleting}
          onConfirm={() => {
            const id = catDeleteModal.record?.DocumentCategoryID ?? catDeleteModal.record?.documentCategoryID ?? catDeleteModal.record?.id;
            if (!id) { toast.error("Cannot delete — no valid ID."); return; }
            catDelete(id);
          }}
        >
          <p className="text-sm text-slate-600 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">
              "{catDeleteModal.record?.DocumentCategoryName ?? catDeleteModal.record?.documentCategoryName}"
            </span>?
          </p>
        </CommonModal>

        {/* ══════════════════════════════════════════════════════════════
            SUB-CATEGORY MODALS
        ══════════════════════════════════════════════════════════════ */}

        {/* Create / Edit */}
        <CommonModal
          isOpen={subFormModal}
          onClose={closeSubModal}
          title={subSelectedId ? "Edit Sub-Category" : "New Sub-Category"}
          subtitle={subSelectedId ? "Update the sub-category details." : "Add a new sub-category under an existing category."}
          icon={<FolderOpen className="h-4 w-4" />}
          variant="default"
          size="sm"
          confirmLabel={subSelectedId ? "Save Changes" : "Create Sub-Category"}
          onConfirm={() => subForm.submit()}
          isLoading={subSaving || subUpdating}
        >
          <Form form={subForm} layout="vertical" onFinish={onSubFinish}
            className="mt-3" initialValues={{ isActive: true }}>
            <Form.Item
              name="documentSubCategoryName"
              label={<span className="text-sm font-medium text-slate-600">Sub-Category Name</span>}
              rules={[{ required: true, message: "Please enter a sub-category name." }]}
            >
              <Input placeholder="e.g. GST Certificate, PAN Card" className="rounded-xl" />
            </Form.Item>
            <Form.Item
              name="documentCategoryID"
              label={<span className="text-sm font-medium text-slate-600">Parent Category</span>}
              rules={[{ required: true, message: "Please select a parent category." }]}
            >
              <Select
                placeholder="Select parent category"
                loading={catLoading}
                options={catOptions}
                showSearch
                filterOption={(input, opt) =>
                  (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item name="isActive" valuePropName="checked" className="mb-0">
              <div className="flex items-center gap-3">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                <span className="text-xs text-slate-500">Mark as active</span>
              </div>
            </Form.Item>
          </Form>
        </CommonModal>

        {/* View */}
        <CommonModal
          isOpen={subViewModal.open}
          onClose={() => setSubViewModal({ open: false, record: null })}
          title="Sub-Category Details"
          subtitle="Full details of the selected sub-category"
          icon={<Eye className="h-4 w-4" />}
          variant="info" size="sm" hideFooter
        >
          {subViewModal.record && (
            <div className="mt-3 space-y-4">
              <DetailRow label="Sub-Category Name"
                value={subViewModal.record?.DocumentSubCategoryName ?? subViewModal.record?.documentSubCategoryName} />
              <DetailRow label="Sub-Category ID"
                value={`#${subViewModal.record?.DocumentSubCategoryID ?? subViewModal.record?.documentSubCategoryID ?? "—"}`}
                mono />
              <DetailRow label="Parent Category"
                value={getCatName(subViewModal.record?.DocumentCategoryID ?? subViewModal.record?.documentCategoryID)} />
              <DetailRow label="Status" custom={
                <Badge color={resolveActive(subViewModal.record) ? "green" : "yellow"}>
                  {resolveActive(subViewModal.record) ? "Active" : "Inactive"}
                </Badge>
              } />
              <DetailRow label="Created Date"
                value={formatDate(subViewModal.record?.CreatedDate ?? subViewModal.record?.createdDate)} />
              <DetailRow label="Last Updated"
                value={formatDate(subViewModal.record?.UpdatedDate ?? subViewModal.record?.updatedDate)} />
            </div>
          )}
        </CommonModal>

        {/* Delete */}
        <CommonModal
          isOpen={subDeleteModal.open}
          onClose={() => setSubDeleteModal({ open: false, record: null })}
          title="Delete Sub-Category"
          subtitle="This action cannot be undone"
          icon={<Trash2 className="h-4 w-4" />}
          variant="danger" size="sm"
          confirmLabel="Delete"
          isLoading={subDeleting}
          onConfirm={() => {
            const id = subDeleteModal.record?.DocumentSubCategoryID ?? subDeleteModal.record?.documentSubCategoryID ?? subDeleteModal.record?.id;
            if (!id) { toast.error("Cannot delete — no valid ID."); return; }
            subDelete(id);
          }}
        >
          <p className="text-sm text-slate-600 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">
              "{subDeleteModal.record?.DocumentSubCategoryName ?? subDeleteModal.record?.documentSubCategoryName}"
            </span>?
          </p>
        </CommonModal>

      </div>
    </div>
  );
};

export default DocumentCategoryManager;