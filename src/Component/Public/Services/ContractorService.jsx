import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  MapPin,
  PhoneCall,
  Star,
} from "lucide-react";

const ContractorService = () => {
  const [activeMenu, setActiveMenu] = useState("electrical");
  const [openMenu, setOpenMenu] = useState("mep");

  /* ---------------- DUMMY JSON DATA ---------------- */

  const contractorData = {
    /* ---------------- EPC ---------------- */

    epc: [
      {
        id: 1,
        company: "EPC Infra Projects",
        location: "Delhi",
        experience: "15 Years",
        projects: 52,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Mega EPC Solutions",
        location: "Mumbai",
        experience: "11 Years",
        projects: 38,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- BUILDING ---------------- */

    building: [
      {
        id: 1,
        company: "Skyline Builders",
        location: "Bilaspur",
        experience: "12 Years",
        projects: 32,
        rating: "4.8",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Urban Heights Construction",
        location: "Raipur",
        experience: "9 Years",
        projects: 24,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- ROAD ---------------- */

    road: [
      {
        id: 1,
        company: "Highway Infra Ltd",
        location: "Korba",
        experience: "20 Years",
        projects: 50,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "National Road Developers",
        location: "Nagpur",
        experience: "17 Years",
        projects: 41,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- HEAVY FABRICATION ---------------- */

    heavyfabrication: [
      {
        id: 1,
        company: "SteelFab Industries",
        location: "Bhilai",
        experience: "14 Years",
        projects: 29,
        rating: "4.8",
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Heavy Structure Works",
        location: "Raigarh",
        experience: "16 Years",
        projects: 35,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- DOOR WINDOW ---------------- */

    doorwindow: [
      {
        id: 1,
        company: "Modern Door Systems",
        location: "Indore",
        experience: "8 Years",
        projects: 19,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "UPVC World",
        location: "Delhi",
        experience: "6 Years",
        projects: 15,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- ELECTRICAL ---------------- */

    electrical: [
      {
        id: 1,
        company: "Power Grid Electricals",
        location: "Raipur",
        experience: "10 Years",
        projects: 25,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Volt Energy Infra",
        location: "Bilaspur",
        experience: "7 Years",
        projects: 18,
        rating: "4.7",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwfpGPMRYuDpAkqyWk_eHeAHsmAaSuzkMcGg&s",
      },
    ],

    /* ---------------- HVAC ---------------- */

    hvac: [
      {
        id: 1,
        company: "Cool Air Systems",
        location: "Durg",
        experience: "12 Years",
        projects: 30,
        rating: "4.8",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6eG_uCijtr2lFklWtFgDaJomZJTALOTZH5w&s",
      },

      {
        id: 2,
        company: "Smart Climate Solutions",
        location: "Pune",
        experience: "9 Years",
        projects: 21,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- FIRE FIGHTING ---------------- */

    firefighting: [
      {
        id: 1,
        company: "Safe Fire Tech",
        location: "Raipur",
        experience: "8 Years",
        projects: 20,
        rating: "4.6",
        image:
          "https://www.spek.fi/wp-content/uploads/2022/08/palontorjuntatekniikanhyotyjaarvo.jpg",
      },

      {
        id: 2,
        company: "Fire Shield Systems",
        location: "Noida",
        experience: "11 Years",
        projects: 27,
        rating: "4.8",
        image:
          "https://internationalfireandsafetyjournal.com/wp-content/uploads/2025/11/industrial-fire-shield.webp",
      },
    ],

    /* ---------------- PLUMBING ---------------- */

    plumbing: [
      {
        id: 1,
        company: "Aqua Plumbing Works",
        location: "Bilaspur",
        experience: "9 Years",
        projects: 18,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "FlowMax Plumbing",
        location: "Raipur",
        experience: "7 Years",
        projects: 16,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- STP / WTP / ETP ---------------- */

    stpwtpetp: [
      {
        id: 1,
        company: "Pure Water Solutions",
        location: "Ahmedabad",
        experience: "13 Years",
        projects: 31,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Eco Treatment Plants",
        location: "Hyderabad",
        experience: "10 Years",
        projects: 22,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- ELV ---------------- */

    elv: [
      {
        id: 1,
        company: "ELV Smart Systems",
        location: "Bangalore",
        experience: "8 Years",
        projects: 17,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Secure ELV Solutions",
        location: "Delhi",
        experience: "6 Years",
        projects: 13,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- MEDICAL SUPPLY ---------------- */

    medicalsupply: [
      {
        id: 1,
        company: "Health Equip Suppliers",
        location: "Bilaspur",
        experience: "6 Years",
        projects: 11,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1580281657527-47b7f8d2b1df?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "MediTech Supply",
        location: "Delhi",
        experience: "9 Years",
        projects: 19,
        rating: "4.8",
        image:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- MEDICAL GAS ---------------- */

    medicalgas: [
      {
        id: 1,
        company: "OxyFlow Gas Systems",
        location: "Mumbai",
        experience: "12 Years",
        projects: 28,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Hospital Gas Infra",
        location: "Chennai",
        experience: "10 Years",
        projects: 21,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- FIRE ALARM ---------------- */

    firealarm: [
      {
        id: 1,
        company: "Alert Fire Systems",
        location: "Raipur",
        experience: "9 Years",
        projects: 17,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Safe Alert Technologies",
        location: "Pune",
        experience: "7 Years",
        projects: 15,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- WATER WASTE WATER ---------------- */

    waterwastewater: [
      {
        id: 1,
        company: "Water Care Infra",
        location: "Nagpur",
        experience: "14 Years",
        projects: 36,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "BlueDrop Utilities",
        location: "Surat",
        experience: "11 Years",
        projects: 24,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- GLASS FACADE ---------------- */

    glassfacade: [
      {
        id: 1,
        company: "Crystal Facade Systems",
        location: "Delhi",
        experience: "13 Years",
        projects: 34,
        rating: "4.8",
        image:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Modern Glass Infra",
        location: "Noida",
        experience: "9 Years",
        projects: 22,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- ACP FACADE ---------------- */

    acpfacade: [
      {
        id: 1,
        company: "ACP Cladding Experts",
        location: "Indore",
        experience: "11 Years",
        projects: 27,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Elite ACP Solutions",
        location: "Bhopal",
        experience: "8 Years",
        projects: 18,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- STONE FACADE ---------------- */

    stonefacade: [
      {
        id: 1,
        company: "StoneCraft Facades",
        location: "Jaipur",
        experience: "16 Years",
        projects: 41,
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- GRC FACADE ---------------- */

    grcfacade: [
      {
        id: 1,
        company: "GRC Design Studio",
        location: "Mumbai",
        experience: "10 Years",
        projects: 20,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- BRIDGE ---------------- */

    bridge: [
      {
        id: 1,
        company: "Bridge Tech Infra",
        location: "Raipur",
        experience: "18 Years",
        projects: 36,
        rating: "4.8",
        image:
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "RiverSpan Engineering",
        location: "Lucknow",
        experience: "15 Years",
        projects: 31,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1516490981167-dc990a242afe?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- CIVIL ---------------- */

    civil: [
      {
        id: 1,
        company: "CivilCore Projects",
        location: "Raigarh",
        experience: "14 Years",
        projects: 28,
        rating: "4.7",
        image:
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "Prime Civil Works",
        location: "Patna",
        experience: "9 Years",
        projects: 19,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- HARD SCAPE ---------------- */

    hardscape: [
      {
        id: 1,
        company: "Hardscape Designers",
        location: "Pune",
        experience: "8 Years",
        projects: 15,
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
      },
    ],

    /* ---------------- SOFT SCAPE ---------------- */

    softscape: [
      {
        id: 1,
        company: "Green Leaf Landscapes",
        location: "Bangalore",
        experience: "10 Years",
        projects: 26,
        rating: "4.8",
        image:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
      },

      {
        id: 2,
        company: "NatureScape Horticulture",
        location: "Hyderabad",
        experience: "7 Years",
        projects: 14,
        rating: "4.5",
        image:
          "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  };

 

  const menuItems = [
    {
      key: "epc",
      label: "EPC Contractor",
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
      key: "fabrication",
      label: "Fabrication Contractor",
      subMenu: [
        {
          key: "heavyfabrication",
          label: "Heavy Fabrication",
        },
        {
          key: "doorwindow",
          label: "Door & Window",
        },
      ],
    },

    {
      key: "mep",
      label: "MEP Contractor",
      subMenu: [
        { key: "electrical", label: "Electrical" },
        { key: "hvac", label: "HVAC" },
        { key: "firefighting", label: "Fire Fighting" },
        { key: "plumbing", label: "Plumbing" },
      ],
    },

    {
      key: "facade",
      label: "Facade Contractor",
      subMenu: [
        {
          key: "glassfacade",
          label: "Glass Facade",
        },
        {
          key: "acpfacade",
          label: "ACP Facade",
        },
      ],
    },

    {
      key: "bridge",
      label: "Bridge Contractor",
    },

    {
      key: "civil",
      label: "Civil Contractor",
    },

    {
      key: "landscape",
      label: "Landscape Contractor",
      subMenu: [
        {
          key: "hardscape",
          label: "Hard Scape",
        },
        {
          key: "softscape",
          label: "Soft Scape",
        },
      ],
    },
  ];

  const currentData = contractorData[activeMenu] || [];

  const activeLabel =
    menuItems
      .flatMap((item) => (item.subMenu ? item.subMenu : item))
      .find((m) => m.key === activeMenu)?.label || "Contractor Services";

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-8 px-4 md:px-6 font-sans selection:bg-blue-100">
      <div className="max-w-[1600px] mx-auto">
 
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        
          <aside className="space-y-4 h-fit sticky top-6">
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3">
              Contractor Services
            </p>
            <nav className="bg-white/70 backdrop-blur-xl rounded-[24px] p-2 border border-white shadow-sm">
              {menuItems.map((menu) => {
                const hasSubMenu = menu.subMenu && menu.subMenu.length > 0;
                // Check agar is menu ka koi sub-item active hai
                const isSubItemActive =
                  hasSubMenu &&
                  menu.subMenu.some((sub) => sub.key === activeMenu);
                // Check agar ye khud active hai (jab sub-menu na ho)
                const isParentActive = activeMenu === menu.key;

                return (
                  <div key={menu.key} className="mb-1">
                    <div
                      onClick={() => {
                        if (hasSubMenu) {
                          setOpenMenu(openMenu === menu.key ? null : menu.key);
                        } else {
                          setActiveMenu(menu.key);
                          setOpenMenu(null); // Close other submenus
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200
              ${
                isParentActive || (isSubItemActive && openMenu !== menu.key)
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
                    >
                      <span className="font-semibold text-[13px]">
                        {menu.label}
                      </span>
                      {hasSubMenu && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${openMenu === menu.key ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>

                    <AnimatePresence>
                      {hasSubMenu && openMenu === menu.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="py-1 px-2 mt-1 space-y-0.5">
                            {menu.subMenu.map((sub) => (
                              <button
                                key={sub.key}
                                onClick={() => setActiveMenu(sub.key)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-[12px] font-bold transition-all
                        ${
                          activeMenu === sub.key
                            ? "text-blue-600 bg-blue-50/80 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.1)]"
                            : "text-slate-500 hover:bg-white hover:text-slate-900"
                        }`}
                              >
                                • {sub.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </aside>

     
          <section>
       
            <div className="flex items-center justify-between mb-6 px-1">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {activeLabel} /
                  <span className="text-sm font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                    {currentData.length}
                  </span>
                </h2>
              </div>
            </div>

     
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {currentData.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    className="group bg-white rounded-3xl border border-slate-200/60 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
                  >
                
                    <div className="relative h-36 m-2 rounded-2xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.company}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
 
                      <div className="absolute top-2 left-2 flex gap-1">
                        <div className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                          <Star
                            size={10}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-[10px] font-black text-slate-800">
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    </div>
 
                    <div className="px-4 pb-4">
                      <div className="mb-2">
                        <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.company}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                          <MapPin size={10} />
                          <span className="text-[10px] font-medium truncate">
                            {item.location}
                          </span>
                        </div>
                      </div>

    
                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-50 mb-1">
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            Experience
                          </p>
                          <p className="text-[11px] font-bold text-slate-700">
                            {item.experience}
                          </p>
                        </div>
                        <div className="border-l border-slate-100 pl-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            Projects
                          </p>
                          <p className="text-[11px] font-bold text-slate-700">
                            {item.projects}+
                          </p>
                        </div>
                      </div>

       
                      <div className="mb-4">
                        <p className="text-[13px] leading-[1.5] text-slate-500 line-clamp-2 italic font-medium">
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
                         
                        </p>
                      </div>

                      
                      <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-2 rounded-xl text-[11px] font-bold transition-all transform active:scale-95 shadow-sm">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

           
            {currentData.length === 0 && (
              <motion.div className="bg-white rounded-[40px] border border-dashed border-slate-300 py-20 text-center">
                <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">
                  No Specialists Found
                </h3>
                <p className="text-slate-400 text-sm mt-2">
                  Try switching categories or check back later.
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContractorService;
