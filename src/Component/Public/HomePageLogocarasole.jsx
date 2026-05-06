import { motion } from "framer-motion";

export default function HomePageLogocarasole() {
  const logos = [
    { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Apple", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
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
            className="flex items-center gap-6 md:gap-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "linear",
            }}
          >
            {duplicatedLogos.map((logo, i) => (
              <div
                key={i}
                className="
                  min-w-[110px] sm:min-w-[140px] md:min-w-[160px]
                  flex items-center justify-center
                  bg-white rounded-lg md:rounded-xl
                  shadow px-3 py-2 md:px-6 md:py-4
                "
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-6 sm:h-8 md:h-10 object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/120x40?text=Logo";
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