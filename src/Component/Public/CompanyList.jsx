import React, { useEffect, useState } from "react";
import { Card, Table, Button, Popconfirm, message, Tag, Avatar, Empty, Drawer } from "antd";
import {
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CompanyList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const normalizeCompany = (item, index) => {
    const companyName = item?.companyName || item?.CompanyName || item?.name || `Company ${index + 1}`;
    const fallbackServices = [
      { id: "consulting", name: "Consulting" },
      { id: "contractor", name: "Contractor" },
      { id: "tender", name: "Tender" },
    ];

    const services = Array.isArray(item?.services) && item.services.length
      ? item.services.map((service) =>
          typeof service === "string"
            ? { id: service.toLowerCase().replace(/\s+/g, "-"), name: service }
            : service,
        )
      : fallbackServices;

    return {
      ...item,
      id: item?.id ?? `company-${index + 1}`,
      companyName,
      image:
        item?.image ||
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
      services,
    };
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("companies")) || [];
    setData(stored.map(normalizeCompany));
  }, []);

  const handleDelete = (id) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    localStorage.setItem("companies", JSON.stringify(updated));
    message.success("Company deleted successfully");
  };

  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleServiceClick = (serviceId) => {
    setDrawerOpen(false);
    navigate(`/service/${serviceId}`);
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
            className={`bg-linear-to-br ${getAvatarColor(text)} text-white font-bold shadow-md`}
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
                     bg-linear-to-r from-emerald-100 to-green-100 text-emerald-700"
        >
          <GlobalOutlined className="mr-1" /> {state}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="link"
            icon={<EyeOutlined />}
            className="text-indigo-600 font-semibold"
            onClick={() => openCompanyDetails(record)}
          >
            View
          </Button>
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
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 lg:p-10">
      
      <Card
        className="rounded-[2rem] border-none shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center px-8 py-6 
                        bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 
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

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        placement="right"
        destroyOnClose
        className="company-details-drawer"
      >
        {selectedCompany ? (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-sm">
              {/* <img
                src={selectedCompany.image}
                alt={selectedCompany.companyName}
                className="h-44 w-full object-cover"
              /> */}
              <div className="p-4">
                <h3 className="text-xl font-black">{selectedCompany.companyName}</h3>
                <p className="mt-1 text-sm text-white/80">
                  {selectedCompany.contactPerson || "Verified company"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Services
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCompany.services?.length ? (
                  selectedCompany.services.map((service, idx) => (
                    <button
                      key={service?.id || `${service?.name}-${idx}`}
                      type="button"
                      onClick={() => handleServiceClick(service?.id || service?.name)}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {service?.name || "Service"}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No services available yet.</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Contact</p>
              <p className="mt-1">{selectedCompany.email || "—"}</p>
              <p>{selectedCompany.phone || "—"}</p>
            </div>
          </div>
        ) : null}
      </Drawer>

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