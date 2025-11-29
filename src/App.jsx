import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./assets/pages/Home/Home";
import Login from "./assets/pages/Login/Login";
import Register from "./assets/pages/Register/Register";
import Catalog from "./assets/pages/Catalog/Catalog";
import BookDetail from "./assets/pages/BookDetail/BookDetail";
import Peminjaman from "./assets/pages/Peminjaman/Peminjaman";
import ManageBooks from "./assets/pages/ManageBooks/ManageBooks";
import CreateNewBook from "./assets/pages/ManageBooks/CreateNewBook/CreateNewBook";
import EditExistingBook from "./assets/pages/ManageBooks/EditExistingBook/EditExistingBook";

import Navbar from "./assets/components/NavBar/navbar";
import Footer from "./assets/components/Footer/Footer";
import BorrowingHistory from "./assets/pages/BorrowingHistory/BorrowingHistory";
import ProfileDetail from "./assets/pages/ProfileDetail/ProfileDetail";
import ProfileLayout from "./assets/pages/ProfileLayout/ProfileLayout";
import Cart from "./assets/pages/Cart/Cart";

function Layout() {
  const location = useLocation();

  const noFooterPages = ["/login", "/register"];

  const hideFooter = noFooterPages.includes(location.pathname);

  return (
    <>
      <Navbar />

       <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/managebooks" element={<ManageBooks />} />
          <Route path="/managebooks/createnewbook" element={<CreateNewBook />} />
          <Route path="/managebooks/editexistingbook" element={<EditExistingBook />} />

          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/book/:id" element={<BookDetail />} />
          <Route path="/catalog/book/:id/peminjaman" element={<Peminjaman />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileDetail />} />
            <Route path="borrowing-history" element={<BorrowingHistory />} />
          </Route>
        </Routes>
      </div>


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
