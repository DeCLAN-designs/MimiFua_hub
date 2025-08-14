import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

import HomePage from "./Pages/HomePage/HomePage";
import Solutions from "./Pages/Solutions/Solutions";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Blogs from "./Pages/Blogs/Blogs";
import Opportunities from "./Pages/Opportunities/Opportunities";
import ContactUs from "./Pages/ContactUs/ContactUs";
import Login from "./Pages/Auth/Login/Login";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import NotFound from "./Pages/NotFound/NotFound";
import Dashboard from "./Pages/Dashboard/Dashboard";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayoutOn = ["/login", "/register"];
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admindashboard") ||
    location.pathname.startsWith("/managerdashboard") ||
    location.pathname.startsWith("/employeedashboard");
  const shouldHideLayout =
    hideLayoutOn.includes(location.pathname) || isDashboardRoute;

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          {/* Legacy dashboard route - redirects to role-specific dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admindashboard"
            element={
              <PrivateRoute>
                <Dashboard view="dashboard" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/users"
            element={
              <PrivateRoute>
                <Dashboard view="users" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/access-logs"
            element={
              <PrivateRoute>
                <Dashboard view="access-logs" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/analytics"
            element={
              <PrivateRoute>
                <Dashboard view="analytics" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/settings"
            element={
              <PrivateRoute>
                <Dashboard view="settings" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/employees"
            element={
              <PrivateRoute>
                <Dashboard view="employees" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/sales"
            element={
              <PrivateRoute>
                <Dashboard view="sales" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/inventory"
            element={
              <PrivateRoute>
                <Dashboard view="inventory" />
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboard/leave"
            element={
              <PrivateRoute>
                <Dashboard view="leave" />
              </PrivateRoute>
            }
          />

          {/* Manager Dashboard Routes */}
          <Route
            path="/managerdashboard"
            element={
              <PrivateRoute>
                <Dashboard view="dashboard" />
              </PrivateRoute>
            }
          />
          <Route
            path="/managerdashboard/employees"
            element={
              <PrivateRoute>
                <Dashboard view="employees" />
              </PrivateRoute>
            }
          />
          <Route
            path="/managerdashboard/sales"
            element={
              <PrivateRoute>
                <Dashboard view="sales" />
              </PrivateRoute>
            }
          />
          <Route
            path="/managerdashboard/inventory"
            element={
              <PrivateRoute>
                <Dashboard view="inventory" />
              </PrivateRoute>
            }
          />
          <Route
            path="/managerdashboard/leave"
            element={
              <PrivateRoute>
                <Dashboard view="leave" />
              </PrivateRoute>
            }
          />

          {/* Employee Dashboard Routes */}
          <Route
            path="/employeedashboard"
            element={
              <PrivateRoute>
                <Dashboard view="dashboard" />
              </PrivateRoute>
            }
          />
          <Route
            path="/employeedashboard/my-sales"
            element={
              <PrivateRoute>
                <Dashboard view="my-sales" />
              </PrivateRoute>
            }
          />
          <Route
            path="/employeedashboard/restock"
            element={
              <PrivateRoute>
                <Dashboard view="restock" />
              </PrivateRoute>
            }
          />
          <Route
            path="/employeedashboard/summary"
            element={
              <PrivateRoute>
                <Dashboard view="summary" />
              </PrivateRoute>
            }
          />
          <Route
            path="/employeedashboard/leave"
            element={
              <PrivateRoute>
                <Dashboard view="leave" />
              </PrivateRoute>
            }
          />
          <Route
            path="/employeedashboard/personal-activity"
            element={
              <PrivateRoute>
                <Dashboard view="personal-activity" />
              </PrivateRoute>
            }
          />

          <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          <Route
            path="/reset-password/:token"
            element={<div>Reset Password</div>}
          />
          <Route
            path="/verify-email/:token"
            element={<div>Verify Email</div>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
