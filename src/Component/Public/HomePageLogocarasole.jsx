import { motion } from "framer-motion";

const logos = [
  { name: "L&T Construction Ltd",          url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/Larsen%26Toubro_logo.svg/1280px-Larsen%26Toubro_logo.svg.png" },
  { name: "ITD Cementation India Limited",  url: "https://www.bicindia.com/wp-content/uploads/2023/12/leading-cast-iron-supplier-in-india.webp" },
  { name: "Godrej & Boyce Limited",         url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU2gu89Z9q2ISdcZF-8mteLd3RMt2wIkTRCA&s" },
  { name: "Mahagun India Group, Noida",     url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUb6XhsYXcgmgSMQPGe8wtVpnTSQ_qeIAvPFBy8VO_yA&s" },
  { name: "NKG Infrastructure Limited",     url: "https://nkginfra.com/wp-content/themes/nkginfra/images/blog-placeholder.jpg" },
  { name: "Simplex Infrastructures Limited",url: "https://eurogroove.in/wp-content/uploads/2015/05/Simplex-Infrastructures-Ltd.png" },
];

const duplicatedLogos = [...logos, ...logos];

export default function HomePageLogocarasole() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-[#e8eef8]">

      {/* Subtle top/bottom fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#e8eef8] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#e8eef8] to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
            ✦ Trusted By
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#162646]">
            Associate{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Partners
            </span>
          </h2>
        </motion.div>

        {/* Infinite scroll track */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex items-center gap-6 md:gap-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          >
            {duplicatedLogos.map((logo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, y: -3 }}
                transition={{ duration: 0.2 }}
                className="min-w-[150px] sm:min-w-[190px] md:min-w-[230px] flex items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200/80 hover:border-indigo-200 px-5 py-4 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-400"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150x60?text=Logo"; }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
