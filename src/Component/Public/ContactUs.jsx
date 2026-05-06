import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  Building2,
  ExternalLink,
  ArrowRight
} from "lucide-react";

const ContactPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* ⚡ HERO SECTION */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="contact-bg"
            className="w-full h-full object-cover scale-105"
          />
          {/* Overlay with primary brand color gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#162646]/90 to-[#162646]/60"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="relative z-10 text-center px-4"
        >
          {/* <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
            Get in Touch
          </span> */}
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Contact <span className="text-[#fbb820]">Us</span>
          </h1>
          {/* <p className="mt-4 text-lg text-slate-200 max-w-xl mx-auto font-light">
            We are here to assist with your infrastructure and project requirements across India.
          </p> */}
        </motion.div>
      </section>

      {/* 🏢 MAIN CONTENT */}
      <section className="container mx-auto px-6 -mt-16 relative z-20 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: HEAD OFFICE CARD */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-3xl font-black text-[#162646] flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="text-[#162646]" size={28} />
                  </div>
               Contracts India
                </h2>
                {/* <p className="text-slate-400 mt-1 ml-14 font-medium uppercase tracking-wider text-xs">Head Office</p> */}
              </div>
              {/* <div className="flex gap-2">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-md border border-green-100">ISO CERTIFIED</span>
                 <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">GOVT. CONTRACTOR</span>
              </div> */}
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Info Block */}
              <div className="space-y-6">
                <ContactInfoItem 
                  icon={<MapPin />} 
                  label="Our Address"
                  value="35, Veer Savarkar Block, 3rd Floor, Above S. M. Garments, Opp. Metro Pillar No. 57, Shakkarpur, New Delhi - 110092"
                />
                <ContactInfoItem 
                  icon={<User />} 
                  label="Contact Person"
                  value="Mr. Prakash Gupta"
                />
              </div>

              <div className="space-y-6">
                <ContactInfoItem 
                  icon={<Phone />} 
                  label="Phone & Landline"
                  value={["+91 9999418599", "+91 9868318936", "011-43034185"]}
                />
                <ContactInfoItem 
                  icon={<Mail />} 
                  label="Email Addresses"
                  value={["pgcprojects.india@gmail.com", "pgcprojects@contractsindia.in"]}
                />
              </div>
            </div>

            {/* TAX INFO & WEB */}
            {/* <div className="mt-10 pt-8 border-t border-slate-100">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <TaxBadge label="GSTIN (UP)" value="09AEYPG0326F1ZG" />
    <TaxBadge label="GSTIN (Delhi)" value="07AEYPG0326F1ZK" />
    <TaxBadge label="PAN" value="AEYPG0326F" />
  </div>
</div> */}
          </motion.div>

          {/* RIGHT SIDE: BRANCHES */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest px-2">Regional Branches</h4>
            
            <BranchCard 
              city="Ranchi Branch" 
              manager="Mr. Deepak Kumar" 
              address="Indira Garden Apartment, Cheshire Home Road, Bariatu, Ranchi - 834009, Jharkhand"
            />
            
            <BranchCard 
              city="Raipur Branch" 
              manager="Mr. Sunil Kumar" 
              address="3/744, Ramkund Gangaram Nagar, Choubey Colony, Raipur – 492001, Chhattisgarh"
            />

           <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#162646] to-[#0f1b34] text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">


               <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Need Support?</h3>
                <p className="text-blue-100 text-sm mb-4">Our team is available 24/7 for urgent inquiries.</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors">
                  Send Message <ArrowRight size={16} />
                </button>
               </div>
               <Building2 className="absolute -bottom-4 -right-4 text-white/10" size={120} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Reusable Components to keep code clean
const ContactInfoItem = ({ icon, label, value }) => (
  <div className="flex gap-4 group">
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100 group-hover:bg-[#162646] group-hover:text-white transition-all duration-300">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      {Array.isArray(value) ? (
        value.map((item, idx) => <p key={idx} className="text-sm font-semibold text-slate-700">{item}</p>)
      ) : (
        <p className="text-sm font-semibold text-slate-700 leading-snug">{value}</p>
      )}
    </div>
  </div>
);

const TaxBadge = ({ label, value }) => (
  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p>
    <p className="text-xs font-mono font-bold text-[#162646]">{value}</p>
  </div>
);

const BranchCard = ({ city, manager, address }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: 20 },
      show: { opacity: 1, x: 0 }
    }}
    className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group"
  >
    <h3 className="font-bold text-[#162646] flex items-center justify-between group-hover:text-blue-600 transition-colors">
      {city}
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
        <MapPin size={14} className="text-slate-400 group-hover:text-blue-500" />
      </div>
    </h3>
    <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
      <User size={14} className="text-blue-500" /> {manager}
    </div>
    <p className="mt-2 text-sm text-slate-700 leading-relaxed  ">
      {address}
    </p>
  </motion.div>
);

export default ContactPage;