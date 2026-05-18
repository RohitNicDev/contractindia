import { Button, Dropdown, Form, Input, message, Modal, Select, Space, Table, Tooltip, Typography } from "antd";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CustomInput } from "./CustomInput";
const { Text } = Typography;

const glass = "rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)]";
const btnPrimary = { background: "linear-gradient(135deg,#3b82f6,#6366f1)" };

import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { StatusTag } from "./StatusTag";
export const  CustomTable=({
  title,
  icon: Icon,
  accent = "#3b82f6",
  columns,
  data,
})=> {
  const [tableData, setTableData] =
    useState(data);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedRow, setSelectedRow] =
    useState(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [form] = Form.useForm();

  /* ---------------------------------------------------------------------- */
  /* FILTER */
  /* ---------------------------------------------------------------------- */

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const searchText =
        JSON.stringify(item).toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase(),
        );

      const matchesStatus =
        statusFilter === "All"
          ? true
          : item.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    tableData,
    search,
    statusFilter,
  ]);

  /* ---------------------------------------------------------------------- */
  /* EDIT */
  /* ---------------------------------------------------------------------- */

  const handleEdit = (record) => {
    setSelectedRow(record);

    form.setFieldsValue(record);

    setOpenModal(true);
  };

  /* ---------------------------------------------------------------------- */
  /* DELETE */
  /* ---------------------------------------------------------------------- */

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete Record?",
      content:
        "This action cannot be undone.",

      okText: "Delete",

      centered: true,

      okButtonProps: {
        danger: true,
      },

      onOk() {
        setTableData((prev) =>
          prev.filter(
            (x) => x.key !== record.key,
          ),
        );

        message.success(
          "Record deleted",
        );
      },
    });
  };

  /* ---------------------------------------------------------------------- */
  /* SAVE */
  /* ---------------------------------------------------------------------- */

  const handleSave = async () => {
    const values =
      await form.validateFields();

    setTableData((prev) =>
      prev.map((item) =>
        item.key === selectedRow.key
          ? {
              ...item,
              ...values,
            }
          : item,
      ),
    );

    message.success(
      "Record updated",
    );

    setOpenModal(false);
  };

  /* ---------------------------------------------------------------------- */
  /* EXPORT */
  /* ---------------------------------------------------------------------- */

  const exportCSV = () => {
    message.success(
      "CSV Export Started",
    );
  };

  /* ---------------------------------------------------------------------- */
  /* ACTIONS */
  /* ---------------------------------------------------------------------- */

  const actionMenu = (record) => ({
    items: [
      {
        key: "view",

        icon: <EyeOutlined />,

        label: "View Details",

        onClick: () =>
          message.info(
            JSON.stringify(record),
          ),
      },

      {
        key: "edit",

        icon: <EditOutlined />,

        label: "Edit Record",

        onClick: () =>
          handleEdit(record),
      },

      {
        key: "delete",

        danger: true,

        icon: <DeleteOutlined />,

        label: "Delete",

        onClick: () =>
          handleDelete(record),
      },
    ],
  });

  /* ---------------------------------------------------------------------- */
  /* FINAL COLUMNS */
  /* ---------------------------------------------------------------------- */

  const finalColumns = [
    ...columns,

    {
      title: "Status",

      dataIndex: "status",

      key: "status",

      render: (status) => (
        <StatusTag status={status} />
      ),
    },

    {
      title: "",

      key: "actions",

      width: 80,

      render: (_, record) => (
        <Dropdown
          menu={actionMenu(record)}
          trigger={["click"]}
        >
          <Button
            shape="circle"
            icon={<MoreOutlined />}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={`${glass} p-6`}
      >
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-12 w-12 items-center
                justify-center rounded-2xl
              "
              style={{
                background:
                  accent + "15",
              }}
            >
              <Icon
                className="text-[22px]"
                style={{
                  color: accent,
                }}
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-800">
                {title}
              </h2>

              <Text className="text-xs text-slate-400">
                Advanced records &
                analytics management
              </Text>
            </div>
          </div>

          {/* ACTIONS */}
          <Space wrap>
            <CustomInput
              value={search}
              onChange={setSearch}
              placeholder="Search records..."
              prefix={
                <SearchOutlined />
              }
            />

            <Select
              value={statusFilter}
              onChange={
                setStatusFilter
              }
              className="min-w-[160px]"
              size="large"
              options={[
                {
                  label:
                    "All Status",
                  value: "All",
                },

                {
                  label: "Success",
                  value:
                    "Success",
                },

                {
                  label: "Active",
                  value:
                    "Active",
                },

                {
                  label: "Failed",
                  value:
                    "Failed",
                },

                {
                  label:
                    "Expired",
                  value:
                    "Expired",
                },

                {
                  label:
                    "Inactive",
                  value:
                    "Inactive",
                },
              ]}
            />

            <Tooltip title="Export CSV">
              <Button
                size="large"
                icon={
                  <DownloadOutlined />
                }
                onClick={exportCSV}
              />
            </Tooltip>

            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{
                background:
                  accent,
                borderColor:
                  accent,
              }}
              onClick={() =>
                message.success(
                  "Create new record",
                )
              }
            >
              Add New
            </Button>
          </Space>
        </div>

        {/* TABLE */}
        <Table
          columns={finalColumns}
          dataSource={filteredData}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          scroll={{
            x: 900,
          }}
          rowHoverable
          className="modern-table"
        />
      </motion.div>

      {/* MODAL */}
      <Modal
        open={openModal}
        title="Edit Record"
        centered
        width={700}
        onCancel={() =>
          setOpenModal(false)
        }
        onOk={handleSave}
        okText="Save Changes"
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-5"
        >
          {selectedRow &&
            Object.keys(
              selectedRow,
            ).map((key) => {
              if (
                key === "key"
              )
                return null;

              return (
                <Form.Item
                  key={key}
                  name={key}
                  label={
                    <span className="font-semibold capitalize">
                      {key}
                    </span>
                  }
                >
                  <Input size="small" />
                </Form.Item>
              );
            })}
        </Form>
      </Modal>
    </>
  );
}
