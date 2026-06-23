import { NavLink } from "react-router";

export default function Sidebar() {
  return (
    <div className="w-52 h-screen border-r border-gray-200 hidden md:flex sticky top-0 left-0">
      <NavLink
        className="flex items-center gap-md px-md py-sm rounded-lg bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-semibold active:scale-95 transition-transform"
        to="my-store"
      >
        <span className="material-symbols-outlined active-nav-item">
          settings
        </span>
        <span className="font-body-md text-body-md">Settings</span>
      </NavLink>
    </div>
  );
}
