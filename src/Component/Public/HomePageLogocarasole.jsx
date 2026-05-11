import { motion } from "framer-motion";

export default function HomePageLogocarasole() {
  const logos = [
    { name: "L&T CONSTRUCTION LTD", url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/Larsen%26Toubro_logo.svg/1280px-Larsen%26Toubro_logo.svg.png" },
    { name: "ITD CEMENTATION INDIA LIMITED ", url: "https://www.bicindia.com/wp-content/uploads/2023/12/leading-cast-iron-supplier-in-india.webp" },
    { name: "GODREJ & BOYCE LIMITED ", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU2gu89Z9q2ISdcZF-8mteLd3RMt2wIkTRCA&s" },
    { name: " MAHAGUN INDIA GROUP, NOIDA ", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUb6XhsYXcgmgSMQPGe8wtVpnTSQ_qeIAvPFBy8VO_yA&s" },
    { name: "NKG INFRASTRUCTURE LIMITED ", url: "https://nkginfra.com/wp-content/themes/nkginfra/images/blog-placeholder.jpg" },
    { name: "SIMPLEX INFRASTRUCTURES LIMITED ", url: "https://eurogroove.in/wp-content/uploads/2015/05/Simplex-Infrastructures-Ltd.png" },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-16 md:py-24 bg-[#e6f0fa] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-[#28354D]">
            Associate  <span className="text-blue-600">Partners</span>
          </h2>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">

          <motion.div
            className="flex items-center gap-8 md:gap-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {duplicatedLogos.map((logo, i) => (
              <div
                key={i}
                className="
        min-w-[140px] sm:min-w-[180px] md:min-w-[220px]
        flex items-center justify-center
        bg-white rounded-xl md:rounded-2xl
        shadow-md hover:shadow-lg transition
        px-3 py-2 md:px-4 md:py-3    
      "
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="
          h-12 sm:h-14 md:h-16      
          w-auto object-contain
          scale-110               
        "
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x60?text=Logo";
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}