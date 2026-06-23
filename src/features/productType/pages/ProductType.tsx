import { useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Overlay from "../../../components/ui/Overlay";
import Form from "../components/Form";
import useProductType from "../hooks/useProductType";
import Dropdown from "../../../components/ui/Dropdown";
import type { ProductType } from "../productType";
import DeleteForm from "../components/DeleteForm";
import { useTranslation } from "react-i18next";

export default function ProductType() {
  const { t: translate } = useTranslation();
  const {
    productTypes,
    pagination,
    isLoadingProductTypes,
    STATUS_OPTIONS,
    filters,
    handleFilterChange,
    handleClearFilters,
    handleApplyFilters,
  } = useProductType();

  const [forms, setForms] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);

  const handleOpenForm = (formName: keyof typeof forms, isOpen: boolean) => {
    setForms((prev) => ({ ...prev, [formName]: isOpen }));
  };

  return (
    <main>
      <PageHeader
        title="productType.Product Types"
        description="productType.Manage the different types of products you offer in your store."
        onClick={() => handleOpenForm("create", true)}
      />

      {/* Begin: Filters */}
      <section className="px-4 py-2 rounded-lg mb-4 border border-gray-200 flex flex-wrap items-center gap-4">
        {/* Begin: Search Filter */}
        <div className="relative grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm border border-gray-200 focus:border-primary/50 outline-none transition-all rounded-lg"
            placeholder={translate("productType.Search by name...")}
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        {/* End: Search Filter */}

        {/* Begin: Status Filter */}
        <div className="flex items-center gap-2 w-full sm:max-w-50">
          <Dropdown
            placeholder={translate("productType.All Status")}
            options={STATUS_OPTIONS}
            onSelect={(value) => handleFilterChange("status", value)}
            selected={filters.status}
          />
        </div>
        {/* End: Status Filter */}

        {/* Begin: Filter Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="flex items-center gap-2 bg-primary text-white font-semibold px-4 h-10 rounded-lg text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-md cursor-pointer justify-center"
            onClick={handleApplyFilters}
          >
            <span className="material-symbols-outlined">filter_list</span>
            {translate("productType.Filter")}
          </button>
          <button
            className="font-semibold px-4 h-10 rounded-lg text-sm bg-gray-100 transition-all hover:bg-gray-200 active:scale-95 cursor-pointer"
            onClick={handleClearFilters}
          >
            {translate("productType.Clear Filters")}
          </button>
        </div>
        {/* End: Filter Buttons */}
      </section>
      {/* End: Filters */}

      {/* Begin: Product Types */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-4">
        {isLoadingProductTypes ? (
          <div className="col-span-full text-center py-10">
            <span className="material-symbols-outlined animate-spin text-gray-400 text-4xl">
              autorenew
            </span>
            <p className="text-gray-500 mt-2">
              {translate("productType.Loading product types...")}
            </p>
          </div>
        ) : productTypes && productTypes.length > 0 ? (
          productTypes.map((type) => (
            <div className="rounded-lg border border-gray-200 hover:border-primary/50 transition-all group overflow-hidden flex flex-col cursor-default">
              <div className="p-4 grow">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 font-bold ${type.active ? "bg-primary/50 text-white" : "bg-gray-100 text-gray-500"} text-[11px] font-bold rounded-full uppercase`}
                  >
                    {type.active
                      ? translate("productType._Active")
                      : translate("productType._Inactive")}
                  </span>
                </div>
                <h3 className="font-headline-md text-on-surface mb-2 transition-colors">
                  {type.name}
                </h3>
                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      inventory_2
                    </span>
                    {translate("productType.totalProducts", {
                      count: type._count.products,
                    })}
                  </div>
                </div>
                <div className="w-full flex items-center justify-end">
                  <button
                    className="mt-4 text-sm font-semibold text-gray-300 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedProductType(type);
                      handleOpenForm("edit", true);
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px] align-middle">
                      edit
                    </span>
                  </button>
                  <button
                    className="mt-4 text-sm font-semibold text-gray-300 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedProductType(type);
                      handleOpenForm("delete", true);
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px] align-middle">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <span className="material-symbols-outlined text-gray-400 text-4xl">
              inventory_2
            </span>
            <p className="text-gray-500 mt-2">
              {translate("productType.No product types found.")}
            </p>
          </div>
        )}
      </section>
      {/* End: Product Types */}

      {/* Begin: Pagination */}
      <footer className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-semibold text-sm">
          {translate("productType.Pagination", {
            total: pagination?.total || 0,
            totalPages: pagination?.totalPages || 0,
          })}
        </span>
        <div className="flex items-center gap-2">
          <button
            className=" min-w-30 px-2 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!pagination?.hasPrevPage}
          >
            {translate("productType.Previous")}
          </button>
          <button
            className="min-w-30 px-2 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!pagination?.hasNextPage}
          >
            {translate("productType.Next")}
          </button>
        </div>
      </footer>
      {/* End: Pagination */}

      {forms.create || forms.edit || forms.delete ? (
        <Overlay>
          {forms.create && (
            <Form onClose={() => handleOpenForm("create", false)} />
          )}
          {forms.edit && (
            <Form
              onClose={() => handleOpenForm("edit", false)}
              selectedProductType={selectedProductType}
            />
          )}
          {forms.delete && (
            <DeleteForm
              onClose={() => handleOpenForm("delete", false)}
              productTypeName={selectedProductType?.name || ""}
              id={selectedProductType?.id || ""}
            />
          )}
        </Overlay>
      ) : null}
    </main>
  );
}
