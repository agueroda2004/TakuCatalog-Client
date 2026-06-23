import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useStore from "../../features/store/hooks/useStore";
import VerifyStoreExists from "../../features/auth/components/VerifyStoreExists";
import { useStoreStore } from "../../store/useStoreStore";

export default function StoreGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const { hasStore } = useStore();
  const { setStoreData } = useStoreStore();

  useEffect(() => {
    const check = async () => {
      try {
        const hasStoreResult = await hasStore();

        console.log("hasStoreResult", hasStoreResult);

        if (hasStoreResult.hasStore) {
          setStoreData({
            ...hasStoreResult.store!,
          });

          nav("/dashboard", { replace: true });
        } else {
          nav("/create-store", { replace: true });
        }
      } catch {
        nav("/error", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    check();
  }, []);

  if (checking) return <VerifyStoreExists />;

  return <>{children}</>;
}
