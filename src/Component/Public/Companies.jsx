import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Drawer } from "antd";
import { Star, MapPin, BadgeCheck, ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserDocumentStoreGetByparam,
  userRegistrationHomeDetails,
  UserVerificationGet,
} from "../../services/api";
import { useQuery } from "@tanstack/react-query";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.BASE_URL;
console.log(API_URL, "API_URL");

const companies = [
  {
    name: "Shapoorji Pallonji & Co.",
    type: "EPC Contractor",
    rating: 4.8,
    reviews: 312,
    tags: ["EPC", "Infrastructure"],
    loc: "Mumbai, MH",
    verified: true,
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    grad: "from-blue-500 to-indigo-600",
  },
  {
    name: "Design Arc Architects",
    type: "Architecture Firm",
    rating: 4.7,
    reviews: 189,
    tags: ["Sustainable", "Commercial"],
    loc: "Pune, MH",
    verified: true,
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    grad: "from-violet-500 to-purple-600",
  },
  {
    name: "UrbanSpace Interiors",
    type: "Interior Design",
    rating: 4.9,
    reviews: 428,
    tags: ["Luxury", "Hospitality"],
    loc: "Delhi NCR",
    verified: true,
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    grad: "from-emerald-500 to-teal-600",
  },
  {
    name: "Volt & Wire Electrical",
    type: "Electrical Contractor",
    rating: 4.7,
    reviews: 156,
    tags: ["Solar", "Fire Alarm"],
    loc: "Nagpur, MH",
    verified: true,
    img: "https://images.unsplash.com/photo-1581092919535-7146ff1a590b",
    grad: "from-amber-500 to-orange-600",
  },
];

const userRegistrationDetailsGetApi = async (type, usertype) => {
  const response = await userRegistrationHomeDetails(`isVerifiedByAdmin=${type}&userType=${usertype}`);
  return response?.data ?? [];
};

const UserDocumentStoreGetByparamApi = async (userId) => {
  const response = await UserDocumentStoreGetByparam(
    `?userId=${userId}&documentCategoryId=7&documentSubCategoryId=10`
  );
  return response ?? [];
};

// Image Loading Component
const CompanyImage = ({ userId, companyName }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        const url = `${API_URL}/UserDocumentStore/image?userId=${userId}&documentCategoryId=7&documentSubCategoryId=10`;
        // Verify the image loads by creating an Image object
        const img = new Image();
        img.onload = () => {
          setImageUrl(url);
          setHasError(false);
        };
        img.onerror = () => {
          setHasError(true);
        };
        img.src = url;
      } catch (error) {
        console.error("Error loading image for userId:", userId, error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadImage();
    }
  }, [userId]);

  // Fallback gradient based on company name
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
  ];
  const fallbackGrad = gradients[Math.floor(Math.random() * gradients.length)];

  if (hasError) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${fallbackGrad} flex items-center justify-center`}>
        <span className="text-white text-xs font-semibold">{companyName}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={companyName}
      className="
        w-full
        h-full
        object-cover
        group-hover:scale-110
        transition-transform
        duration-700
      "
    />
  );
};

const Companies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  //1=approved, 0=pending, 2=rejected
  //usertype: 1=individual, 2=Company
  const params = {
    isVerifiedByAdmin: 1,
    userType: 2,
  };

  const {
    data: userRegistrationDetailsdata = [],
    isLoading: userRegistrationDetailsisLoading,
    refetch: userRegistrationDetailsrefetch,
    isFetching: userRegistrationDetailsisFetching,
  } = useQuery({
    queryKey: ["userRegistrationDetailsGetApi", params],
    queryFn: () =>
      userRegistrationDetailsGetApi(params?.isVerifiedByAdmin, params?.userType),
    enabled: true,
    retry: 2,
  });

  const companiesForDashboard = userRegistrationDetailsdata?.map((item) => ({
    userId: item?.UserId,
    name: item?.CompanyName || '',
    type: item?.UserTypeName || "",
    rating: 4.8,
    reviews: 100,
    tags: item?.ServiceNames
      ? item?.ServiceNames?.split(",")?.map((t) => t?.trim())?.filter(Boolean)
      : ["Business Service"],
    loc: item?.StateName,
    // verified: item?.Status === "Approved",
    grad:
      item?.Status === "Approved"
        ? "from-blue-500 to-indigo-600"
        : "from-amber-500 to-orange-600",
    // email: item?.EmailId,
    // mobile: item?.MobileNo,
    // pincode: item?.PinCode,
  }));
  useEffect(() => {
    console.log(companiesForDashboard, "companiesForDashboard");
  }, [companiesForDashboard]);
  useEffect(() => {
    console.log(userRegistrationDetailsdata, "userRegistrationDetailsdata");
  }, [userRegistrationDetailsdata]);

  const displayedCompanies = isHomePage
    ? companiesForDashboard.slice(0, 4)
    : companiesForDashboard;

  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleServiceClick = (serviceName) => {
    const slug = String(serviceName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    console.log(selectedCompany, "selectedCompany");

    setDrawerOpen(false);
    navigate(`/service/${slug || "service"}`);
  };

  return (
    <section className="relative py-24 overflow-hidden bg-slate-100">
      {/* Background glow orbs */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4">
              ✦ Top Rated
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Verified{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Industry Leaders
              </span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Work with the top-rated contractors and consultants in the region.
            </p>
          </div>

          {isHomePage && (
            <button
              type="button"
              onClick={() => navigate("/company-list")}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              View more
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companiesForDashboard?.map((elm, idx) => (
            <motion.button
              type="button"
              key={elm?.userId}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                transition: { duration: 0.25 },
              }}
              // onClick={() => {
              //   if (elm?.userId) {
              //     navigate(`/company/${elm.userId}`);
              //   }
              // }}
              className="
                group
                relative
                w-full
                rounded-2xl
                overflow-hidden
                bg-white
                border
                border-slate-200/80
                hover:border-indigo-200
                shadow-sm
                hover:shadow-2xl
                transition-all
                duration-400
                text-left
              "
            >
              {/* Top Gradient */}
              <div
                className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${elm?.grad} z-10`}
              />

              {/* Cover Image */}
              <div className="relative h-40 overflow-hidden bg-slate-200">
                <CompanyImage userId={elm?.userId} companyName={elm?.name} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Verified Badge */}
                {elm?.verified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Company Name */}
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors duration-300 leading-snug">
                  {elm?.name}
                </h3>

                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {elm?.type}
                </p>

                {/* Rating */}
                {/* <div className="flex items-center gap-1.5 mt-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= Math.floor(elm?.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-bold text-slate-700">
                    {elm?.rating}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    ({elm?.reviews})
                  </span>
                </div> */}

                {/* Tags */}
                {/* <div className="flex flex-wrap gap-1.5 mt-3">
                  {elm?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="
                        text-[10px]
                        bg-slate-100
                        border
                        border-slate-200/80
                        px-2
                        py-0.5
                        rounded-md
                        font-semibold
                        text-slate-500
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}

                {/* Contact Info */}
                {/* <div className="mt-3 space-y-1">
                  <p className="text-[11px] text-slate-500">
                    📮 {elm?.pincode}
                  </p>
                </div> */}

                {/* Footer */}
                {/* <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {elm?.loc}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      // openCompanyDetails(elm);
                    }}
                    className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-indigo-600"
                  >
                    View details
                  </button>
                </div> */}
              </div>
            </motion.button>
          ))}
        </div>

        {companiesForDashboard?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 font-medium">
              No verified companies found.
            </p>
          </div>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={420}
        destroyOnClose
        // ✅ Add these props
        getContainer={false}        // Renders inside parent, not body
        mask={true}
        maskClosable={true}
        styles={{
          body: { padding: 0, background: "#f8fafc" },
          header: { borderBottom: "none", padding: "16px 20px 0" },
          wrapper: { zIndex: 999 },  // ✅ Lower z-index
          mask: { zIndex: 998 },     // ✅ Control mask separately
        }}
      >
        {selectedCompany ? (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
              <div className="relative h-44 w-full">
                <CompanyImage userId={selectedCompany?.userId} companyName={selectedCompany?.name} />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-black text-slate-900">{selectedCompany?.name || "Company"}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedCompany?.type || "Verified company"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Services</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCompany?.tags?.length ? (
                  selectedCompany.tags.map((service, index) => (
                    <button
                      key={`${service}-${index}`}
                      type="button"
                      onClick={() => handleServiceClick(service)}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {service}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No services listed yet.</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Location</p>
              <p className="mt-1">{selectedCompany?.loc || "Location available on request"}</p>
            </div>
          </div>
        ) : null}
      </Drawer>
    </section>
  );
};

export default Companies;