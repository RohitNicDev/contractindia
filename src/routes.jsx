import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "./routes/_public";
import AuthLayout from "./routes/_auth";
import DashboardLayout from "./routes/_dashboard";

// Public pages
import HomePage from "./Component/Public/HomePage";
import AboutUs from "./Component/Public/AboutUs";
import { Companies } from "./Component/Public/Companies";
import ContactPage from "./Component/Public/ContactPage";
import Projects from "./Component/Public/Projects";
import Marketplace from "./Component/Public/Marketplace";

// Services
import ConsultingService from "./Component/Public/Services/ConsultingService";
import ContractorService from "./Component/Public/Services/ContractorService";
import AssetsManagement from "./Component/Public/Services/AssetsManagement";
import BrandDevelopment from "./Component/Public/Services/BrandDevelopment";
import LegalContracts from "./Component/Public/Services/LegalContracts";
import MarketingManagement from "./Component/Public/Services/MarketingManagement";
import MaterialManufacture from "./Component/Public/Services/MaterialManufacture";
import MaterialSuppler from "./Component/Public/Services/MaterialSuppler";
import TenderServices from "./Component/Public/Services/TenderServices";
import ContractionAudit from "./Component/Public/Services/ContractionAudit";

// Auth (existing)
import { LoginForm } from "./components/auth/LoginForm";
import { OtpVerification } from "./components/auth/OtpVerification";
import { RegisterForm } from "./components/auth/RegisterForm";

// // Auth (new standalone)
// import IndividualRegister from "./Component/Auth/IndividualRegister";
// import CommercialRegister from "./Component/Auth/CommercialRegister";

// Existing dashboard pages
import DashboardIndex from "./routes/_dashboard.index";
import DashboardProfile from "./routes/_dashboard.profile";
import DashboardTenders from "./routes/_dashboard.tenders";
import DashboardProjects from "./routes/_dashboard.projects";
import DashboardCompanies from "./routes/_dashboard.companies";
import DashboardMessages from "./routes/_dashboard.messages";
import DashboardSettings from "./routes/_dashboard.settings";

// New dashboards
import IndividualDashboard from "./Component/Dashboard/IndividualDashboard";
import CommercialDashboard from "./Component/Dashboard/CommercialDashboard";

// Admin
// import AdminLogin from "./Component/Admin/AdminLogin";
import AdminDashboard from "./Component/Admin/AdminDashboard";

export const router = createBrowserRouter([
  // ── Public routes (with Header + Footer) ───────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/",                                  element: <HomePage /> },
      { path: "/about",                             element: <AboutUs /> },
      { path: "/company-list",                      element: <Companies /> },
      { path: "/contact",                           element: <ContactPage /> },
      { path: "/projects",                          element: <Projects /> },
      { path: "/marketplace",                       element: <Marketplace /> },
      { path: "/services/consulting",               element: <ConsultingService /> },
      { path: "/services/contractor",               element: <ContractorService /> },
      { path: "/services/assets-management",        element: <AssetsManagement /> },
      { path: "/services/brand-development",        element: <BrandDevelopment /> },
      { path: "/services/legal-contracts",          element: <LegalContracts /> },
      { path: "/services/marketing",                element: <MarketingManagement /> },
      { path: "/services/material-manufacturing",   element: <MaterialManufacture /> },
      { path: "/services/material-supply",          element: <MaterialSuppler /> },
      { path: "/services/tender",                   element: <TenderServices /> },
      { path: "/services/contraction-audit",        element: <ContractionAudit /> },
    ],
  },

  // ── Auth routes (with AuthLayout) ──────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login",    element: <LoginForm /> },
      { path: "/otp",      element: <OtpVerification /> },
      { path: "/register", element: <RegisterForm /> },
    ],
  },

  // ── New standalone registration pages ──────────────────────
  // { path: "/register/individual",  element: <IndividualRegister /> },
  // { path: "/register/commercial",  element: <CommercialRegister /> },

  // ── Existing dashboard (with DashboardLayout) ──────────────
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true,       element: <DashboardIndex /> },
      { path: "profile",   element: <DashboardProfile /> },
      { path: "tenders",   element: <DashboardTenders /> },
      { path: "projects",  element: <DashboardProjects /> },
      { path: "companies", element: <DashboardCompanies /> },
      { path: "messages",  element: <DashboardMessages /> },
      { path: "settings",  element: <DashboardSettings /> },
    ],
  },

  // ── Individual dashboard (standalone) ──────────────────────
  { path: "/individual/dashboard", element: <IndividualDashboard /> },

  // ── Commercial dashboard (standalone) ──────────────────────
  { path: "/commercial/dashboard", element: <CommercialDashboard /> },

  // ── Admin panel (standalone) ────────────────────────────────
  // { path: "/admin/login",     element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },

  // ── Fallback ─────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);
