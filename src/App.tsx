import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import ServiceRequest from "./pages/ServiceRequest";
import Results from "./pages/Results";
import ProviderProfile from "./pages/ProviderProfile";
import HowItWorksPage from "./pages/HowItWorks";
import ServicesPage from "./pages/Services";
import NotFound from "./pages/NotFound";

// Auth
import Login from "./pages/auth/Login";

// Onboarding
import OnboardingIndex from "./pages/onboarding/index";
import CustomerOnboarding from "./pages/onboarding/Customer";
import ProviderOnboarding from "./pages/onboarding/Provider";

// Dashboards
import CustomerDashboard from "./pages/customer/index";
import ProviderDashboard from "./pages/provider/index";
import AdminDashboard from "./pages/admin/index";
import AdminWorkers from "./pages/admin/Workers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/request" element={<ServiceRequest />} />
            <Route path="/results" element={<Results />} />
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/services" element={<ServicesPage />} />

            {/* Auth — redirect /auth to new path for backward compat */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

            {/* Onboarding — requires auth, allows incomplete onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute requireOnboarding>
                  <OnboardingIndex />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/customer"
              element={
                <ProtectedRoute requireOnboarding>
                  <CustomerOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/provider"
              element={
                <ProtectedRoute requireOnboarding>
                  <ProviderOnboarding />
                </ProtectedRoute>
              }
            />

            {/* Dashboards — requires auth + complete onboarding + matching role */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider"
              element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/workers"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminWorkers />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
