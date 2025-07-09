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
  const hideLayoutOn = ["/login", "/register", "/dashboard"];
  const shouldHideLayout = hideLayoutOn.includes(location.pathname);

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
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
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
