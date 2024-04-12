import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";
import Success from "./component/Success";
import Cancel from "./component/Cancel";
import "./index.css";
// import Editor from './component/Editor';
import CheckoutForm from "./component/CheckoutForm";
import YoutuberDashboard from "./component/Youtuber/YoutuberDashboard";
import EditorsList from "./component/Youtuber/EditorsList";
import IntroPage from "./component/IntroPage";
import Pricing from "./component/Pricing";
import EditorDashboard from "./component/Editors/EditorDashboard";
import VideoDetails from "./component/VideoDetails";
import NavbarWrapper from "./component/NavbarWrapper";
import Dashboard from "./component/Admin/Dashboard";
import LocomotiveScroll from "locomotive-scroll";
import ProfileDashboard from "./component/ProfileDashbaord";
import Invoice from "./component/Invoice";
import { BackgroundBeamsDemo } from "./component/UI_Components/Beams";
import Footer from "./component/Footer";
import Contact from "./component/Contact";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooterOnPages = [
    "/youtuber",
    "/editor/dashboard",
    "/youtuber/dashboard",
    "/youtuber/editors",
    "/youtuber/profile",
    "/admin",
  ];

  const shouldHideFooter = hideFooterOnPages.some((path) =>
    location.pathname.includes(path)
  );

  return (
    <>
      <NavbarWrapper /> {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/youtuber" element={<YoutuberDashboard />} />
        <Route path="/youtuber/profile" element={<ProfileDashboard />} />
        {/* <Route path="/youtuber/billing" element={<BackgroundBeamsDemo/>} /> */}
        <Route
          path="/youtuber?authSuccess=true"
          element={<YoutuberDashboard />}
        />
        <Route path="/youtuber/editors" element={<EditorsList />} />
        <Route
          path="/editor/dashboard/:channelId"
          element={<EditorDashboard />}
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/editor/dashboard/:channelId/video/:videoId"
          element={<VideoDetails />}
        />
        <Route
          path="/youtuber/dashboard/:channelId/video/:videoId"
          element={<VideoDetails />}
        />
        <Route
          path="/youtuber/dashboard/:channelId/video/:videoId?authSuccess=true"
          element={<VideoDetails />}
        />
      </Routes>
      <div className="z-10">{!shouldHideFooter && <Footer />}</div>
    </>
  );
}

export default App;
