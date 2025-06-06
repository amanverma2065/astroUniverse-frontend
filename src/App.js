import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import UserLogin from "./pages/auth/UserLogin";
import UserSignup from "./pages/auth/UserSignup";
import AstrologerLogin from "./pages/auth/AstrologerLogin";
import AstrologerSignup from "./pages/auth/AstrologerSignup";
import VerifyOtp from "./pages/VerifyOtp";
import ResetEmail from "./pages/ResetEmail";
import ResetPassword from "./pages/ResetPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import Navbar from "../src/components/Navbar";
import AllAstrologers from "./pages/AllAstrologers";
import ChatWithAstrologer from "./pages/ChatWithAstrologer";
import AdminHome from "./pages/AdminHome";
import AstrologerRequest from "./pages/AstrologerRequest";
import AllUsers from "./pages/AllUsers";

import { useAppContext } from "./context/AppContext";
import { UserRoute, AdminRoute, AstrologerRoute } from "./pages/auth/ProtectedRoutes";
import HomeAstrologers from "./pages/HomeAstrologers";
import AstrologerDetail from "./pages/AstrologerDetail";
import Profile from "./pages/Profile";
import AstrologerProfile from "./pages/AstrologerProfile";
import ChatWithClient from "./pages/ChatWithClient";


function App() {
  const { admin } = useAppContext(); // don't forget to call the hook as a function

  return (
    <>
      {admin ? null : <Navbar />}

      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/astrologer-login" element={<AstrologerLogin />} />
        <Route path="/astrologer-signup" element={<AstrologerSignup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-email" element={<ResetEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/home-astrologer" element={<HomeAstrologers />} />
        <Route path="/astrologer-detail/:id" element={<AstrologerDetail />} />

        {/* Protected user route */}
        <Route path="/chat-with-astrologer" element={
          <UserRoute>
            <ChatWithAstrologer />
          </UserRoute>
        } />
        <Route path="/profile" element={
          <UserRoute>
            <Profile />
          </UserRoute>
        } />

        {/* Protected astrologer route */}
        <Route path="/astrologer-profile" element={
          <AstrologerRoute>
            <AstrologerProfile />
          </AstrologerRoute>
        } />
        <Route path="/chat-with-client" element={
          <AstrologerRoute>
            <ChatWithClient />
          </AstrologerRoute>
        } />

        {/* Protected admin layout with nested routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        }>
          <Route index element={<AllUsers />} />
          <Route path="all-astrologers" element={<AllAstrologers />} />
          <Route path="astrologer-request" element={<AstrologerRequest />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
