import React, { useState } from "react";

const ContractorService = () => {
  const [activeMenu, setActiveMenu] = useState("1");
  const [open, setOpen] = useState(true);

  const menuItems = [
    { key: "1", label: "MEP Contractor" },
    { key: "2", label: "Electrical Contractor" },
    { key: "3", label: "HVAC Contractor" },
    { key: "4", label: "Fire Fighting Contractor" },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "1":
        return (
          <div>
            <p className="text-slate-600 leading-relaxed">
              MEP Contractor related content...
            </p>
          </div>
        );

      case "2":
        return (
          <div>
            <p className="text-slate-600 leading-relaxed">
              Electrical Contractor related content...
            </p>
          </div>
        );

      case "3":
        return (
          <div>
            <p className="text-slate-600 leading-relaxed">
              HVAC Contractor related content...
            </p>
          </div>
        );

      case "4":
        return (
          <div>
            <p className="text-slate-600 leading-relaxed">
              Fire Fighting Contractor related content...
            </p>
          </div>
        );

      default:
        return <p>Select a service</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* 🔹 MOBILE + DESKTOP MENU */}
        <div className="w-full lg:w-72">

          <div className="bg-white rounded-2xl shadow-md p-4 sticky top-4">
            
            {/* Parent Menu */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between cursor-pointer"
            >
              <h3 className="text-sm font-bold text-slate-700 uppercase">
                Contractor
              </h3>

              <span
                className={`transition duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>

            {/* Sub Menu */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-2">
                {menuItems.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveMenu(item.key)}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition
                      ${
                        activeMenu === item.key
                          ? "bg-blue-600 text-white shadow"
                          : "text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 CONTENT */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 md:p-8 min-h-[400px]">

            <h2 className="text-2xl md:text-3xl font-bold text-[#28354D] mb-5">
              {menuItems.find((m) => m.key === activeMenu)?.label}
            </h2>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorService;