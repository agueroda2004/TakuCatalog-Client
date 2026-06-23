import { Outlet } from "react-router";
import AuthHeader from "./AuthHeader";

export default function AuthLayout() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative">
      <AuthHeader />
      <Outlet />
    </div>
  );
}
