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

const MaterialSuppler = () => {
  const [activeMenu, setActiveMenu] = useState("cementtrades");
  const [openMenu, setOpenMenu] = useState("cementtrades");

  /* ---------------- DUMMY JSON DATA ---------------- */

const materialSupplierTradeData = {
  /* ---------------- CEMENT TRADES ---------------- */

  cementtrades: [
    {
      id: 1,
      company: "Shree Cement Traders",
      location: "Raipur",
      experience: "15 Years",
      projects: 320,
      rating: "4.8",
      description:
        "Leading cement trading company supplying OPC, PPC and premium cement brands for infrastructure and residential projects.",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "BuildStrong Cement Supply",
      location: "Nagpur",
      experience: "12 Years",
      projects: 250,
      rating: "4.7",
      description:
        "Bulk cement supplier serving builders, contractors and industrial construction projects across India.",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,
      company: "UltraMix Cement Agency",
      location: "Delhi",
      experience: "10 Years",
      projects: 190,
      rating: "4.6",
      description:
        "Authorized cement distributor providing fast delivery and premium construction material solutions.",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- ALUMINIUM TRADES ---------------- */

  aluminiumtrades: [
    {
      id: 1,
      company: "AluTech Trading Co.",
      location: "Ahmedabad",
      experience: "11 Years",
      projects: 180,
      rating: "4.7",
      description:
        "Supplier of aluminium sheets, ACP panels, windows and fabrication materials for modern infrastructure.",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Metro Aluminium Traders",
      location: "Mumbai",
      experience: "14 Years",
      projects: 230,
      rating: "4.8",
      description:
        "Industrial aluminium trading company serving façade, commercial and fabrication industries.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,
      company: "Elite Aluminium Works",
      location: "Pune",
      experience: "9 Years",
      projects: 145,
      rating: "4.5",
      description:
        "Premium aluminium supplier for doors, windows, curtain walls and architectural projects.",
      image:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- WOODEN TILES TRADE ---------------- */

  woodentilestrade: [
    {
      id: 1,
      company: "WoodStyle Flooring",
      location: "Bangalore",
      experience: "9 Years",
      projects: 140,
      rating: "4.6",
      description:
        "Supplier of premium wooden tiles, laminate flooring and decorative interior surface products.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Natural Wood Decor",
      location: "Hyderabad",
      experience: "11 Years",
      projects: 170,
      rating: "4.7",
      description:
        "Wooden tile and texture flooring trading company for residential and commercial interiors.",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,
      company: "Urban Floor Gallery",
      location: "Delhi",
      experience: "7 Years",
      projects: 115,
      rating: "4.5",
      description:
        "Modern wooden flooring and tile trading solutions for luxury spaces and offices.",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  /* ---------------- PAINTS TRADE ---------------- */

  paintstrade: [
    {
      id: 1,
      company: "ColorPlus Paint Traders",
      location: "Mumbai",
      experience: "13 Years",
      projects: 290,
      rating: "4.8",
      description:
        "Authorized dealer of decorative, industrial and waterproof paints for residential and commercial projects.",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Prime Paint Solutions",
      location: "Pune",
      experience: "8 Years",
      projects: 150,
      rating: "4.5",
      description:
        "Premium supplier of interior paints, textures and exterior weatherproof coating solutions.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,
      company: "Rainbow Paint Hub",
      location: "Jaipur",
      experience: "10 Years",
      projects: 210,
      rating: "4.7",
      description:
        "Paint trading and coating solutions provider for infrastructure and luxury interior projects.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};
 
const menuItems = [
  {
    key: "materialsuppliertrade",
    label: "Material Supplier & Trade",
    subMenu: [
      {
        key: "cementtrades",
        label: "Cement Trades",
      },

      {
        key: "aluminiumtrades",
        label: "Aluminium Trades",
      },

      {
        key: "woodentilestrade",
        label: "Wooden Tiles Trade",
      },

      {
        key: "paintstrade",
        label: "Paints Trade",
      },
    ],
  },
];

  const currentData = materialSupplierTradeData [activeMenu] || [];

  const activeLabel =
    menuItems
      .flatMap((item) => (item.subMenu ? item.subMenu : item))
      .find((m) => m.key === activeMenu)?.label || "Procurement Services/ Material Manufacturing";

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-8 px-4 md:px-6 font-sans selection:bg-blue-100">
      <div className="max-w-[1600px] mx-auto">
 
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        
          <aside className="space-y-4 h-fit sticky top-6">
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3">
             Procurement Services/ Material Supply
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

export default MaterialSuppler;
