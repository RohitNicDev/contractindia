import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, HardHat, Zap, ShieldCheck, Building2 } from "lucide-react";

const projects = [
  {
    title: "Metro Station Construction",
    category: "Infrastructure",
    icon: <Building2 size={20} />,
    image: "https://themetrorailguy.com/wp-content/uploads/2015/07/N3.jpg",
    desc: `Executed large-scale metro station construction with advanced engineering techniques. Managed timelines efficiently with zero compromise on quality.`,
  },
  {
    title: "Commercial Building Project",
    category: "Construction",
    icon: <HardHat size={20} />,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_gKn2T1IDqhIfY-NKy3ZZNrA6YrFWEQgXXA&s",
    desc: `Developed high-rise commercial infrastructure with modern architecture and energy-efficient systems.`,
  },
  {
    title: "Housing Board Project",
     category: "Construction",
    icon: <Zap size={20} />,
    image: "https://oshb.org/wp-content/uploads/2021/11/Multi-Storied-Apartment-Complex.jpg",
    desc: `Installed advanced electrical and HVAC systems for large facilities, following strict compliance.`,
  },
  {
    title: "Interior Design Project",
 category: "Construction",
    icon: <ShieldCheck size={20} />,
    image: "https://www.civilly.eu/content/Chto-takoe-dizajn-proekt-Lazurnyj-Bereg/dizajn-proekt-interjera-na-lazurnom-beregu.jpg",
    desc: `Designed and implemented fire safety systems across buildings including detection and suppression.`,
  },
];

const categories = ["All", "Infrastructure", "Construction", "MEP Services", "Safety"];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);
      
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans">
      
      {/* 🏙️ HERO SECTION */}
       <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://thumbs.dreamstime.com/b/wide-high-detailed-banner-illustration-silhouette-buildings-under-construction-process-wide-high-detailed-banner-100333894.jpg"
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#162646]/95 via-[#162646]/80 to-[#162646]/40"></div>
            </div>
    
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="relative z-10 text-center px-4"
            >
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                Our <span className="text-[#fbb820]">Projects</span>
              </h1>
              {/* <p className="text-slate-300 mt-3 text-sm md:text-base">
                Building Infrastructure That Powers India
              </p> */}
            </motion.div>
          </section>  

      {/* ⚡ FILTER CONTROLS */}
      <section className="container mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-wrap justify-center gap-2 border border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeFilter === cat 
                  ? "bg-[#162646] text-white shadow-lg shadow-blue-900/20" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 🏗️ PROJECT GRID */}
      <section className="py-20 container mx-auto px-6">
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* IMAGE PART */}
                  <div className="md:w-1/2 h-72 md:h-auto overflow-hidden relative">
                    <img
                      src={project.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      alt={project.title}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl text-[#162646] shadow-lg">
                      {project.icon}
                    </div>
                  </div>

                  {/* CONTENT PART */}
                  <div className="md:w-1/2 p-8 flex flex-col justify-between bg-white">
                    <div>
                      <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-black text-[#162646] mt-4 leading-tight group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 mt-4 text-sm leading-relaxed line-clamp-4">
                        {project.desc}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Status: Completed</span>
                      <button className="flex items-center gap-2 text-[#162646] font-bold text-sm group/btn">
                        View Details 
                        <div className="bg-slate-100 p-2 rounded-full group-hover/btn:bg-[#162646] group-hover/btn:text-white transition-all">
                          <ArrowUpRight size={16} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 📞 CALL TO ACTION */}
      <section className="pb-20 container mx-auto px-6">
        <div className="bg-[#162646] rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Have a project in mind?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Let's build something exceptional together. Our team is ready to deliver.</p>
            <button className="bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25">
              Get A Quote
            </button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default Projects;