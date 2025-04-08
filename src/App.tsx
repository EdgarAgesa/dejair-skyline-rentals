import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Helicopters from "./pages/Helicopters";
import ContactAdmin from "./pages/ContactAdmin";
import NotFound from "./pages/NotFound";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import AdminAddHelicopter from "./pages/AdminAddHelicopter";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingChat from './pages/BookingChat';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/user-dashboard" 
            element={<ProtectedRoute element={<UserDashboard />} />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={<ProtectedRoute element={<AdminDashboard />} requireAdmin={true} />} 
          />
          <Route 
            path="/admin/helicopters" 
            element={<ProtectedRoute element={<AdminAddHelicopter />} requireAdmin={true} />} 
          />
          <Route path="/helicopters" element={<Helicopters />} />
          <Route 
            path="/contact-admin" 
            element={<ProtectedRoute element={<ContactAdmin />} />} 
          />
          <Route 
            path="/payment-confirmation/:bookingId" 
            element={<ProtectedRoute element={<PaymentConfirmation />} />} 
          />
          <Route path="/booking/:bookingId/chat" element={<BookingChat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
