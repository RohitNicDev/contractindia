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

const ConsultingService = () => {
  const [activeMenu, setActiveMenu] = useState("epcconsultancy");
  const [openMenu, setOpenMenu] = useState("mep");

  /* ---------------- DUMMY JSON DATA ---------------- */

const consultingData = {
  /* ---------------- EPC CONSULTANCY ---------------- */

  epcconsultancy: [
    {
      id: 1,
      company: "Prime EPC Consultants",
      location: "Delhi",
      experience: "15 Years",
      projects: 55,
      rating: "4.9",
      description:
        "Specialized EPC consultancy firm delivering end-to-end infrastructure and industrial project solutions.",
      image:
        "https://www.apacoutlookmag.com/media/MAIN-Primero.webp",
    },

    {
      id: 2,
      company: "Mega Infra Consultancy",
      location: "Mumbai",
      experience: "11 Years",
      projects: 39,
      rating: "4.7",
      description:
        "Expert consultants for engineering procurement and turnkey construction management services.",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- PROJECT MANAGEMENT ---------------- */

  projectmanagement: [
    {
      id: 1,
      company: "Vision PMC Services",
      location: "Pune",
      experience: "13 Years",
      projects: 48,
      rating: "4.8",
      description:
        "Providing complete project management consultancy for residential and commercial developments.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "BuildTrack PMC",
      location: "Bangalore",
      experience: "10 Years",
      projects: 30,
      rating: "4.6",
      description:
        "Professional PMC firm focused on execution planning, budgeting and project supervision.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- ARCHITECTURAL ---------------- */

  architectural: [
    {
      id: 1,
      company: "UrbanArc Designers",
      location: "Jaipur",
      experience: "14 Years",
      projects: 44,
      rating: "4.9",
      description:
        "Creative architectural consultancy for luxury residential and commercial spaces.",
      image:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "SpaceCraft Architects",
      location: "Delhi",
      experience: "9 Years",
      projects: 27,
      rating: "4.7",
      description:
        "Innovative architectural planning and modern building design consultancy services.",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- MEP DESIGN ---------------- */

  mepdesign: [
    {
      id: 1,
      company: "MEP Tech Consultants",
      location: "Hyderabad",
      experience: "12 Years",
      projects: 35,
      rating: "4.8",
      description:
        "Integrated MEP design consultancy for commercial, hospital and industrial projects.",
      image:
        "https://sparko-africa.com/wp-content/uploads/2025/11/23.webp",
    },

    {
      id: 2,
      company: "Integrated MEP Solutions",
      location: "Noida",
      experience: "8 Years",
      projects: 22,
      rating: "4.6",
      description:
        "Professional MEP planning, drafting and engineering consultancy services.",
      image:
        "https://sparko-africa.com/wp-content/uploads/2025/11/23.webp",
    },
  ],

  /* ---------------- HVAC DESIGN ---------------- */

  hvacdesign: [
    {
      id: 1,
      company: "CoolAir Design Studio",
      location: "Chennai",
      experience: "11 Years",
      projects: 31,
      rating: "4.8",
      description:
        "HVAC consultancy and energy-efficient cooling system design specialists.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0am-QxEN8QREmuYoI3OBw-CErgLC4omajg&sv",
    },

    {
      id: 2,
      company: "Climate Engineers",
      location: "Pune",
      experience: "7 Years",
      projects: 18,
      rating: "4.5",
      description:
        "Experts in HVAC load calculation, ducting and centralized cooling solutions.",
      image:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- ELECTRICAL DESIGN ---------------- */

  electricaldesign: [
    {
      id: 1,
      company: "Volt Design Consultancy",
      location: "Raipur",
      experience: "10 Years",
      projects: 25,
      rating: "4.7",
      description:
        "Electrical system design consultancy for residential, commercial and industrial projects.",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "PowerGrid Engineers",
      location: "Delhi",
      experience: "13 Years",
      projects: 40,
      rating: "4.9",
      description:
        "Experts in HT/LT electrical planning, substation layouts and power management systems.",
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- FIRE FIGHTING DESIGN ---------------- */

  firefightingdesign: [
    {
      id: 1,
      company: "FireSecure Consultants",
      location: "Noida",
      experience: "9 Years",
      projects: 20,
      rating: "4.6",
      description:
        "Fire protection and fire fighting design consultancy with safety compliance expertise.",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "SafeZone Fire Engineers",
      location: "Mumbai",
      experience: "12 Years",
      projects: 29,
      rating: "4.8",
      description:
        "Consultancy for hydrant systems, sprinkler systems and fire alarm planning.",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- PLUMBING DESIGN ---------------- */

  plumbingdesign: [
    {
      id: 1,
      company: "AquaFlow Consultants",
      location: "Ahmedabad",
      experience: "8 Years",
      projects: 17,
      rating: "4.5",
      description:
        "Professional plumbing and piping design consultancy for modern infrastructure projects.",
      image:
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "FlowTech Engineers",
      location: "Bhopal",
      experience: "10 Years",
      projects: 24,
      rating: "4.7",
      description:
        "Experts in plumbing layouts, water distribution and drainage design systems.",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- WATER & WASTE WATER ---------------- */

  waterwastewater: [
    {
      id: 1,
      company: "BlueWater Consultants",
      location: "Surat",
      experience: "14 Years",
      projects: 38,
      rating: "4.9",
      description:
        "Water and waste water infrastructure consultancy for municipal and industrial projects.",
      image:
        "https://images.jdmagicbox.com/v2/comp/bangalore/h1/080pxx80.xx80.200117211232.q8h1/catalogue/blue-water-company-kengeri-bangalore-environmental-health-consultants-c87kfo27z5.jpg",
    },

    {
      id: 2,
      company: "Eco Utility Engineers",
      location: "Nagpur",
      experience: "11 Years",
      projects: 26,
      rating: "4.7",
      description:
        "Specialized in STP, WTP and waste water recycling consultancy solutions.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4hFAkLGLQsjuanHv6PoGu3bpOG4LA31erDg&s",
    },
  ],
};

 

const menuItems = [
  {
    key: "epcconsultancy",
    label: "EPC Consultancy",
  },

  {
    key: "projectmanagement",
    label: "Project Management Consultancy",
  },

  {
    key: "architectural",
    label: "Architectural Services",
  },

  {
    key: "mepdesign",
    label: "MEP Design Consultancy",
  },

  {
    key: "hvacdesign",
    label: "HVAC Design Consultancy",
  },

  {
    key: "electricaldesign",
    label: "Electrical Design Consultancy",
  },

  {
    key: "firefightingdesign",
    label: "Fire Fighting Design Consultancy",
  },

  {
    key: "plumbingdesign",
    label: "Plumbing Design Consultancy",
  },

  {
    key: "waterwastewater",
    label: "Water & Waste Water Design Consultancy",
  },
];

  const currentData = consultingData [activeMenu] || [];

  const activeLabel =
    menuItems
      .flatMap((item) => (item.subMenu ? item.subMenu : item))
      .find((m) => m.key === activeMenu)?.label || "Consulting Services";

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-8 px-4 md:px-6 font-sans selection:bg-blue-100">
      <div className="max-w-[1600px] mx-auto">
 
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        
          <aside className="space-y-4 h-fit sticky top-6">
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3">
              Consulting Services
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
                  {activeLabel } /
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

export default ConsultingService;
