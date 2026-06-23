import React from "react";

type OverlayProps = {
  children?: React.ReactNode;
};

export default function Overlay({ children }: OverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm"
      id="create-modal"
    >
      {children}
    </div>
  );
}
