import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar />

      {/* All Routes */}
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />

        {/* Event Details */}
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Booking Success */}
        <Route path="/booking-success/:id" element={<BookingSuccess />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ==================== PROTECTED USER ROUTES ==================== */}

        <Route element={<ProtectedUserRoute />}>
          {/* My Bookings */}
          <Route path="/my-bookings" element={<MyBooking />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Booking */}
          <Route path="/events/:id/book" element={<Booking />} />
        </Route>

        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}

        <Route element={<ProtectedAdminRoute />}>
          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Add Event */}
          <Route path="/admin/events/add" element={<AddEvent />} />

          {/* Manage Events */}
          <Route path="/admin/events" element={<AdminEvents />} />

          {/* Edit Event */}
          <Route path="/admin/events/edit/:id" element={<EditEvent />} />

          {/* Manage Bookings */}
          <Route path="/admin/bookings" element={<AdminBookings />} />

          {/* Booking Details */}
          <Route path="/admin/bookings/:id" element={<AdminBookingDetails />} />

          {/* Manage Users */}
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
