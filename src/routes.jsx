import { createBrowserRouter, Navigate } from "react-router-dom";

// Layout routes
import PublicLayout from "./routes/_public";
import AuthLayout from "./routes/_auth";
import DashboardLayout from "./routes/_dashboard";

// Public pages
import Index from "./routes/_public.index";
import About from "./routes/_public.about";
import CompanyList from "./routes/_public.company-list";
import Contact from "./routes/_public.contact";
import Projects from "./routes/_public.projects";

// Service pages
import ServicesConsulting from "./routes/_public.services.consulting";
import ServicesContractor from "./routes/_public.services.contractor";
import ServicesAssetsManagement from "./routes/_public.services.assets-management";
import ServicesBrandDevelopment from "./routes/_public.services.brand-development";
import ServicesLegalContracts from "./routes/_public.services.legal-contracts";
 
 
// Dashboard pages
import DashboardIndex from "./routes/_dashboard.index";
import DashboardProfile from "./routes/_dashboard.profile";
import DashboardTenders from "./routes/_dashboard.tenders";
import DashboardProjects from "./routes/_dashboard.projects";
import DashboardCompanies from "./routes/_dashboard.companies";
import DashboardMessages from "./routes/_dashboard.messages";
import DashboardSettings from "./routes/_dashboard.settings";
import TenderServices from "./Component/Public/Services/TenderServices";
import MaterialSuppler from "./Component/Public/Services/MaterialSuppler";
import MaterialManufacture from "./Component/Public/Services/MaterialManufacture";
import MarketingManagement from "./Component/Public/Services/MarketingManagement";
import { RegisterForm } from "./components/auth/RegisterForm";
import { OtpVerification } from "./components/auth/OtpVerification";
import { LoginForm } from "./components/auth/LoginForm";
import LegalContracts from "./Component/Public/Services/LegalContracts";
import ContractionAudit from "./Component/Public/Services/ContractionAudit";

export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/",                                  element: <Index /> },
      { path: "/about",                             element: <About /> },
      { path: "/company-list",                      element: <CompanyList /> },
      { path: "/contact",                           element: <Contact /> },
      { path: "/projects",                          element: <Projects /> },
      { path: "/services/consulting",               element: <ServicesConsulting /> },
      { path: "/services/contractor",               element: <ServicesContractor /> },
      { path: "/services/assets-management",        element: <ServicesAssetsManagement /> },
      { path: "/services/brand-development",        element: <ServicesBrandDevelopment /> },
      { path: "/services/legal-contracts",          element: <LegalContracts /> },
      { path: "/services/marketing",                element: <MarketingManagement /> },
      { path: "/services/material-manufacturing",   element: <MaterialManufacture /> },
      { path: "/services/material-supply",          element: <MaterialSuppler /> },
      { path: "/services/tender",                   element: <TenderServices /> },
      { path: "/services/contraction-audit",         element: <ContractionAudit /> },
    ],
  },

  // ── Auth routes ─────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login",    element: <LoginForm /> },
      { path: "/otp",      element: <OtpVerification /> },
      { path: "/register", element: <RegisterForm /> },
    ],
  },

  // ── Dashboard routes ─────────────────────────────────────────
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true,          element: <DashboardIndex /> },
      { path: "profile",      element: <DashboardProfile /> },
      { path: "tenders",      element: <DashboardTenders /> },
      { path: "projects",     element: <DashboardProjects /> },
      { path: "companies",    element: <DashboardCompanies /> },
      { path: "messages",     element: <DashboardMessages /> },
      { path: "settings",     element: <DashboardSettings /> },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
