import React from 'react';
import { motion } from 'framer-motion';
import {
  Search, Globe, FileText, BarChart3, Users,
  ArrowRight, Building2, HardHat,
  Truck, ShieldCheck
} from 'lucide-react';

const Test = () => {
  return (
    <section className="py-20 bg-primary mx-6 mb-10 rounded-[3rem] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">India's #1 Construction Network</h2>
        {/* <p className="text-slate-300 text-sm mb-10">Get matching tenders on WhatsApp & Email — 100% Free</p> */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-cta text-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
            Register Company — FREE
          </button>
          {/* <button className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
            Post a Tender
          </button> */}
        </div>
      </div>
    </section>


  );
};

export default Test;