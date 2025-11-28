import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./assets/pages/Home/Home";
import Login from "./assets/pages/Login/Login";
import Register from "./assets/pages/Register/Register";
import Catalog from "./assets/pages/Catalog/Catalog";
import BookDetail from "./assets/pages/BookDetail/BookDetail";
import Peminjaman from "./assets/pages/Peminjaman/Peminjaman";

import Navbar from "./assets/components/NavBar/navbar";
import Footer from "./assets/components/Footer/Footer";
import BorrowedHistory from "./assets/pages/BorrowedHistory/BorrowedHistory";
import ProfileDetail from "./assets/pages/ProfileDetail/ProfileDetail";


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
        <Route path="/catalog/book/:id" element={<BookDetail />} />
        <Route path="/catalog/book/:id/peminjaman" element={<Peminjaman />} />
         <Route path="/profile" element={<ProfileDetail />} />
        <Route path="/profile/borrow-history" element={<BorrowedHistory />} />
        {/* <Route path="/profile/fine-history" element={<FinesHistory />} />
        <Route path="/profile/settings" element={<AccountSettings />} /> */}
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
