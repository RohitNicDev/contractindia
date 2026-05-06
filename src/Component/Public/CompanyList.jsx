import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Popconfirm,
  message,
  Tag,
  Avatar,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const CompanyList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("companies")) || [];
    setData(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    localStorage.setItem("companies", JSON.stringify(updated));
    message.success("Company deleted successfully");
  };

  // 🎨 Random Gradient Avatar Color
  const getAvatarColor = (name) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-indigo-500",
      "from-orange-500 to-amber-500",
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const columns = [
    {
      title: "COMPANY",
      dataIndex: "companyName",
      render: (text) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={44}
            className={`bg-gradient-to-br ${getAvatarColor(text)} text-white font-bold shadow-md`}
          >
            {text?.charAt(0)}
          </Avatar>

          <div>
            <div className="font-semibold text-slate-800 text-sm">
              {text}
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wide">
              Verified Company
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "CONTACT",
      dataIndex: "contactPerson",
      render: (text) => (
        <span className="font-medium text-slate-600">{text}</span>
      ),
    },
    {
      title: "DETAILS",
      render: (_, record) => (
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MailOutlined className="text-blue-400" /> {record.email}
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-emerald-400" /> {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "LOCATION",
      dataIndex: "state",
      render: (state) => (
        <Tag
          className="rounded-full px-3 py-1 font-semibold border-none 
                     bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700"
        >
          <GlobalOutlined className="mr-1" /> {state}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Delete company?"
          description="This cannot be undone"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            className="hover:bg-red-100 hover:scale-110 transition rounded-xl"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 lg:p-10">
      
      <Card
        className="rounded-[2rem] border-none shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center px-8 py-6 
                        bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 
                        text-white">
          <div>
            <h2 className="text-2xl font-black mb-1">
              Registered Companies
            </h2>
            <p className="text-white/80 text-sm">
              Manage all your onboarded companies
            </p>
          </div>

          <Button
            icon={<PlusOutlined />}
            className="h-11 px-6 rounded-xl bg-white text-indigo-600 font-bold border-none shadow-md hover:scale-105 transition"
          >
            Add Company
          </Button>
        </div>

        {/* 📊 TABLE */}
        <div className="p-5">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{
              pageSize: 6,
              position: ["bottomCenter"],
            }}
            locale={{
              emptyText: (
                <Empty description="No companies registered yet" />
              ),
            }}
            className="modern-table"
          />
        </div>
      </Card>

      {/* 🎨 STYLE */}
      <style jsx global>{`
        .modern-table .ant-table {
          background: transparent !important;
        }

        .modern-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #64748b !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          padding: 18px !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }

        .modern-table .ant-table-tbody > tr > td {
          padding: 18px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          transition: all 0.2s ease;
        }

        .modern-table .ant-table-tbody > tr:hover > td {
          background: linear-gradient(90deg, #f0f9ff, #eef2ff) !important;
        }

        .ant-pagination-item {
          border-radius: 10px !important;
        }

        .ant-pagination-item-active {
          border-color: #2563eb !important;
        }

        .ant-pagination-item-active a {
          color: #2563eb !important;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CompanyList;