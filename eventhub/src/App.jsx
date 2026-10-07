import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute";
import ProtectedUserRoute from "./Components/ProtectedUserRoute";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSucess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyBooking from "./pages/MyBooking";

// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddEvent from "./admin/AddEvent";
import AdminEvents from "./admin/AdminEvents";
import EditEvent from "./admin/EditEvent";
import AdminBookings from "./admin/AdminBookings";
import AdminUsers from "./admin/AdminUsers";
import AdminBookingDetails from "./admin/AdminBookingDetails";

// User Pages
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();

  // Admin pages par normal Navbar/Footer nahi batavva
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Normal Navbar only */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />

        <Route path="/events/:id" element={<EventDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/booking-success/:id" element={<BookingSuccess />} />

        {/* ==================== ADMIN LOGIN ==================== */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ==================== PROTECTED USER ROUTES ==================== */}

        <Route element={<ProtectedUserRoute />}>
          <Route path="/my-bookings" element={<MyBooking />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/events/:id/book" element={<Booking />} />
        </Route>

        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/events/add" element={<AddEvent />} />

          <Route path="/admin/events" element={<AdminEvents />} />

          <Route path="/admin/events/edit/:id" element={<EditEvent />} />

          <Route path="/admin/bookings" element={<AdminBookings />} />

          <Route path="/admin/bookings/:id" element={<AdminBookingDetails />} />

          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* ==================== 404 ==================== */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Normal Footer only */}
      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
