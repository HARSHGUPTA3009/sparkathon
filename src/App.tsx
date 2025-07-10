
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UserProtectedRoute } from "./components/UserProtectedRoute";
import UserLogin from "./pages/user/Login";
import UserDashboard from "./pages/user/Dashboard";
import UserHistory from "./pages/user/History";
import UserSubscriptions from "./pages/user/Subscriptions";
import UserLayout from "./components/UserLayout";
import EcoBot from "./components/EcoBot";
import "./index.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<UserLogin />} />
            <Route
              path="/*"
              element={
                <UserProtectedRoute>
                  <UserLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/history" element={<UserHistory />} />
                      <Route path="/subscriptions" element={<UserSubscriptions />} />
                    </Routes>
                    <EcoBot />
                  </UserLayout>
                </UserProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
