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

const TenderServices = () => {
  const [activeMenu, setActiveMenu] = useState("stategov");
const [openMenu, setOpenMenu] = useState("govtenders");

  /* ---------------- DUMMY JSON DATA ---------------- */

const tenderData = {
  /* ---------------- STATE GOV ---------------- */

  stategov: [
    {
      id: 1,
      company: "PWD Road Development Tender",
      location: "Raipur, Chhattisgarh",
      experience: "Tender Value ₹2.5 Cr",
      projects: 12,
      rating: "4.9",
      description:
        "State government tender for highway widening, drainage and road infrastructure development work.",
      image:
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Smart City Civil Tender",
      location: "Indore, Madhya Pradesh",
      experience: "Tender Value ₹1.2 Cr",
      projects: 8,
      rating: "4.7",
      description:
        "Urban smart city development tender including landscaping, electrical and public utility work.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- CENTRAL GOV ---------------- */

  centralgov: [
    {
      id: 1,
      company: "National Highway Authority Tender",
      location: "Delhi",
      experience: "Tender Value ₹18 Cr",
      projects: 22,
      rating: "4.9",
      description:
        "Central government infrastructure tender for expressway and bridge construction package.",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Railway Electrification Tender",
      location: "Mumbai",
      experience: "Tender Value ₹9 Cr",
      projects: 16,
      rating: "4.8",
      description:
        "Indian railway electrical and signaling infrastructure modernization tender.",
      image:
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- INDIVIDUAL TENDERS ---------------- */

  individualtenders: [
    {
      id: 1,
      company: "Residential Interior Tender",
      location: "Pune",
      experience: "Tender Value ₹28 Lakh",
      projects: 5,
      rating: "4.6",
      description:
        "Private residential interior and renovation work tender for villa project execution.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Office Renovation Tender",
      location: "Bangalore",
      experience: "Tender Value ₹42 Lakh",
      projects: 7,
      rating: "4.5",
      description:
        "Corporate office renovation tender including HVAC, electrical and furnishing work.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- BUILDERS TENDERS ---------------- */

  builderstenders: [
    {
      id: 1,
      company: "Luxury Township Tender",
      location: "Noida",
      experience: "Tender Value ₹14 Cr",
      projects: 20,
      rating: "4.8",
      description:
        "Builder tender for residential towers, clubhouse and landscape infrastructure development.",
      image:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Commercial Complex Tender",
      location: "Hyderabad",
      experience: "Tender Value ₹7 Cr",
      projects: 15,
      rating: "4.7",
      description:
        "Commercial building construction tender with façade, MEP and civil package work.",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- CONTRACTOR TENDERS ---------------- */

  contractortenders: [
    {
      id: 1,
      company: "Industrial Plant Tender",
      location: "Ahmedabad",
      experience: "Tender Value ₹11 Cr",
      projects: 18,
      rating: "4.8",
      description:
        "Industrial fabrication and EPC contractor tender for plant expansion project.",
      image:
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Bridge Repair Tender",
      location: "Lucknow",
      experience: "Tender Value ₹3.8 Cr",
      projects: 10,
      rating: "4.6",
      description:
        "Infrastructure contractor tender for bridge strengthening and rehabilitation work.",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

const menuItems = [
  {
    key: "govtenders",
    label: "Gov. Tenders",  
    subMenu: [
      {
        key: "stategov",
        label: "State Gov.",
      },

      {
        key: "centralgov",
        label: "Central Gov.",
      },
    ],
  },

  {
    key: "privatetenders",
    label: "Private Tenders",
    subMenu: [
      {
        key: "individualtenders",
        label: "Individual Tenders",
      },

      {
        key: "builderstenders",
        label: "Builders Tenders",
      },

      {
        key: "contractortenders",
        label: "Contractor Tenders",
      },
    ],
  },
];

  const currentData = tenderData  [activeMenu] || [];

  const activeLabel =
    menuItems
      .flatMap((item) => (item.subMenu ? item.subMenu : item))
      .find((m) => m.key === activeMenu)?.label || "Tender Services";

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-8 px-4 md:px-6 font-sans selection:bg-blue-100">
      <div className="max-w-[1600px] mx-auto">
 
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        
          <aside className="space-y-4 h-fit sticky top-6">
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3">
              Tender Services
            </p>
            <nav className="bg-white/70 backdrop-blur-xl rounded-[24px] p-2 border border-white shadow-sm">
              {menuItems.map((menu) => {
                const hasSubMenu = menu.subMenu && menu.subMenu.length > 0;
             
                const isSubItemActive =
                  hasSubMenu &&
                  menu.subMenu.some((sub) => sub.key === activeMenu);
            
                const isParentActive = activeMenu === menu.key;

                return (
                  <div key={menu.key} className="mb-1">
                    <div
                      onClick={() => {
                        if (hasSubMenu) {
                          setOpenMenu(openMenu === menu.key ? null : menu.key);
                        } else {
                          setActiveMenu(menu.key);
                          setOpenMenu(null);  
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

export default TenderServices;
