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

const MarketingManagement = () => {
  const [activeMenu, setActiveMenu] = useState("marketingmanagement");
  const [openMenu, setOpenMenu] = useState("marketingmanagement");

const marketingManagementData = {
  marketingmanagement: [
    {
      id: 1,
      company: "Digital Reach Marketing",
      location: "Delhi",
      experience: "9 Years",
      projects: 140,
      rating: "4.9",
      description:
        "Complete digital marketing management including SEO, social media campaigns, lead generation and online branding.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      company: "Growth Media Solutions",
      location: "Mumbai",
      experience: "11 Years",
      projects: 180,
      rating: "4.8",
      description:
        "Strategic marketing management services focused on business growth, advertising and customer engagement.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,
      company: "Creative Campaign Studio",
      location: "Bangalore",
      experience: "7 Years",
      projects: 95,
      rating: "4.7",
      description:
        "Creative campaign management for startups and enterprises including social media and paid advertising.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 4,
      company: "Market Vision Experts",
      location: "Hyderabad",
      experience: "10 Years",
      projects: 125,
      rating: "4.8",
      description:
        "Professional marketing consultancy and brand promotion solutions for online and offline markets.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 5,
      company: "Smart Growth Agency",
      location: "Pune",
      experience: "8 Years",
      projects: 88,
      rating: "4.6",
      description:
        "Business marketing management with performance analytics, content strategy and customer acquisition planning.",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

const menuItems = [
  {
    key: "marketingmanagement",
    label: "Marketing Management",
  },
];

  const currentData = marketingManagementData[activeMenu] || [];

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
             Marketing Management
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

export default MarketingManagement;
