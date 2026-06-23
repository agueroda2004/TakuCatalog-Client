import { useClerk, useSignUp } from "@clerk/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import CustomToast from "../../../components/CustomToast";
import LoadingSpin from "../../../components/LoadingSpin";
import { useTranslation } from "react-i18next";

export default function Verify() {
  const { t: translate } = useTranslation();
  const { handleEmailLinkVerification, loaded } = useClerk();
  const { signUp } = useSignUp();
  const nav = useNavigate();
  const [status, setStatus] = useState<"loading" | "expired" | "error">(
    "loading",
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function verify() {
      // Flag to avoid showing an error toast if the component is still loading the Clerk instance
      if (!loaded) return;

      handleEmailLinkVerification({
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      }).catch((err) => {
        console.error(err);
        if (err?.code === "expired") {
          setStatus("expired");
        } else {
          setStatus("error");
        }
      });
    }

    verify();
  }, [loaded, handleEmailLinkVerification]);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      const protocol = window.location.protocol;
      const host = window.location.host;
      const { error: sendLinkError } = await signUp.verifications.sendEmailLink(
        {
          verificationUrl: `${protocol}//${host}/auth/verify`,
        },
      );

      if (sendLinkError) {
        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message={translate("verify.Failed To Send Link")}
          />
        ));
        nav("/auth/sign-up");
        return;
      }

      toast.custom((t) => (
        <CustomToast
          title="Exito!"
          t={t}
          success={true}
          message={translate("verify.New Link Sent")}
        />
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="grow flex items-center justify-center min-h-screen gap-2">
        <p className="font-Confortaa text-primary text-2xl">{translate("verify.Verifying")}</p>
        <LoadingSpin size={32} />
      </main>
    );
  }

  if (status === "expired") {
    return (
      <main className="grow flex items-center justify-center min-h-screen">
        <div className="text-center flex flex-col gap-4">
          <span
            className="material-symbols-outlined text-primary mx-auto"
            style={{ fontSize: "48px" }}
          >
            timer_off
          </span>
          <h2 className="font-Confortaa font-bold text-xl text-black/80">
            {translate("verify.Link Expired")}
          </h2>
          <p className="font-Confortaa text-sm text-black/60">
            {translate("verify.Link No Longer Valid")}
          </p>

          <button
            className="text-white font-Confortaa text-sm disabled:opacity-50 border h-15 rounded-lg bg-primary hover:scale-105 active:scale-100 transition-transform cursor-pointer px-4"
            disabled={isLoading}
            onClick={handleResend}
          >
            {isLoading ? (
              <LoadingSpin size={36} color="#FFFFFF" />
            ) : (
              translate("verify.Resend Link")
            )}
          </button>
        </div>
      </main>
    );
  }

  // status === "error"
  return (
    <main className="grow flex items-center justify-center min-h-screen">
      <div className="text-center flex flex-col gap-4">
        <span
          className="material-symbols-outlined text-red-500 mx-auto"
          style={{ fontSize: "48px" }}
        >
          error
        </span>
        <h2 className="font-Confortaa font-bold text-xl">{translate("verify.Invalid Link")}</h2>
        <p className="font-Confortaa text-sm text-black/60">
          {translate("verify.Link No Longer Valid")}
        </p>
        <button
          className="text-white font-Confortaa text-sm disabled:opacity-50 border h-15 rounded-lg bg-primary hover:scale-105 active:scale-100 transition-transform cursor-pointer px-4"
          disabled={isLoading}
          onClick={() => nav("/auth/sign-up")}
        >
          {translate("verify.Sign Up Again")}
        </button>
      </div>
    </main>
  );
}
