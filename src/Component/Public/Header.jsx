import {
  LogIn,
  MenuIcon,
  X,
  ChevronDown,
  Search,
  Bell,
  ChevronRight,
  Layout,
  MapPin,
  Globe2,
  Brush,
  Zap,
  Users,
  Shield,
  Wrench,
  Building2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Badge, Drawer, Collapse } from "antd";
import logo from "../../assets/IMG/logo_con1.png";
const { Panel } = Collapse;

// ─── Mega Menu Data ───────────────────────────────────────────────
const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  {
    name: "Services",
    mega: true,
    columns: [
      {
        title: "Paints / Waterproofing",
        icon: <Brush size={15} className="text-blue-500" />,
        color: "blue",
        items: [
          "Adhesives / Glue",
          "Asphalt / Bitumen",
          "Construction Chemicals",
          "Industrial Coatings",
          "Landscape & Horticulture",
        ],
      },
      {
        title: "Consultants",
        icon: <Users size={15} className="text-purple-500" />,
        color: "purple",
        items: [
          "Architectural Consultants",
          "Structural Consultants",
          "MEP Consultants",
          "Project Management",
        ],
      },
      {
        title: "Contractors",
        icon: <Building2 size={15} className="text-orange-500" />,
        color: "orange",
        items: [
          "Civil Contractors",
          "Interior Contractors",
          "Electrical Contractors",
          "Plumbing Contractors",
        ],
      },
      {
        title: "Safety / Security & Fire",
        icon: <Shield size={15} className="text-red-500" />,
        color: "red",
        items: [
          "CCTV & Surveillance",
          "Fire Detection Systems",
          "Access Control",
          "Safety Equipment",
        ],
      },
      {
        title: "Automation",
        icon: <Zap size={15} className="text-yellow-500" />,
        color: "yellow",
        items: [
          "Banking Automation",
          "Commercial Automation",
          "Home Automation",
          "Industrial Automation",
        ],
      },
      {
        title: "Special Services",
        icon: <Wrench size={15} className="text-green-500" />,
        color: "green",
        items: ["Waterproofing", "Façade Works", "Flooring", "Landscaping"],
      },
    ],
  },
  { name: "Projects", path: "/projects", isNew: true },
  { name: "Contact Us", path: "/contact" },
];

// ─── Services Dropdown Menu ──────────────────────────────────────
const DropdownMenu = ({ columns, visible }) => (
  <div
    className={`absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-md py-2 w-72 transition-all duration-200 origin-top z-50 ${visible
      ? "opacity-100 scale-y-100 pointer-events-auto"
      : "opacity-0 scale-y-95 pointer-events-none"
      }`}
  >
    {columns.map((col) => (
      <div
        key={col.title}
        className="relative group/item"
      >
        <div className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors hover:bg-blue-50 group-hover/item:bg-blue-50">
          <span className="text-[13px] font-bold tracking-wide uppercase text-gray-700 group-hover/item:text-blue-600">
            {col.title}
          </span>
          <ChevronRight size={14} className="text-gray-400 group-hover/item:text-blue-600" />
        </div>

        {/* Sub-menu */}
        <div
          className="absolute left-[calc(100%-8px)] top-0 pl-2 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 z-50 w-64 pointer-events-none group-hover/item:pointer-events-auto"
        >
          <div className="bg-white shadow-xl border border-gray-100 rounded-md py-2 w-full">
            {col.items.map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 no-underline transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Header ──────────────────────────────────────────────────
const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const megaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/70 backdrop-blur-md shadow-lg border-b border-white/30"
        : "bg-white border-b border-gray-100"
        }`}
    >
      {/* 🌐 TOP BAR */}
      <div className="bg-[#162646] text-white/90 py-2 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-medium tracking-wide">
            {/* <span className="flex items-center gap-1 shrink-0">
              <Globe2 size={12} className="text-blue-400" />
              Govt Initiative
            </span> */}
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1 shrink-0">
              <Layout size={12} className="text-blue-400" />
              Integrated Solution For Construction &amp; Infrastructure
            </span>
            <span className="hidden lg:inline opacity-30">|</span>
            <span className="hidden lg:flex items-center gap-1 shrink-0">
              <MapPin size={12} className="text-blue-400" />
              All India Coverage
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] sm:text-[11px] font-semibold border-t border-white/10 md:border-none pt-2 md:pt-0 w-full md:w-auto justify-center">
            <span className="cursor-pointer hover:text-blue-300 transition uppercase tracking-tighter">
              Advertise
            </span>
            <span className="opacity-30">|</span>
            <span className="cursor-pointer hover:text-blue-300 transition uppercase tracking-tighter">
              Become a Seller
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
          {/* Mobile Menu */}
          <button
            className="lg:hidden p-2 -ml-2 text-gray-600 active:bg-gray-100 rounded-full transition"
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon size={24} />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Contracts India Logo"
              className="rounded-2xl h-9 w-9 sm:h-11 sm:w-11 object-contain transition-all duration-300 group-hover:scale-105"
            />
            <div className="leading-tight">
              <h1 className="text-lg sm:text-xl font-black text-[#162646] tracking-tight">
                CONTRACTS<span className="text-blue-600">INDIA</span>
              </h1>
              <p className="hidden sm:block text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                Integrated Solution For Construction &amp; Infrastructure
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4">
            <div className="flex w-full bg-gray-100 rounded-xl overflow-hidden border border-transparent focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-sm transition-all">
              <select className="bg-transparent px-3 text-sm outline-none border-r border-gray-200 cursor-pointer">
                <option value="all">All</option>
                <option value="tender">Tenders</option>
                <option value="contractor">Contractors</option>
                <option value="material">Materials</option>
              </select>
              <input
                type="text"
                placeholder="Search tenders, contractors, materials..."
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              />
              <button className="px-4 bg-[#162646] text-white hover:bg-blue-700 transition flex items-center justify-center">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Icon */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>

            {/* Notification - hide on very small screens */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              <Badge dot color="blue">
                <Bell size={20} className="text-gray-500" />
              </Badge>

              <div className="flex items-center gap-2">
                <Button
                  type="default"
                  className="!rounded-lg !h-9 !px-4 !font-semibold border border-[#162646] text-[#162646] hover:!bg-[#162646] hover:!text-white transition"
                  onClick={() => navigate("/register")}
                >
                  <span className="text-sm">Register</span>
                </Button>

                <Button
                  type="primary"
                  className="!bg-[#162646] !rounded-lg !h-8 sm:!h-10 !px-3 sm:!px-6 !font-bold flex items-center gap-1 sm:gap-2"
                  onClick={() => navigate("/login")}
                >
                  <LogIn size={14} />
                  <span className="text-xs sm:text-sm">Login</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button className="p-2 bg-[#162646] text-white rounded-md">
                <Search size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden lg:flex items-center gap-1 border-t border-gray-50 relative">
          {NAV_ITEMS.map((item) => {
            if (item.mega) {
              return (
                <div
                  key={item.name}
                  ref={megaRef}
                  className="py-3 relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-bold rounded-lg transition outline-none ${megaOpen
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                      }`}
                  >
                    {item.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <DropdownMenu columns={item.columns} visible={megaOpen} />
                </div>
              );
            }
            return (
              <div key={item.name} className="py-3">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 text-sm font-bold no-underline rounded-lg transition ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                    }`
                  }
                >
                  {item.name}
                  {/* {item.isNew && (
                    <span className="absolute -top-1 -right-1 text-[8px] bg-blue-600 text-white px-1 rounded-full font-bold">
                      NEW
                    </span>
                  )} */}
                </NavLink>
              </div>
            );
          })}
        </nav>
      </div>

      {/* 📱 MOBILE DRAWER */}
      <Drawer
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={300}
        closeIcon={null}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col h-full">
          <div className="bg-[#162646] p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Contracts India Logo"
                className="rounded-2xl h-9 w-9 sm:h-11 sm:w-11 object-contain transition-all duration-300 group-hover:scale-105"
              />
              <div>
                <p className="text-sm font-bold mb-0 leading-none">
                  CONTRACTSINDIA
                </p>
                <p className="text-[10px] text-white/50">
                  Integrated Solution For Construction &amp; Infrastructure
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2 sm:p-3">
              {NAV_ITEMS.map((item) => (
                <div key={item.name} className="mb-1">
                  {item.mega ? (
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      className="mobile-nav-collapse"
                    >
                      <Panel
                        header={
                          <span className="font-semibold text-[13px] sm:text-sm text-gray-700">
                            {item.name}
                          </span>
                        }
                        key={item.name}
                        className="!p-0"
                      >
                        {item.columns.map((col) => (
                          <div key={col.title} className="mb-2 ml-1">
                            {/* Section Title */}
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 pl-2">
                              {col.title}
                            </p>

                            {/* Items */}
                            <div className="flex flex-col gap-0.5 border-l border-gray-100 pl-3">
                              {col.items.map((sub) => (
                                <div
                                  key={sub}
                                  className="py-1 text-[12px] sm:text-[13px] text-gray-600 font-medium 
                                   active:text-blue-600 cursor-pointer 
                                   hover:text-blue-600 transition"
                                  onClick={() => setIsDrawerOpen(false)}
                                >
                                  {sub}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </Panel>
                    </Collapse>
                  ) : (
                    <NavLink
                      to={item.path}
                      className="flex items-center justify-between px-3 py-2 
                       rounded-lg font-semibold text-[13px] sm:text-sm 
                       text-gray-700 hover:bg-blue-50 no-underline transition"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {item.name}
                      <ChevronRight size={14} className="text-gray-300" />
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-3">
              {/* Register Button */}
              <Button
                block
                type="default"
                size="large"
                className="!rounded-xl border border-[#162646] text-[#162646] hover:!bg-[#162646] hover:!text-white"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>

              {/* Login Button */}
              <Button
                block
                type="primary"
                size="large"
                className="!bg-[#162646] !rounded-xl"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
