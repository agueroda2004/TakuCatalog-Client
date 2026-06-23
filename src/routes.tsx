import { createBrowserRouter } from "react-router";
import AuthLayout from "./features/auth/Layout/AuthLayout";
import Login from "./features/auth/pages/Login";
import SignUp from "./features/auth/pages/SignUp";
import Verify from "./features/auth/pages/Verify";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import StoreGuard from "./components/guards/StoreGuard";
import CreateStoreLayout from "./features/store/layout/CreateStoreLayout";
import CreateStore from "./features/store/pages/CreateStore";
import Layout from "./components/layout/Layout";
import App from "./App";
import MyStore from "./features/store/pages/MyStore";
import ProductType from "./features/productType/pages/ProductType";
import SubCategory from "./features/subCategory/pages/SubCategory";
import Product from "./features/product/pages/Product";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "verify", element: <Verify /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    path: "/redirect",
    element: (
      <StoreGuard>
        <></>
      </StoreGuard>
    ),
  },
  {
    path: "/create-store",
    element: <CreateStoreLayout />,
    children: [{ index: true, element: <CreateStore /> }],
  },
  {
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "dashboard", element: <App /> },
      { path: "my-store", element: <MyStore /> },
      { path: "product-type", element: <ProductType /> },
      { path: "subcategories", element: <SubCategory /> },
      { path: "products", element: <Product /> },
    ],
  },
]);
