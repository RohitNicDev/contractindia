import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, CheckCircle2, Award } from "lucide-react";
import Founder from "../../assets/IMG/gupta.jpeg";

const AboutUs = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const team = [
    {
      name: "Vikash Gupta",
      role: "Finance Head ",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&s",
    },

    {
      name: "Pankaj Gupta",
      role: "Project Engineer",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&s",
    },
    {
      name: "Prasann Tamrkar",
      role: "Digital Head",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&s",
    },
    {
      name: "S. P. Singh",
      role: "Chartered Accountant",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&s",
    },
  ];
  const specs = [
    "Civil",
    "MEP",
    "Turnkey",
    "Architecture",
    "Infrastructure",
    "Government Projects",
    "Private Contracts",
  ];
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 overflow-x-hidden">
      {/* <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://thumbs.dreamstime.com/b/wide-high-detailed-banner-illustration-silhouette-buildings-under-construction-process-wide-high-detailed-banner-100333894.jpg"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#162646]/95 via-[#162646]/80 to-[#162646]/40"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            About <span className="text-[#fbb820]">Us</span>
          </h1>
       
        </motion.div>
      </section> */}

      {/* 🏢 STORY */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        {/* <div className="mb-5">
         

          <h2 className="text-4xl md:text-5xl font-black text-[#28354D] leading-tight mt-2 ">
            ContractsIndia
          </h2>

          <div className="w-16 h-1 bg-[#28354D] mt-3 rounded-full "></div>
        </div> */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative w-full"
          >
            {/* Background Blur */}
            <div className="absolute -top-6 -left-6 w-40 sm:w-56 h-40 sm:h-56 bg-[#28354D]/5 rounded-full blur-2xl"></div>

            <div className="relative group h-full">
              {/* IMAGE BOX */}
              <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] shadow-xl border-4 border-white h-full">
                <img
                  src="https://www.autodesk.com/blogs/construction/wp-content/uploads/2024/04/construction-phase-what-is-it.jpg"
                  className="w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[500px] object-cover transition duration-700 group-hover:scale-105"
                  alt="ContractsIndia"
                />
              </div>

              {/* EXPERIENCE BADGE */}
              <div className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg border border-slate-100">
                <p className="text-2xl sm:text-3xl font-black text-[#28354D] leading-none">
                  15+
                </p>

                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Years Experience
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5 lg:space-y-6"
          >
            {/* TITLE */}
            <div>
              {/* <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
        About Platform
      </span> */}

              <h4 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#28354D] leading-tight mt-2">
                ContractsIndia
              </h4>

              <div className="w-15 h-1 bg-[#28354D] rounded-full"></div>
            </div>

            {/* CONTENT */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-[15px] leading-relaxed">
              <p className="font-medium text-[#28354D]/90 border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-3 rounded-r-xl shadow-sm">
                ContractsIndia provides platform to contractors, architects,
                consultants and employers where they can collaborate for
                tenders, infrastructure projects and construction opportunities
                across India.
              </p>

              <p>
                Organisations can publish tenders and project work while
                contractors and consultants can explore opportunities and
                participate in bidding through our integrated digital platform.
              </p>

              <p>
                ContractsIndia maintains one of the largest online databases of
                tenders floated by Government Agencies, Departments, PSUs and
                Private Sector Undertakings.
              </p>

              <p>
                The platform bridges the gap between employers and professionals
                across sectors like{" "}
                <b>
                  Civil, Turnkey, MEP, Architecture and Infrastructure Contracts
                </b>
                .
              </p>

              <p>
                Employers can discover the best professionals from multiple
                options, while contractors gain access to verified opportunities
                matching their expertise.
              </p>
            </div>

            {/* SPECIALISATIONS */}
          </motion.div>
        </div><div className="mt-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-2">
            Our Expertise
          </p>

          <h3 className="text-2xl sm:text-3xl font-black text-[#28354D]">
            Our Specialisations
          </h3>
        </div>

        <div className="hidden sm:block w-24 h-1 bg-gradient-to-r from-blue-500 to-[#28354D] rounded-full"></div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-3">
  {specs.map((item, i) => (
    <motion.div
      key={i}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Hover Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#28354D] opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl"></div>

      {/* Content */}
      <div
        className="
          relative px-5 py-3 
          bg-white border border-slate-200 
          rounded-2xl shadow-sm 
          group-hover:border-transparent 
          transition-all duration-300
          select-none
        "
      >
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:text-white transition-colors">
          <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-white"></span>
          {item}
        </span>
      </div>
    </motion.div>
  ))}
</div>
    </div>
      </section>
      
      

      {/* 🎯 CORE VALUES (Glass effect) */}

      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#162646] to-[#1e293b]">
        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <ValueCard
              icon={<Target size={26} />}
              title="Objective"
              desc="The primary objective of ContractsIndia is to connect contractors, architects, consultants, and employers on a single platform for tenders and projects. It provides verified information and profiles to help organizations choose the best professionals and enable efficient bidding opportunities."
            />

            <ValueCard
              icon={<Award size={26} />}
              title="Mission"
              desc="To create availability of the best services and solutions with the most competitive cost for individuals and institutions in infrastructure-related works while maintaining quality, transparency, and multiple professional alternatives."
            />

            <ValueCard
              icon={<Eye size={26} />}
              title="Vision"
              desc="Every client and user should be able to access the best solutions and professional services economically and effectively with complete transparency, skilled expertise, and timely delivery."
            />
          </div>
        </div>
      </section>

      {/* 👥 TEAM & LEADERSHIP */}
      <section className="py-12 md:py-16  bg-linear-to-b from-slate-50 to-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 md:p-10 shadow-lg border border-slate-100">
            {/* TOP SECTION */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* LEFT - Founder */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* IMAGE */}
                <div className="relative w-32 sm:w-40 md:w-44 h-40 sm:h-52 md:h-60 shrink-0">
                  <div className="absolute inset-0 bg-[#162646] rounded-2xl rotate-3"></div>

                  <div className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                    <img
                      src={Founder}
                      className="w-full h-full object-cover"
                      alt="Founder"
                    />
                  </div>
                </div>

                {/* TEXT */}
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#162646]">
                    Prakash Gupta
                  </h2>

                  <p className="text-blue-600 text-[10px] sm:text-xs uppercase tracking-widest mt-1">
                    Founder & Visionary
                  </p>

                  <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xs">
                    Building modern infrastructure with integrity and
                    innovation.
                  </p>
                </div>
              </div>

              {/* RIGHT - STATS */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-slate-50 rounded-xl text-center shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#162646]">
                    50+
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase">
                    Projects Delivered
                  </p>
                </div>

                <div className="p-4 sm:p-6 bg-slate-50 rounded-xl text-center shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#162646]">
                    200+
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase">
                    Skilled Workers
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 md:my-12 border-t border-slate-200"></div>

            {/* TEAM SECTION */}
            <div>
              <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-10 gap-3 md:gap-4">
                <div>
                  <span className="text-blue-600 text-[10px] sm:text-xs uppercase font-bold tracking-widest">
                    Our Team
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#28354D] mt-1">
                    Core Organization
                  </h2>
                </div>

                {/* <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
                  A team of experts delivering quality and innovation.
                </p> */}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 place-items-center">
                {team.map((member, i) => (
                  <div
                    key={i}
                    className="text-center group flex flex-col items-center justify-center"
                  >
                    {/* IMAGE */}
                    <div className="w-full max-w-[100px] sm:max-w-[150px] overflow-hidden rounded-xl shadow mb-2 mx-auto">
                      <img
                        src={member.img}
                        className="w-full h-32 sm:h-40 md:h-44 object-cover object-top group-hover:scale-105 transition duration-300"
                        alt={member.name}
                      />
                    </div>

                    {/* DETAILS */}
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight text-center">
                      {member.name}
                    </h4>

                    <p className="text-[9px] sm:text-[10px] text-blue-500 uppercase tracking-wide mt-0.5 text-center">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -8 }}
    transition={{ duration: 0.3 }}
    className="
      relative overflow-hidden group
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-[28px]
      p-6 sm:p-8
      shadow-xl
      hover:border-blue-400/30
      hover:bg-white/10
      transition-all duration-500
    "
  >
    {/* Glow Effect */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

    {/* Icon */}
    <div
      className="
        relative z-10
        w-14 h-14
        rounded-2xl
        bg-gradient-to-br from-blue-500 to-cyan-400
        flex items-center justify-center
        text-white
        shadow-lg shadow-blue-500/20
        mb-5
        group-hover:scale-110 group-hover:rotate-3
        transition-all duration-500
      "
    >
      {icon}
    </div>

    {/* Title */}
    <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-white mb-3">
      {title}
    </h3>

    {/* Description */}
    <p className="relative z-10 text-slate-300 text-sm leading-relaxed text-justify">
      {desc}
    </p>

    {/* Bottom Border Glow */}
    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
  </motion.div>
);

const Stat = ({ number, label }) => (
  <div>
    <h3 className="text-xl font-bold text-[#162646]">{number}</h3>
    <p className="text-xs text-slate-400 uppercase">{label}</p>
  </div>
);

export default AboutUs;
