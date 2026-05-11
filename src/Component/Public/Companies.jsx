import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, CheckCircle, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

// Data remains the same, but you can replace emojis with Lucide components if needed
const companies = [
  { 
    name: "Shapoorji Pallonji & Co.", 
    type: "EPC Contractor", 
    rating: 4.8, 
    reviews: 312, 
    tags: ["EPC", "Infrastructure"], 
    loc: "Mumbai, MH", 
    verified: true, 
    color: "blue",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
  },
  { 
    name: "Design Arc Architects", 
    type: "Architecture Firm", 
    rating: 4.7, 
    reviews: 189, 
    tags: ["Sustainable", "Commercial"], 
    loc: "Pune, MH", 
    verified: true, 
    color: "indigo",
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  },
  { 
    name: "UrbanSpace Interiors", 
    type: "Interior Design", 
    rating: 4.9, 
    reviews: 428, 
    tags: ["Luxury", "Hospitality"], 
    loc: "Delhi NCR", 
    verified: true, 
    color: "purple",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  },
  { 
    name: "Volt & Wire Electrical", 
    type: "Electrical Contractor", 
    rating: 4.7, 
    reviews: 156, 
    tags: ["Solar", "Fire Alarm"], 
    loc: "Nagpur, MH", 
    verified: true, 
    color: "amber",
    img: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b",
  },
];

export function Companies() {
  return (
<section className="relative py-20 overflow-hidden bg-[#f1f5f9] shadow-inner">
      
      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Verified{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                Industry Leaders
              </span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Work with the top-rated contractors and consultants in the region.
            </p>
          </div>

       
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((c, idx) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
            >
              
              {/* Cover Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all"></div>

                {/* Verified */}
                {c.verified && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-green-600 shadow-sm">
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition">
                  {c.name}
                </h3>

                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {c.type}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-sm font-bold">{c.rating}</span>
                  <span className="text-xs text-slate-400">
                    ({c.reviews})
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-semibold text-slate-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    📍 {c.loc}
                  </span>

                  <button className="text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-blue-600 transition">
                    View
                  </button>
                </div>
              </div>

              {/* Bottom Hover Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-600 group-hover:w-2/3 transition-all duration-500 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}