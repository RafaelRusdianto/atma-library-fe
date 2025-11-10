import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./assets/pages/Home/Home";
import Login from "./assets/pages/Login/Login";
import Register from "./assets/pages/Register/Register";
import Catalog from "./assets/pages/Catalog/Catalog";

import Navbar from "./assets/components/NavBar/navbar";
import Footer from "./assets/components/Footer/Footer";

function Layout() {
  const location = useLocation();

  const noFooterPages = ["/login", "/register"];

  const hideFooter = noFooterPages.includes(location.pathname);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
