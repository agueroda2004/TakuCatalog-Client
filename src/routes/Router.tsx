import { Route, Routes } from "react-router";
import AuthLayout from "../features/auth/Layout/AuthLayout";
import Login from "../features/auth/pages/Login";
import SignUp from "../features/auth/pages/SignUp";
import Verify from "../features/auth/pages/Verify";
import StoreGuard from "../components/guards/StoreGuard";
import App from "../App";
import CreateStoreLayout from "../features/store/layout/CreateStoreLayout";
import CreateStore from "../features/store/pages/CreateStore";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import Layout from "../components/layout/Layout";
import NotFound from "../features/notFound/Pages/NotFound";
import MyStore from "../features/store/pages/MyStore";

export default function Router() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="verify" element={<Verify />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        path="/redirect"
        element={
          <StoreGuard>
            <></>
          </StoreGuard>
        }
      />

      <Route path="/create-store" element={<CreateStoreLayout />}>
        <Route index element={<CreateStore />} />
      </Route>

      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="my-store" element={<MyStore />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
