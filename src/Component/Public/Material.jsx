import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Star } from "lucide-react";

const materials = [
  {
    name: "Ultra Tech PPC Cement",
    price: "390",
    old: "430",
    unit: "per bag",
    off: "9% OFF",
    rating: 4.8,
    image:
      "https://www.ultratechcement.com/content/ultratechcement/in/en/home/for-homebuilders/products/overview/ppc/_jcr_content/root/container/container/container_copy_copy/teaser.coreimg.png/1707274353185/cement-card.png",
  },
  {
    name: "Premium TMT Steel Bar (Fe 500)",
    price: "56,500",
    old: "60,000",
    unit: "per MT",
    off: "6% OFF",
    rating: 4.9,
    image:
      "https://images.jdmagicbox.com/quickquotes/images_main/premium-steel-tmt-bar-2217445185-gelp84lt.jpg",
  },
  {
    name: "Kota Stone Premium",
    price: "38",
    old: "52",
    unit: "per sq.ft",
    off: "27% OFF",
    rating: 4.4,
    image:
      "https://images.jdmagicbox.com/quickquotes/images_main/colour-kota-stone-flooring-thickness-0-to-5mm-2220616805-c0o0vdk8.jpg",
  },
  {
    name: "Heavy CPVC Pipes (Set)",
    price: "2,450",
    old: "2,900",
    unit: "per set",
    off: "15% OFF",
    rating: 4.6,
    image:
      "https://oriplast.com/wp-content/uploads/2026/02/Oriplast-Blog-Thumbnail-16.jpg",
  },
  {
    name: "Dr. Fixit Waterproof Coat (20L)",
    price: "1,350",
    old: "1,650",
    unit: "per bucket",
    off: "18% OFF",
    rating: 4.7,
    image:
      "https://m.media-amazon.com/images/I/51u6CbmoDvL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    name: "Ready Mix Concrete M25",
    price: "5,600",
    old: "6,100",
    unit: "per m³",
    off: "8% OFF",
    rating: 4.5,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/11/PD/BV/KY/37402774/rmc-ready-mix-concrete-500x500.jpg",
  },
  {
    name: "AAC Blocks (Fly Ash)",
    price: "3,800",
    old: "4,300",
    unit: "per 1000 blocks",
    off: "12% OFF",
    rating: 4.3,
    image: "https://ecolite.in/assets/img/ecolite-block-home.jpg",
  },
  {
    name: "Ceramic Floor Tiles",
    price: "42",
    old: "55",
    unit: "per sq.ft",
    off: "23% OFF",
    rating: 4.6,
    image:
      "https://assets-news.housing.com/news/wp-content/uploads/2023/03/24140837/Ceramic-tiles-Properties-types-advantages-disadvantages-and-uses-f-686x400.jpg",
  },
];

export function Materials() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-14">
    <div className="container mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
             Procurement  {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
               services
              </span>
            </h2>
            {/* <p className="text-slate-500 mt-2 font-medium">
              Work with the top-rated contractors and consultants in the region.
            </p> */}
          </div>

       
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {materials.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:-translate-y-1"
            >

              {/* IMAGE */}
              <div className="relative h-40 sm:h-44 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Discount */}
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                  {m.off}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-3">

                {/* Rating + Verified */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1 text-yellow-600 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {m.rating}
                  </div>

                  <div className="flex items-center gap-1 text-[9px] text-green-600 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">
                  {m.name}
                </h3>

                {/* PRICE */}
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#162646]">
                      ₹{m.price}
                    </span>
                    <span className="text-[10px] line-through text-gray-300">
                      ₹{m.old}
                    </span>
                  </div>

                  <p className="text-[9px] text-gray-400 uppercase mt-1">
                    {m.unit}
                  </p>
                </div>

                {/* BUTTON */}
                <button className="w-full mt-3 bg-[#162646] text-white py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-blue-600 transition">
                  <Zap className="w-3 h-3" />
                  Get Price
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}