import { Outlet } from "react-router";
import { useStoreStore } from "../../store/useStoreStore";
import { useEffect } from "react";
import i18n from "../../i18n";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const { color, language } = useStoreStore();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <div
      className="flex min-h-screen font-Confortaa text-black/70 "
      style={{ "--color-primary": color } as React.CSSProperties}
    >
      <Sidebar />
      <div className="flex min-h-screen w-full flex-1 flex-col">
        <Header />
        <div className="p-4 md:px-12 py-6 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
