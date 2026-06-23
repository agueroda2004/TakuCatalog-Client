import { Outlet } from "react-router";
import CreateStoreHeader from "./CreateStoreHeader";

export default function CreateStoreLayout() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative items-center">
      <CreateStoreHeader />
      <div className="grow flex items-center justify-center px-4 text-black/70 font-Confortaa flex-col gap-5 max-w-120 py-10 pb-20">
        <Outlet />
      </div>
    </div>
  );
}
