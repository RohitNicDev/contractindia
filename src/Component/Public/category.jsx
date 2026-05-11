import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  HardHat,
  Lightbulb,
  ShieldCheck,
      Plus
} from "lucide-react";

const cats = [
  { 
    name: "Consulting Services", 
    image: "https://5.imimg.com/data5/SELLER/Default/2021/10/JB/EA/LS/8271659/civil-engineering-consultant-service.jpg", 
    count: "2,840 Companies" 
  },
  { 
    name: "Contractor  Services", 
    image: "https://5.imimg.com/data5/SELLER/Default/2024/7/433106499/MX/HO/RU/57976404/civil-construction-contractor-service.jpg", 
    count: "1,230 Firms" 
  },
  { 
    name: "Tender Services", 
    image: "https://5.imimg.com/data5/SELLER/Default/2026/3/588860952/XX/AP/XV/257074973/civil-engineering-services-500x500.jpg", 
    count: "4,200 Designers" 
  }, 

  { 
    name: "Assets Management", 
    image: "https://www.ice.org.uk/media/4uqp5eho/guiding-principles-of-asset-management-realising-a-world-class-infrastructure.jpg", 
    count: "2,600 Firms" 
  },
  { 
    name: "Legal Contracts Services", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxKIwcO2VCrmiZ-GbLOYc8OwDjYe_y5DEugA&s", 
    count: "1,900 Projects" 
  },
  { 
    name: "Procurement Services", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbIAl1Kayn3rgdtNTg3qsEXS8JGKFqGVIr6w&s", 
    count: "980 Providers" 
  },
  { 
    name: "Brand Development Management ", 
    image: "https://cdn.thebrandingjournal.com/wp-content/uploads/2024/02/Branding-Process-The-Branding-Journal-1024x704.png", 
    count: "2,200 Vendors" 
  },
  { 
    name: "Marketing Management", 
    image: "https://media.geeksforgeeks.org/wp-content/uploads/20240222165724/marketing-management-copy.webp", 
    count: "620 Experts" 
  },
  { 
    name: "Construction Audit", 
    image: "https://prosoftnet.com/cdn/shop/articles/6-ways-land-surveying-shapes-infrastructure-planning.jpg?v=1705445625", 
    count: "620 Experts" 
  },
];
const valueItems = [
  {
    icon: <Building2 className="w-6 h-6" />,
    emoji: "📋",
    title: "book free Consultation",
    desc: "👁️ No hidden Costs, 🧮 easy EMI",
    color:
      "from-blue-500/10 to-transparent border-blue-500/20 shadow-blue-500/5",
    glow: "bg-blue-400",
  },
  {
    icon: <HardHat className="w-6 h-6" />,
   emoji: "🏬",
    title: "List Your Company",
    desc: "Reach thousands of project owners & procurement teams across India",
    color: "from-amber-500/10 to-transparent border-cta/20 shadow-cta/5",
    glow: "bg-cta",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    emoji: "👷",
    title: "End to End Construction Solutions",
    desc: "Paints / Waterproofing, Consultants,Cement / Concrete, Safety/Security & Fire Protection",
    color:
      "from-emerald-500/10 to-transparent border-emerald-500/20 shadow-emerald-500/5",
    glow: "bg-emerald-400",
  },
];

export function ValueStrip() {
  return (
   <div className="bg-slate-100">
      <section className="container mx-auto px-4 -mt-12 relative z-30">
      <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
        {valueItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            viewport={{ once: true }}
            className={`group relative bg-white/90 backdrop-blur-xl rounded-2xl p-5 flex gap-4 items-start 
            shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] border ${item.color} 
            hover:border-primary hover:shadow-[0_20px_40px_-10px_rgba(22,38,70,0.15)] 
            hover:-translate-y-1.5 transition-all duration-400 overflow-hidden bg-linear-to-br`}
          >
            {/* Glow */}
            <div
              className={`absolute -right-8 -top-8 w-24 h-24 ${item.glow} rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            ></div>

            {/* Icon */}
            <div
              className="relative z-10 h-12 w-12 rounded-xl bg-primary text-cta flex items-center justify-center text-2xl shrink-0 
            shadow-md group-hover:scale-105 group-hover:rotate-[8deg] transition-transform duration-400"
            >
              {item.emoji}
            </div>

            {/* Content */}
            <div className="relative z-10 mt-0.5">
              <h3 className="font-extrabold text-primary text-sm md:text-base leading-tight group-hover:text-accent transition-colors">
                {item.title}
              </h3>

              <p className="text-xs border-t border-slate-100 pt-2 mt-2 text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>

              <div
                className="mt-3 flex items-center gap-1 text-[9px] font-black text-cta uppercase tracking-widest 
              opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 duration-400"
              >
                Learn{" "}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
    <div className="bg-[#f1f5f9] ">
      <div className="container mx-auto px-4 py-16">

        {/* HEADER */}
         <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
              Service Category
            </span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Connect with verified professionals and specialized agencies.
          </p>
        </div>

         
      </div>

        {/* GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {visibleCats.map((c, index) => (
    <motion.a
      key={index}
      href="#"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="
        group relative flex flex-col bg-white
        rounded-2xl overflow-hidden
        border border-slate-200
        hover:border-blue-300
        shadow-sm hover:shadow-xl
        transition-all duration-300
      "
    >

      {/* IMAGE */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={c.image}
          alt={c.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        {/* Floating Count Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow text-[10px] font-bold text-slate-700">
          {c.count}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">

        {/* TITLE */}
        <h3 className="text-sm font-semibold text-[#162646] leading-snug group-hover:text-blue-600 transition line-clamp-1">
          {c.name}
        </h3>

        {/* SUB INFO */}
        {/* <div className="flex items-center justify-between">

          
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-white overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/100?img=${i + index}`}
                  alt=""
                />
              </div>
            ))}
          </div>

       
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-blue-600 transition">
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
          </div>
        </div> */}
      </div>

      {/* Bottom Accent Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

    </motion.a>
  ))}
</div>
      </div>
    </div>
  );
}