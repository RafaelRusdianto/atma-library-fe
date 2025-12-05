import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./assets/pages/Home/Home";
import Login from "./assets/pages/Login/Login";
import Register from "./assets/pages/Register/Register";
import Catalog from "./assets/pages/Catalog/Catalog";
import BookDetail from "./assets/pages/BookDetail/BookDetail";
import Peminjaman from "./assets/pages/Peminjaman/Peminjaman";
import ManageBooks from "./assets/pages/ManageBooks/ManageBooks";
import CreateNewBook from "./assets/pages/ManageBooks/CreateNewBook/CreateNewBook";
import EditExistingBook from "./assets/pages/ManageBooks/EditExistingBook/EditExistingBook";
import MemberList from "./assets/pages/MemberList/MemberList";
import Support from "./assets/pages/Support/Support";
import Reports from "./assets/pages/Reports/reports";

import Navbar from "./assets/components/NavBar/navbar";
import Footer from "./assets/components/Footer/Footer";
import BorrowingHistory from "./assets/pages/BorrowingHistory/BorrowingHistory";
import ProfileDetail from "./assets/pages/ProfileDetail/ProfileDetail";
import ProfileLayout from "./assets/pages/ProfileLayout/ProfileLayout";
import Cart from "./assets/pages/Cart/Cart";
import OnGoing from "./assets/pages/OnGoing/OnGoing";
import BorrowRequest from "./assets/pages/BorrowRequest/Borrowrequest"; 
import FineHistory from "./assets/pages/FineHistory/FineHistory";
import Fines from "./assets/pages/Fines/Fines";
import RequireRole from "./context/requireableRole";
function Layout() {
  const location = useLocation();

  const noFooterPages = ["/login", "/register"];
  const hideFooter = noFooterPages.includes(location.pathname);

  return (
    <>
      <Navbar />

      <div>
        <Routes>
          {/* route umum */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/book/:id" element={<BookDetail />} />
          <Route path="/catalog/book/:id/peminjaman" element={<Peminjaman />} />

          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileDetail />} />
          </Route>

          {/* Khusus member */}
          <Route element={<RequireRole allowed={["member"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/on-going" element={<OnGoing />} />
            <Route path="/fines" element={<Fines />} />
            <Route path="/profile/borrowing-history" element={<BorrowingHistory />} />
            <Route path="/profile/fine-history" element={<FineHistory />} />
          </Route>

          {/* Khusus petugas */}
          <Route element={<RequireRole allowed={["petugas"]} />}>
            <Route path="/managebooks" element={<ManageBooks />} />
            <Route path="/managebooks/createnewbook" element={<CreateNewBook />} />
            <Route path="/managebooks/editexistingbook" element={<EditExistingBook />} />
            <Route path="/borrow-requests" element={<BorrowRequest />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/members" element={<MemberList />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
