import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Search, MapPin, Star, BadgeCheck, Bookmark, BookmarkCheck, SlidersHorizontal, X, Sparkles, ChevronDown } from "lucide-react";

const vendors = [
  { id:1, name:"Sharma Builders Pvt Ltd", type:"Builder", location:"Delhi", rating:4.8, reviews:312, services:["Residential","Commercial","Renovation"], verified:true, featured:true, img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80", accent:"linear-gradient(90deg,#6366f1,#8b5cf6)" },
  { id:2, name:"Gupta Contractors", type:"Contractor", location:"Mumbai", rating:4.6, reviews:198, services:["Civil Work","Electrical","Plumbing"], verified:true, featured:false, img:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", accent:"linear-gradient(90deg,#0ea5e9,#6366f1)" },
  { id:3, name:"Patel Interiors", type:"Interior", location:"Pune", rating:4.9, reviews:427, services:["Modular Kitchen","False Ceiling","Flooring"], verified:true, featured:true, img:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80", accent:"linear-gradient(90deg,#ec4899,#8b5cf6)" },
  { id:4, name:"Mehta Manufacturing Co.", type:"Manufacturer", location:"Bangalore", rating:4.5, reviews:89, services:["Steel Fabrication","Custom Parts","Bulk Orders"], verified:false, featured:false, img:"https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80", accent:"linear-gradient(90deg,#f59e0b,#ef4444)" },
  { id:5, name:"Verma Consulting Group", type:"Consultant", location:"Chennai", rating:4.7, reviews:156, services:["Strategy","Finance","Legal"], verified:true, featured:true, img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", accent:"linear-gradient(90deg,#10b981,#0ea5e9)" },
  { id:6, name:"Rajput Construction", type:"Contractor", location:"Hyderabad", rating:4.3, reviews:74, services:["Foundation","Masonry","Waterproofing"], verified:false, featured:false, img:"https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80", accent:"linear-gradient(90deg,#14b8a6,#6366f1)" },
  { id:7, name:"Singh Architects", type:"Builder", location:"Delhi", rating:4.8, reviews:203, services:["Architecture","3D Design","Project Mgmt"], verified:true, featured:false, img:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80", accent:"linear-gradient(90deg,#8b5cf6,#ec4899)" },
  { id:8, name:"Kapoor Interior Studio", type:"Interior", location:"Mumbai", rating:4.6, reviews:318, services:["Luxury Interiors","Office Design","Lighting"], verified:true, featured:false, img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", accent:"linear-gradient(90deg,#f59e0b,#10b981)" },
  { id:9, name:"Agarwal Steel Works", type:"Manufacturer", location:"Pune", rating:4.4, reviews:61, services:["TMT Bars","Structural Steel","Pipes"], verified:false, featured:false, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", accent:"linear-gradient(90deg,#ef4444,#f59e0b)" },
  { id:10, name:"Joshi Legal Associates", type:"Consultant", location:"Bangalore", rating:4.9, reviews:512, services:["Contract Law","Property","Compliance"], verified:true, featured:false, img:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80", accent:"linear-gradient(90deg,#6366f1,#0ea5e9)" },
  { id:11, name:"Tata Build Solutions", type:"Builder", location:"Chennai", rating:4.7, reviews:289, services:["High-Rise","Township","Infrastructure"], verified:true, featured:false, img:"https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=400&q=80", accent:"linear-gradient(90deg,#0ea5e9,#10b981)" },
  { id:12, name:"Reddy Contractors", type:"Contractor", location:"Hyderabad", rating:4.2, reviews:43, services:["Road Work","Drainage","Landscaping"], verified:false, featured:false, img:"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", accent:"linear-gradient(90deg,#8b5cf6,#14b8a6)" },
];

const categories = ["All","Contractor","Builder","Interior","Manufacturer","Consultant"];
const locations = ["All States","Delhi","Mumbai","Pune","Bangalore","Chennai","Hyderabad"];

function VendorCard({ vendor, saved, onSave, compared, onCompare }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }} whileHover={{ y:-8 }} transition={{ duration:0.3 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(16px)", border:compared?"2px solid #6366f1":"1px solid rgba(255,255,255,0.9)", borderRadius:"18px", overflow:"hidden", boxShadow:hovered?"0 20px 60px rgba(0,0,0,0.15)":"0 4px 20px rgba(0,0,0,0.07)", transition:"box-shadow 0.3s" }}>
      <div className="relative h-40 overflow-hidden">
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background:vendor.accent, zIndex:2 }} />
        <img src={vendor.img} alt={vendor.name} className="w-full h-full object-cover" style={{ transition:"transform 0.4s", transform:hovered?"scale(1.08)":"scale(1)" }} />
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="absolute inset-0 flex items-center justify-center" style={{ background:"rgba(15,23,42,0.55)", backdropFilter:"blur(2px)" }}>
              <button onClick={() => toast.info(`Viewing ${vendor.name} profile`)} style={{ background:"rgba(255,255,255,0.95)", color:"#1e293b", border:"none", borderRadius:"10px", padding:"8px 20px", fontWeight:700, fontSize:"13px", cursor:"pointer" }}>View Profile</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {vendor.featured && <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", borderRadius:"999px", padding:"2px 8px", fontSize:"10px", fontWeight:700, display:"flex", alignItems:"center", gap:"3px" }}><Sparkles style={{ width:10, height:10 }} /> AI Pick</span>}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button onClick={() => onSave(vendor.id)} style={{ background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"8px", padding:"5px", cursor:"pointer", display:"flex" }}>
            {saved ? <BookmarkCheck style={{ width:14, height:14, color:"#6366f1" }} /> : <Bookmark style={{ width:14, height:14, color:"#64748b" }} />}
          </button>
        </div>
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-800 text-sm leading-tight">{vendor.name}</h3>
              {vendor.verified && <BadgeCheck style={{ width:14, height:14, color:"#6366f1", flexShrink:0 }} />}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{ background:"rgba(99,102,241,0.1)", color:"#6366f1", borderRadius:"6px", padding:"1px 7px", fontSize:"10px", fontWeight:600 }}>{vendor.type}</span>
              <span className="flex items-center gap-0.5 text-xs text-slate-400"><MapPin style={{ width:10, height:10 }} />{vendor.location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-0.5"><Star style={{ width:12, height:12, fill:"#f59e0b", color:"#f59e0b" }} /><span className="text-sm font-bold text-slate-800">{vendor.rating}</span></div>
            <span className="text-xs text-slate-400">({vendor.reviews})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 my-2">
          {vendor.services.map(s => <span key={s} style={{ background:"#f1f5f9", color:"#475569", borderRadius:"6px", padding:"2px 7px", fontSize:"10px" }}>{s}</span>)}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => toast.success(`Inquiry sent to ${vendor.name}`)} style={{ flex:1, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:"9px", padding:"7px 0", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>Instant Inquiry</button>
          <label style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", color:"#64748b", cursor:"pointer", padding:"0 6px" }}>
            <input type="checkbox" checked={compared} onChange={() => onCompare(vendor.id)} style={{ accentColor:"#6366f1" }} />Compare
          </label>
        </div>
      </div>
    </motion.div>
  );
}

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All States");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [saved, setSaved] = useState([]);
  const [compared, setCompared] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSave = (id) => setSaved(prev => prev.includes(id) ? prev.filter(x => x!==id) : [...prev, id]);
  const toggleCompare = (id) => setCompared(prev => {
    if (prev.includes(id)) return prev.filter(x => x!==id);
    if (prev.length >= 3) { toast.warning("Max 3 vendors for comparison"); return prev; }
    return [...prev, id];
  });

  const filtered = vendors.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.services.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (category!=="All" && v.type!==category) return false;
    if (location!=="All States" && v.location!==location) return false;
    if (v.rating < minRating) return false;
    if (verifiedOnly && !v.verified) return false;
    return true;
  });

  const comparedVendors = vendors.filter(v => compared.includes(v.id));

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f8faff 0%,#f1f5f9 100%)" }}>
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e293b)", padding:"12px 0" }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          {[["50K+","Total Vendors"],["12K+","Verified"],["9","Categories"],["28+","States"]].map(([val,label]) => (
            <div key={label} className="flex items-center gap-2 text-white">
              <span className="font-bold text-lg" style={{ background:"linear-gradient(90deg,#6366f1,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{val}</span>
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#312e81 100%)", padding:"48px 16px 40px" }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <h1 className="text-4xl font-black text-white mb-2">ContractsIndia™ <span style={{ background:"linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Marketplace</span></h1>
            <p className="text-slate-400 mb-8 text-sm">Discover verified contractors, builders, manufacturers and consultants across India</p>
          </motion.div>
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors, services..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff" }} />
            </div>
            <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value)} className="appearance-none pl-3 pr-8 py-3 rounded-xl text-sm outline-none" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", cursor:"pointer" }}>
                {categories.map(c => <option key={c} style={{ background:"#1e293b" }}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        <motion.aside animate={{ width:sidebarOpen?220:0, opacity:sidebarOpen?1:0 }} transition={{ duration:0.25 }} className="flex-shrink-0 overflow-hidden">
          <div style={{ width:220, background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.9)", borderRadius:"16px", padding:"20px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><SlidersHorizontal className="w-4 h-4" />Filters</h3>
              <button onClick={() => { setCategory("All"); setLocation("All States"); setMinRating(0); setVerifiedOnly(false); }} className="text-xs text-indigo-500 hover:text-indigo-700">Reset</button>
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Category</p>
              <div className="space-y-1">
                {categories.map(c => (
                  <button key={c} onClick={() => setCategory(c)} className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{ background:category===c?"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))":"transparent", color:category===c?"#6366f1":"#64748b", fontWeight:category===c?600:400 }}>{c}</button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Location</p>
              <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400">
                {locations.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Min Rating</p>
              <div className="space-y-1">
                {[{label:"All",val:0},{label:"3 star+",val:3},{label:"4 star+",val:4}].map(r => (
                  <button key={r.label} onClick={() => setMinRating(r.val)} className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{ background:minRating===r.val?"rgba(99,102,241,0.12)":"transparent", color:minRating===r.val?"#6366f1":"#64748b", fontWeight:minRating===r.val?600:400 }}>{r.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Verified Only</span>
              <button onClick={() => setVerifiedOnly(!verifiedOnly)} style={{ width:40, height:22, borderRadius:"999px", background:verifiedOnly?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#e2e8f0", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
                <motion.div animate={{ x:verifiedOnly?18:2 }} transition={{ duration:0.2 }} style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
          </div>
        </motion.aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:"rgba(255,255,255,0.8)", border:"1px solid rgba(255,255,255,0.9)", borderRadius:"10px", padding:"7px 12px", fontSize:"12px", cursor:"pointer", color:"#64748b", display:"flex", alignItems:"center", gap:"5px" }}>
                <SlidersHorizontal style={{ width:13, height:13 }} />{sidebarOpen?"Hide":"Show"} Filters
              </button>
              <span className="text-sm text-slate-500">{filtered.length} vendors found</span>
            </div>
          </div>
          {category==="All" && !search && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-indigo-500" /><h2 className="font-bold text-slate-800">AI Recommended</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.filter(v => v.featured).map(v => <VendorCard key={v.id} vendor={v} saved={saved.includes(v.id)} onSave={toggleSave} compared={compared.includes(v.id)} onCompare={toggleCompare} />)}
              </div>
              <div className="border-t border-slate-200 my-8" />
            </div>
          )}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>{filtered.map(v => <VendorCard key={v.id} vendor={v} saved={saved.includes(v.id)} onSave={toggleSave} compared={compared.includes(v.id)} onCompare={toggleCompare} />)}</AnimatePresence>
          </motion.div>
          {filtered.length===0 && (
            <div className="text-center py-20 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No vendors match your filters</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {compared.length >= 2 && (
          <motion.div initial={{ y:100, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:100, opacity:0 }}
            style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(15,23,42,0.95)", backdropFilter:"blur(16px)", borderTop:"1px solid rgba(99,102,241,0.3)", padding:"16px 24px" }}>
            <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
              <span className="text-white font-semibold text-sm">Comparing:</span>
              <div className="flex gap-3 flex-1 flex-wrap">
                {comparedVendors.map(v => (
                  <div key={v.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.3)" }}>
                    <span className="text-white text-sm font-medium">{v.name}</span>
                    <span className="text-indigo-300 text-xs">{v.rating} star</span>
                    <button onClick={() => toggleCompare(v.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.5)", padding:0, display:"flex" }}><X style={{ width:12, height:12 }} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.info("Comparison view coming soon")} style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:"10px", padding:"8px 20px", fontWeight:600, fontSize:"13px", cursor:"pointer" }}>Compare Now</button>
              <button onClick={() => setCompared([])} style={{ background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"10px", padding:"8px 16px", fontSize:"13px", cursor:"pointer" }}>Clear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
