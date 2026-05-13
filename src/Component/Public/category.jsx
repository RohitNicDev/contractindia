import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const cats = [
  { name: "Consulting Services",          image: "https://5.imimg.com/data5/SELLER/Default/2021/10/JB/EA/LS/8271659/civil-engineering-consultant-service.jpg",                                                                                                count: "2,840 Companies" },
  { name: "Contractor Services",          image: "https://5.imimg.com/data5/SELLER/Default/2024/7/433106499/MX/HO/RU/57976404/civil-construction-contractor-service.jpg",                                                                                    count: "1,230 Firms"     },
  { name: "Tender Services",              image: "https://5.imimg.com/data5/SELLER/Default/2026/3/588860952/XX/AP/XV/257074973/civil-engineering-services-500x500.jpg",                                                                                       count: "4,200 Designers" },
  { name: "Assets Management",            image: "https://www.ice.org.uk/media/4uqp5eho/guiding-principles-of-asset-management-realising-a-world-class-infrastructure.jpg",                                                                                   count: "2,600 Firms"     },
  { name: "Legal Contracts Services",     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxKIwcO2VCrmiZ-GbLOYc8OwDjYe_y5DEugA&s",                                                                                                           count: "1,900 Projects"  },
  { name: "Procurement Services",         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbIAl1Kayn3rgdtNTg3qsEXS8JGKFqGVIr6w&s",                                                                                                           count: "980 Providers"   },
  { name: "Brand Development Management", image: "https://cdn.thebrandingjournal.com/wp-content/uploads/2024/02/Branding-Process-The-Branding-Journal-1024x704.png",                                                                                         count: "2,200 Vendors"   },
  { name: "Marketing Management",         image: "https://media.geeksforgeeks.org/wp-content/uploads/20240222165724/marketing-management-copy.webp",                                                                                                          count: "620 Experts"     },
  { name: "Construction Audit",           image: "https://prosoftnet.com/cdn/shop/articles/6-ways-land-surveying-shapes-infrastructure-planning.jpg?v=1705445625",                                                                                            count: "620 Experts"     },
];

const valueItems = [
  {
    emoji: "📋",
    title: "Book Consultation",
    desc: "👁️ No hidden costs · 🧮 Easy EMI",
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    emoji: "🏬",
    title: "List Your Company",
    desc: "Reach thousands of project owners & procurement teams across India",
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    emoji: "👷",
    title: "End to End Construction Solutions",
    desc: "Paints / Waterproofing, Consultants, Cement / Concrete, Safety & Fire Protection",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.25)",
  },
];

export function ValueStrip() {
  return (
    <div className="bg-slate-100 mt-20">
      <section className="container mx-auto px-4 -mt-14 relative z-30">
        <div className="grid md:grid-cols-3 gap-5">
          {valueItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.13, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="group relative bg-white rounded-2xl p-5 flex gap-4 items-start overflow-hidden cursor-pointer"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(circle at 20% 50%, ${item.glow} 0%, transparent 65%)` }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400"
                style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="relative z-10 h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #162646, #1e3a5f)" }}
              >
                {item.emoji}
              </div>

              {/* Content */}
              <div className="relative z-10 mt-0.5 flex-1">
                <h3 className="font-extrabold text-[#162646] text-sm md:text-base leading-tight group-hover:text-[#6366f1] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs border-t border-slate-100 pt-2 mt-2 text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                  style={{ color: item.accent }}>
                  Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Categories() {
  const visibleCats = cats.slice(0, 8);

  return (
    <div className="relative bg-slate-100 overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4 py-20 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
              ✦ Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Service Category
              </span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Connect with verified professionals and specialized agencies.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleCats.map((c, index) => (
            <motion.a
              key={index}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -7, transition: { duration: 0.25 } }}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-2xl transition-all duration-400"
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Hover overlay shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/15 group-hover:to-transparent transition-all duration-500" />

                {/* Count badge */}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow text-[10px] font-bold text-slate-700">
                  {c.count}
                </div>

                {/* Arrow icon on hover */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#162646] leading-snug group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                  {c.name}
                </h3>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
