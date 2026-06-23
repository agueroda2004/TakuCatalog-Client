import { useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Overlay from "../../../components/ui/Overlay";
import Form from "../components/Form";

export default function Product() {
  const [forms, setForms] = useState({
    create: false,
  });

  const handleOpenForm = (
    formName: keyof typeof forms,
    isOpen: boolean,
  ) => {
    setForms((prev) => ({ ...prev, [formName]: isOpen }));
  };

  return (
    <main>
      <PageHeader
        title="product.Products"
        description="product.Manage the products you offer in your store."
        onClick={() => handleOpenForm("create", true)}
      />

      {forms.create && (
        <Overlay>
          <Form onClose={() => handleOpenForm("create", false)} />
        </Overlay>
      )}
    </main>
  );
}