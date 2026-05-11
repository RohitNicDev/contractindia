import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layout routes
import PublicLayout from './routes/_public'
import AuthLayout from './routes/_auth'
import DashboardLayout from './routes/_dashboard'

// Public pages
import Index from './routes/_public.index'
import About from './routes/_public.about'
import CompanyList from './routes/_public.company-list'
import Contact from './routes/_public.contact'
import Projects from './routes/_public.projects'
import ServicesConsulting from './routes/_public.services.consulting'
import ServicesContractor from './routes/_public.services.contractor'

// Auth pages
import Login from './routes/_auth.login'
import Otp from './routes/_auth.otp'
import Register from './routes/_auth.register'

// Dashboard pages
import DashboardIndex from './routes/_dashboard.index'
import DashboardProfile from './routes/_dashboard.profile'
import DashboardTenders from './routes/_dashboard.tenders'
import DashboardProjects from './routes/_dashboard.projects'
import DashboardCompanies from './routes/_dashboard.companies'
import DashboardMessages from './routes/_dashboard.messages'
import DashboardSettings from './routes/_dashboard.settings'

export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',                    element: <Index /> },
      { path: '/about',               element: <About /> },
      { path: '/company-list',        element: <CompanyList /> },
      { path: '/contact',             element: <Contact /> },
      { path: '/projects',            element: <Projects /> },
      { path: '/services/consulting', element: <ServicesConsulting /> },
      { path: '/services/contractor', element: <ServicesContractor /> },
    ],
  },

  // ── Auth routes ─────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <Login /> },
      { path: '/otp',      element: <Otp /> },
      { path: '/register', element: <Register /> },
    ],
  },

  // ── Dashboard routes ─────────────────────────────────────────
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true,          element: <DashboardIndex /> },
      { path: 'profile',      element: <DashboardProfile /> },
      { path: 'tenders',      element: <DashboardTenders /> },
      { path: 'projects',     element: <DashboardProjects /> },
      { path: 'companies',    element: <DashboardCompanies /> },
      { path: 'messages',     element: <DashboardMessages /> },
      { path: 'settings',     element: <DashboardSettings /> },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])