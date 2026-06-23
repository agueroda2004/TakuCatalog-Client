import ChangeLanguage from "../../auth/components/ChangeLanguage";

export default function CreateStoreHeader() {
  return (
    <header className="flex items-center justify-center w-full py-4 bg-background sticky top-0 z-50">
      <div className="flex items-center gap-2 border-r-2 border-gray-300 pr-4">
        <span
          className="material-symbols-outlined text-primary text-headline-md"
          data-icon="inventory_2"
        >
          inventory_2
        </span>
        <span className="font-Confortaa text-headline-md font-bold text-primary">
          Taku-Catalog
        </span>
      </div>
      <ChangeLanguage />
    </header>
  );
}
