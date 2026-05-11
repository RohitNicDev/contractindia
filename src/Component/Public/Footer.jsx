import React from "react";
import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  ShieldCheck,
  Award,
  Globe,
  ArrowRight    
} from "lucide-react";
import logo from "../../assets/IMG/logo_con1.png";

const Footer = () => {
  const cols = [
    {
      title: "Services",
      links: [
        { name: "Post a Tender", href: "#" },
        { name: "Browse Tenders", href: "#" },
        { name: "Find Contractors", href: "#" },
        { name: "List Company", href: "#" },
        { name: "Materials Market", href: "#" }
      ]
    },
    {
      title: "Categories",
      links: [
        { name: "Building Construction", href: "#" },
        { name: "Architecture", href: "#" },
        { name: "EPC/PMC Solutions", href: "#" },
        { name: "Interior Design", href: "#" },
        { name: "Plumbing Systems", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Our Careers", href: "#" },
        { name: "Insights Blog", href: "#" },
        { name: "Partner Program", href: "#" },
        { name: "Contact Us", href: "#" }
      ]
    },
  ];

  return (
    <footer className="bg-[#020617] text-slate-300 pt-20 pb-10 border-t border-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              {/* <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/20"> */}
                 <img
                                src={logo}
                                alt="Contracts India Logo"
                                className="rounded-2xl h-9 w-9 sm:h-11 sm:w-11 object-contain 
                    transition-all duration-300 
                    group-hover:scale-105"
                              />
                
              {/* </div> */}
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">ContractsIndia™</h2>
                <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">Integrated Solution For Construction & Infrastructure</p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Revolutionizing the civil engineering landscape with India's most advanced B2B ecosystem for tenders and procurement.
            </p>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm">Join our newsletter</h4>
              <div className="relative max-w-xs">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                />
                <button className="absolute right-2 top-1.5 p-1.5 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="hover:text-accent transition-all hover:pl-2 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-[1px] bg-accent mr-0 group-hover:mr-2 transition-all"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact / Social Section */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Linkedin className="w-4 h-4" />, href: "#" },
                { icon: <Twitter className="w-4 h-4" />, href: "#" },
                { icon: <Instagram className="w-4 h-4" />, href: "#" },
                { icon: <Facebook className="w-4 h-4" />, href: "#" },
                { icon: <Youtube className="w-4 h-4" />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5 text-accent" />
                hello@contractsindia.com
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-accent" />
                www.contractsindia.in
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Trust */}
        <div className="border-t border-slate-800/50 pt-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start gap-1">
            <p className="text-xs text-slate-500">
              © 2026 ContractsIndia™ Technologies Pvt. Ltd.
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-tighter">
              Crafted for the future of India's Infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <Award className="w-4 h-4 text-amber-500/50" />
              ISO 9001:2015
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
              SSL SECURED
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="px-1.5 py-0.5 rounded border border-slate-700 text-[9px]">MSME</span>
              REGISTERED
            </div>
          </div>

          <div className="flex gap-6 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;