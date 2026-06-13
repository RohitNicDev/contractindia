import { createBrowserRouter, Navigate } from "react-router-dom";

// ── Layouts ────────────────────────────────────────────────────────────────
import PublicLayout from "./routes/_public";
import AuthLayout from "./routes/_auth";
// import DashboardLayout from "./routes/_dashboard";

// ── Public pages ───────────────────────────────────────────────────────────
import HomePage from "./Component/Public/HomePage";
import AboutUs from "./Component/Public/AboutUs";
import ContactPage from "./Component/Public/ContactPage";
import Projects from "./Component/Public/Projects";
import Marketplace from "./Component/Public/Marketplace";

// ── Service pages ──────────────────────────────────────────────────────────
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

// ── Auth pages (inside AuthLayout) ────────────────────────────────────────
import LoginForm from "./Component/auth/LoginForm";
import OtpVerification from "./Component/auth/OtpVerification";
import { RegisterForm } from "./Component/auth/RegisterForm";

// ── Dashboard child pages (inside DashboardLayout) ────────────────────────
// import DashboardIndex from "./routes/_dashboard.index";
// import DashboardProfile from "./routes/_dashboard.profile";
// import DashboardTenders from "./routes/_dashboard.tenders";
// import DashboardProjects from "./routes/_dashboard.projects";
// import DashboardCompanies from "./routes/_dashboard.companies";
// import DashboardMessages from "./routes/_dashboard.messages";
// import DashboardSettings from "./routes/_dashboard.settings";

// ── Profile wizard (nested inside DashboardLayout) ────────────────────────
// import ProfileWizard from "./Component/Dashboard/pages/ProfileWizard";

// ── User action wrapper (standalone — opened from admin verification) ──────
import ActionWrapperMain from "./Component/Dashboard/pages/ActionWrapperMain";

// ── Standalone dashboards ──────────────────────────────────────────────────
import IndividualDashboard from "./Component/Dashboard/IndividualDashboard";
import CommercialDashboard from "./Component/Dashboard/CommercialDashboard";

// ── Admin ──────────────────────────────────────────────────────────────────
import AdminLogin from "./Component/Admin/AdminLogin";
import AdminDashboard from "./Component/Dashboard/AdminDashboard";
import BuyingService from "./Component/Public/Services/Buyingservice";
import BuyingService2 from "./Component/Public/Services/Buyingservice2";
import Companies from "./Component/Public/Companies";
import CompanySubServices from "./Component/Public/Services/CompanySubServices";

export const router = createBrowserRouter([
  // ── Public routes (Header + Footer via PublicLayout) ─────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/service/:serviceId", element: <CompanySubServices /> },
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/company-list", element: <Companies /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/projects", element: <Projects /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/services/buy2", element: <BuyingService2 /> },
      { path: "/services/buy", element: <BuyingService /> },
      { path: "/services/contractor", element: <ContractorService /> },
      { path: "/services/consulting", element: <ConsultingService /> },
      { path: "/services/assets-management", element: <AssetsManagement /> },
      { path: "/services/brand-development", element: <BrandDevelopment /> },
      { path: "/services/legal-contracts", element: <LegalContracts /> },
      { path: "/services/marketing", element: <MarketingManagement /> },
      {
        path: "/services/material-manufacturing",
        element: <MaterialManufacture />,
      },
      { path: "/services/material-supply", element: <MaterialSuppler /> },
      { path: "/services/tender", element: <TenderServices /> },
      { path: "/services/contraction-audit", element: <ContractionAudit /> },
    ],
  },

  // ── Auth routes (AuthLayout: animated split-screen) ───────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginForm /> },
      { path: "/otp", element: <OtpVerification /> },
      { path: "/register", element: <RegisterForm /> },
    ],
  },

  // ── Main dashboard (collapsible sidebar via DashboardLayout) ─────────────
  // {
  //   path: "/dashboard",
  //   element: <DashboardLayout />,
  //   children: [
  //     { index: true, element: <DashboardIndex /> },
  //     { path: "profile", element: <DashboardProfile /> },
  //     { path: "tenders", element: <DashboardTenders /> },
  //     { path: "projects", element: <DashboardProjects /> },
  //     { path: "companies", element: <DashboardCompanies /> },
  //     { path: "messages", element: <DashboardMessages /> },
  //     { path: "settings", element: <DashboardSettings /> },
  //     { path: "profile-wizard", element: <ProfileWizard /> },
  //   ],
  // },

  // ── Individual user dashboard (standalone — own sidebar) ─────────────────
  { path: "/individual/dashboard", element: <IndividualDashboard /> },

  // ── Commercial user dashboard (standalone — own sidebar) ─────────────────
  { path: "/commercial/dashboard", element: <CommercialDashboard /> },

  // ── User action review panel (opened from admin verification table) ───────
  // Receives: location.state = { actionType, userRow, userTab }
  { path: "/admin/user-action/:applicationId", element: <ActionWrapperMain /> },

  // ── Admin panel ───────────────────────────────────────────────────────────
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);
