import React, { useState } from "react";

const ContractorService = () => {
  const [activeMenu, setActiveMenu] = useState("electrical");
  const [openMenu, setOpenMenu] = useState("epc");

  /* ---------------- DUMMY JSON DATA ---------------- */

  const contractorData = {
    electrical: [
      {
        id: 1,
        company: "Power Grid Electricals",
        location: "Raipur",
        experience: "10 Years",
        projects: 25,
        image:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 2,
        company: "Volt Energy Pvt Ltd",
        location: "Bilaspur",
        experience: "7 Years",
        projects: 18,
        image:
          "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    hvac: [
      {
        id: 1,
        company: "Cool Air Systems",
        location: "Durg",
        experience: "12 Years",
        projects: 30,
        image:
          "https://images.unsplash.com/photo-1581092921461-eab10380d70a?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 2,
        company: "Smart Climate Solutions",
        location: "Raigarh",
        experience: "5 Years",
        projects: 14,
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    firefighting: [
      {
        id: 1,
        company: "Safe Fire Tech",
        location: "Raipur",
        experience: "8 Years",
        projects: 20,
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    medical: [
      {
        id: 1,
        company: "Health Equip Suppliers",
        location: "Bilaspur",
        experience: "6 Years",
        projects: 11,
        image:
          "https://images.unsplash.com/photo-1580281657527-47b7f8d2b1df?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    firealarm: [
      {
        id: 1,
        company: "Alert Fire Systems",
        location: "Raipur",
        experience: "9 Years",
        projects: 17,
        image:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    building: [
      {
        id: 1,
        company: "Skyline Builders",
        location: "Raipur",
        experience: "15 Years",
        projects: 40,
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    road: [
      {
        id: 1,
        company: "Highway Infra Ltd",
        location: "Korba",
        experience: "20 Years",
        projects: 50,
        image:
          "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    mep: [
      {
        id: 1,
        company: "MEP Engineering Works",
        location: "Dhamtari",
        experience: "13 Years",
        projects: 22,
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  };

  /* ---------------- MENU ---------------- */

  const menuItems = [
    {
      key: "epc",
      label: "EPC Contractor",
      subMenu: [
        { key: "electrical", label: "Electrical Contractor" },
        { key: "hvac", label: "HVAC Contractor" },
        { key: "firefighting", label: "Fire Fighting Contractor" },
        { key: "medical", label: "Medical Supply Contractor" },
        { key: "firealarm", label: "Fire Alarm Contractor" },
      ],
    },

    {
      key: "building",
      label: "Building Contractor",
    },

    {
      key: "road",
      label: "Road Contractor",
    },

    {
      key: "mep",
      label: "MEP Contractor",
    },
  ];

  const currentData = contractorData[activeMenu] || [];

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-3xl shadow-lg p-4 sticky top-4 border border-slate-200">

            <h2 className="text-xl font-bold text-[#28354D] mb-5 border-b pb-3">
              Contractor Services
            </h2>

            <div className="space-y-3">

              {menuItems.map((menu) => (
                <div
                  key={menu.key}
                  className="rounded-2xl border border-slate-200 overflow-hidden"
                >

                  {/* MAIN MENU */}
                  <div
                    onClick={() => {
                      if (menu.subMenu) {
                        setOpenMenu(openMenu === menu.key ? null : menu.key);
                      } else {
                        setActiveMenu(menu.key);
                      }
                    }}
                    className={`
                      flex items-center justify-between px-4 py-4 cursor-pointer transition-all
                      ${
                        activeMenu === menu.key || openMenu === menu.key
                          ? "bg-[#28354D] text-white"
                          : "bg-white hover:bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    <span className="font-semibold text-sm">
                      {menu.label}
                    </span>

                    {menu.subMenu && (
                      <span
                        className={`transition duration-300 ${
                          openMenu === menu.key ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    )}
                  </div>

                  {/* SUB MENU */}
                  {menu.subMenu && (
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        openMenu === menu.key
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="bg-slate-50 p-2 space-y-2">

                        {menu.subMenu.map((sub) => (
                          <div
                            key={sub.key}
                            onClick={() => setActiveMenu(sub.key)}
                            className={`
                              px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all
                              ${
                                activeMenu === sub.key
                                  ? "bg-blue-600 text-white shadow"
                                  : "text-slate-700 hover:bg-white"
                              }
                            `}
                          >
                            {sub.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 min-h-[500px] border border-slate-200">

            {/* TITLE */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#28354D] mb-6">
              {menuItems
                .flatMap((item) =>
                  item.subMenu ? item.subMenu : item
                )
                .find((m) => m.key === activeMenu)?.label}
            </h2>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >

                  {/* IMAGE */}
                  <div className="h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.company}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="text-xl font-bold text-[#28354D] mb-4">
                      {item.company}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-600">

                      <p>
                        <span className="font-semibold text-slate-800">
                          Location:
                        </span>{" "}
                        {item.location}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">
                          Experience:
                        </span>{" "}
                        {item.experience}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">
                          Completed Projects:
                        </span>{" "}
                        {item.projects}
                      </p>
                    </div>

                    {/* BUTTON */}
                    <button className="mt-5 w-full px-4 py-3 bg-[#28354D] text-white rounded-2xl text-sm font-medium hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorService;