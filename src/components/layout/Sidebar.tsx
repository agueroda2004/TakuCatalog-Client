import { NavLink } from "react-router";
import { useStoreStore } from "../../store/useStoreStore";
import { useTranslation } from "react-i18next";
import { useClerk } from "@clerk/react";
import toast from "react-hot-toast";
import CustomToast from "../CustomToast";
import { useState } from "react";
import { logError } from "../../utils/logError";
import LoadingSpin from "../LoadingSpin";

const NAV_LINKS = [
  { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { name: "Products Types", icon: "inventory_2", href: "/product-type" },
  { name: "Subcategories", icon: "category", href: "/subcategories" },
  { name: "Products", icon: "steps", href: "/products" },
  { name: "Settings", icon: "settings", href: "/my-store" },
];

export default function Sidebar() {
  const { logo, name } = useStoreStore();
  const { t: translate } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      await signOut({ redirectUrl: "/auth/login" });
    } catch (error) {
      logError(error, "Failed to log out");

      toast.custom((t) => (
        <CustomToast
          t={t}
          message={translate("sidebar.Failed to log out. Please try again.")}
          title="Error"
          success={false}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="h-screen w-64 sticky left-0 top-0 bg-surface border-r border-gray-200 flex-col hidden md:flex">
      {/* Begin: Logo and Store Name */}
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 w-full h-20 px-4">
        <img
          src={logo?.url}
          alt="Store Logo"
          className="size-16 rounded-full object-contain shadow"
        />
        <span className="font-semibold text-md">{name || "Taku Catalog"}</span>
      </div>
      {/* End: Logo and Store Name */}

      {/* Begin: Navigation Links */}
      <nav className="grow space-y-1 px-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            className={({ isActive }) =>
              `transition-all duration-200 rounded-lg mx-2 p-3 flex items-center gap-2 group text-sm ${isActive ? "bg-primary text-white translate-x-2" : "hover:bg-primary/10 translate-x-1"} `
            }
            to={link.href}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="font-body-md">
              {translate(`sidebar.${link.name}`)}
            </span>
          </NavLink>
        ))}
      </nav>
      {/* End: Navigation Links */}

      {/* Begin: Sign Out */}
      <div className="px-4 border-t border-gray-200 py-4">
        <button
          className="text-red-500 bg-red-50 w-full hover:bg-red-100 hover:translate-x-1 transition-all duration-200 rounded-lg mb-4 px-4 py-3 flex items-center gap-3 group cursor-pointer"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpin color="#ff0000" />
          ) : (
            <span className="material-symbols-outlined">logout</span>
          )}
          <span className="font-semibold">{translate("sidebar.Log Out")}</span>
        </button>
      </div>
      {/* End: Sign Out */}
    </aside>
  );
}
