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
import IndividualDashboard, { Overview, MyProfile, ChangePassword, SubscriptionPlan } from "./Component/Dashboard/IndividualDashboard";
import CommercialDashboard, { Dashboard } from "./Component/Dashboard/CommercialDashboard";

// ── Admin ──────────────────────────────────────────────────────────────────
import AdminLogin from "./Component/Admin/AdminLogin";
import AdminDashboard from "./Component/Dashboard/AdminDashboard";
import BuyingService from "./Component/Public/Services/Buyingservice";
import BuyingService2 from "./Component/Public/Services/Buyingservice2";
import Companies from "./Component/Public/Companies";
import CompanyDetailPage from "./Component/Public/CompanyDetailPage";
import CompanySubServices from "./Component/Public/Services/CompanySubServices";
import UnderMaintenance from "./Component/Public/UnderMaintenance";
import DashboardLayout from "./Component/Dashboard/Layout/DashboardLayout";
import ProfileWizard from "./Component/Dashboard/pages/ProfileSteper/ProfileWizard";
import AddCredits from "./Component/Dashboard/pages/AddCredits";
import SubscriptionHistory from "./Component/Dashboard/pages/SubscriptionHistory";
import PlansAndSubscriptions from "./Component/Dashboard/pages/PlansAndSubscriptions";
import MyCredits from "./Component/Dashboard/pages/MyCredits";
import ClientsHistory from "./Component/Dashboard/pages/ClientsHistory";
import ServiceListing from "./Component/Dashboard/pages/ServiceListing";
import SettingsPanel from "./Component/Dashboard/SettingsPanel";
import LeadManagement from "./Component/Dashboard/pages/LeadManagement";
import IndividualMyServices from "./Component/Dashboard/pages/IndividualMyServices";
import Step5ServiceListing from "./Component/Dashboard/pages/ProfileSteper/Step5ServiceListing";
import InvoicesPage from "./Component/Dashboard/pages/InvoicesPage";
import InvoicePrintPage from "./Component/Dashboard/pages/Invoice/InvoicePrintPage";

export const router = createBrowserRouter([
  // ── Public routes (Header + Footer via PublicLayout) ─────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/service/:serviceId", element: <CompanySubServices /> },
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/company-list", element: <Companies /> },
      { path: "/company/:userId", element: <CompanyDetailPage /> },
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
  //   ],
  // },

  // ── Commercial Dashboard ──────────────────────────────────────────────────
  {
    path: "/commercial/dashboard",
    element: <CommercialDashboard />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <ProfileWizard /> },
      { path: "credits", element: <AddCredits /> },
      { path: "subscription", element: <SubscriptionHistory /> },
      { path: "plans-and-subscriptions", element: <PlansAndSubscriptions /> },
      { path: "mycredits", element: <MyCredits /> },
      { path: "clients", element: <ClientsHistory /> },
      // { path: "services", element: <ServiceListing dashboardMode={true} /> },
      { path: "servicesListing", element: <Step5ServiceListing navbar={true} /> },
      { path: "leads", element: <LeadManagement /> },
      { path: "settings", element: <SettingsPanel /> },
      { path: "invoices", element: <InvoicesPage /> },
      // { path: "invoices/print/:invoiceId", element: <InvoicePrintPage /> },
    ],
  },

  // ── Individual user dashboard (standalone — own sidebar) ─────────────────
  {
    path: "/individual/dashboard",
    element: <IndividualDashboard />,
    children: [
      { index: true, element: <Overview /> },
      { path: "MyServices", element: <IndividualMyServices /> },
      { path: "subscription", element: <SubscriptionPlan /> },
      { path: "plans-and-subscriptions", element: <PlansAndSubscriptions /> },
      { path: "mycredits", element: <MyCredits /> },
      { path: "profile", element: <MyProfile /> },
      { path: "password", element: <ChangePassword /> },
    ],
  },
 
  // ── User action review panel (opened from admin verification table) ───────
  // Receives: location.state = { actionType, userRow, userTab }
  { path: "/admin/user-action/:applicationId", element: <ActionWrapperMain /> },

  // ── Admin panel ───────────────────────────────────────────────────────────
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },

  // ── Maintenance fallback ────────────────────────────────────────────────
  { path: "*", element: <UnderMaintenance /> },
]);
