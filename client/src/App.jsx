import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Spinner from './components/common/Spinner';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProviderLayout from './layouts/ProviderLayout';
import AdminLayout from './layouts/AdminLayout';

// Every page is code-split so the first load only downloads the layout shell
// plus whichever single page was requested, instead of the whole site.
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));
const Planner = lazy(() => import('./pages/Planner'));
const Hotels = lazy(() => import('./pages/Hotels'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const Experiences = lazy(() => import('./pages/Experiences'));
const ExperienceDetails = lazy(() => import('./pages/ExperienceDetails'));
const Guides = lazy(() => import('./pages/Guides'));
const Businesses = lazy(() => import('./pages/Businesses'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Safety = lazy(() => import('./pages/Safety'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyTrips = lazy(() => import('./pages/MyTrips'));
const TripDetails = lazy(() => import('./pages/TripDetails'));
const Saved = lazy(() => import('./pages/Saved'));
const Profile = lazy(() => import('./pages/Profile'));

const MyListings = lazy(() => import('./pages/provider/MyListings'));
const AddListing = lazy(() => import('./pages/provider/AddListing'));
const Inquiries = lazy(() => import('./pages/provider/Inquiries'));
const Analytics = lazy(() => import('./pages/provider/Analytics'));
const EditListing = lazy(() => import('./pages/provider/EditListing'));

const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminBusinesses = lazy(() => import('./pages/admin/AdminBusinesses'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={28} className="text-saffron-500" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'font-sans text-sm',
          style: { borderRadius: '9999px', padding: '10px 18px' },
        }}
      />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experience/:id" element={<ExperienceDetails />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Traveler account area (protected, but rendered inside MainLayout's
              nav for simplicity — DashboardLayout below handles the sidebar) */}
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <TripDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Traveler dashboard area */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Provider dashboard */}
        <Route
          element={
            <ProtectedRoute roles={['provider', 'admin']}>
              <ProviderLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/provider" element={<MyListings />} />
          <Route path="/provider/new" element={<AddListing />} />
          <Route path="/provider/inquiries" element={<Inquiries />} />
          <Route path="/provider/analytics" element={<Analytics />} />
          <Route path="/provider/edit/:id" element={<EditListing />} />
        </Route>

        {/* Admin dashboard */}
        <Route
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
