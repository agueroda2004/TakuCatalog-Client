import { useEffect, useState } from "react";
import InputEmail from "../components/InputEmail";
import { NavLink, useNavigate } from "react-router";
import { useSignIn } from "@clerk/react";
import InputPassword from "../components/InputPassword";
import LoadingSpin from "../../../components/LoadingSpin";
import toast from "react-hot-toast";
import CustomToast from "../../../components/CustomToast";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

type FormErrors = {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
};

export default function ForgotPassword() {
  const { signIn } = useSignIn();
  const nav = useNavigate();
  const { t: translate } = useTranslation();

  const [status, setStatus] = useState<"idle" | "codeSent" | "verified">(
    "idle",
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    } else if (email.length > 100) {
      errors.email = "Email must be less than 100 characters";
    } else if (email.length < 5) {
      errors.email = "Email must be at least 5 characters long";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);
      const { error: createError } = await signIn.create({
        identifier: email,
      });

      if (createError) {
        toast.custom((t) => (
          <CustomToast
            success={false}
            title="Error"
            message="Cuenta no encontrada. Por favor, ingresa una cuenta válida o regístrate."
            t={t}
          />
        ));

        if (import.meta.env.VITE_DEV) {
          console.error(JSON.stringify(createError, null, 2));
        }

        return;
      }

      const { error: sendCodeError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendCodeError) {
        toast.custom((t) => (
          <CustomToast
            success={false}
            title="Error"
            message="No se pudo enviar el código de verificación. Por favor, inténtalo de nuevo."
            t={t}
          />
        ));

        if (import.meta.env.VITE_DEV) {
          console.error(JSON.stringify(sendCodeError, null, 2));
        }

        return;
      }

      setStatus("codeSent");

      toast.custom((t) => (
        <CustomToast
          success={true}
          title="Exito"
          message="El código de verificación ha sido enviado a su correo electrónico."
          t={t}
        />
      ));
    } catch (error) {
      if (import.meta.env.VITE_DEV) {
        console.error("Send code error:", error);
      } else {
        Sentry.captureException(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FormErrors = {};

    if (!code) {
      errors.code = "Code is required";
    } else if (!/^\d{6}$/.test(code)) {
      errors.code = "Code must be a 6-digit number";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({
        code: code,
      });

      if (error) {
        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message={
              "Código inválido. Por favor, verifica el código e inténtalo de nuevo."
            }
          />
        ));

        if (import.meta.env.VITE_DEV) {
          console.error(JSON.stringify(error, null, 2));
        }

        return;
      }

      toast.custom((t) => (
        <CustomToast
          title="Código verificado"
          t={t}
          success={true}
          message={
            "Código verificado correctamente. Ahora puedes establecer una nueva contraseña."
          }
        />
      ));

      setStatus("verified");
    } catch (error) {
      if (import.meta.env.VITE_DEV) {
        console.error("Verify code error:", error);
      } else {
        Sentry.captureException(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (password.length > 100) {
      errors.password = "Password must be less than 100 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);

      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password: password,
        // sign out of all out of all other authenticated sessions
        signOutOfOtherSessions: true,
      });

      if (error) {
        const errorCode = (error as any)?.errors?.[0].code;
        if (errorCode === "form_password_pwned") {
          toast.custom((t) => (
            <CustomToast
              title="Error"
              t={t}
              success={false}
              message={
                "La contraseña es muy débil. Por favor, elige una contraseña más segura."
              }
            />
          ));
          return;
        }

        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message={
              "Error al actualizar la contraseña. Por favor, inténtalo de nuevo."
            }
          />
        ));

        if (import.meta.env.VITE_DEV) {
          console.error(JSON.stringify(error, null, 2));
        }

        return;
      }

      if (signIn.status === "complete") {
        const { error } = await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              if (import.meta.env.VITE_DEV) {
                console.log(session.currentTask);
              }
              return;
            }

            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              nav(url);
            }
          },
        });

        if (error) {
          console.error(JSON.stringify(error, null, 2));
          return;
        }
      } else {
        if (import.meta.env.VITE_DEV) {
          console.error("Unexpected sign-in status:", signIn);
        } else {
          Sentry.captureException(
            new Error("Unexpected sign-in status: " + JSON.stringify(signIn)),
          );
        }
      }
    } catch (error) {
      if (import.meta.env.VITE_DEV) {
        console.error("Update password error:", error);
      } else {
        Sentry.captureException(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) {
        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message={
              "No se pudo enviar el código de verificación. Por favor, inténtalo de nuevo."
            }
          />
        ));
        if (import.meta.env.VITE_DEV) {
          console.error(JSON.stringify(error, null, 2));
        }
        return;
      }
      setCanResend(false);
      setCountdown(60);
    } catch (error) {
      if (import.meta.env.VITE_DEV) {
        console.error("Resend code error:", error);
      } else {
        Sentry.captureException(error);
      }
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (status !== "codeSent") return;
    if (countdown === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, status]);

  return (
    <main className="grow flex items-center justify-center px-margin-mobile md:px-0 pt-16 font-Confortaa">
      <div className="w-full max-w-110 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 px-5">
        {/* Begin of Header */}
        <div className="text-center flex flex-col gap-2 mb-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "30px" }}
              data-icon="person"
            >
              person
            </span>
          </div>
          <h1 className="font-Confortaa text-2xl font-semibold mb-3">
            {translate("forgotPassword.Verify your identity")}
          </h1>
          <p className="text-sm text-gray-500 max-w-[320px] mx-auto">
            {status === "idle" &&
              translate(
                "forgotPassword.Enter your email to receive a verification code.",
              )}
            {status === "codeSent" &&
              translate(
                "forgotPassword.Enter the 6-digit code we sent to your email.",
              )}
            {status === "verified" &&
              translate(
                "forgotPassword.Enter your new password to complete the process.",
              )}
          </p>
        </div>
        {/* End of Header */}

        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-xl">
          {/* Begin of Email Input */}
          {status === "idle" && (
            <form onSubmit={handleSendCode}>
              <InputEmail
                value={email}
                onChange={(email) => setEmail(email)}
                error={formErrors.email}
              />
              <button
                className="w-full h-12 bg-primary text-label-md rounded-lg shadow-md font-HankenGrotesk hover:bg-primary-container active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-white text-md cursor-pointer my-3"
                type="submit"
              >
                <span>
                  {isSubmitting ? (
                    <LoadingSpin color="#FFFFFF" />
                  ) : (
                    translate("forgotPassword.Send Code")
                  )}
                </span>
              </button>
            </form>
          )}
          {/* End of Email Input */}

          {/* Begin of Verification Code Input */}
          {status === "codeSent" && signIn.status !== "needs_new_password" && (
            <form onSubmit={handleVerifyCode}>
              <div className="space-y-2">
                <label className="text-sm text-text-secondary font-Confortaa">
                  {translate("forgotPassword.Verification code")}
                </label>
                <div className="relative group rounded-lg transition-all duration-200 border-gray-300 text-text-secondary border outline-0 focus-within:border-primary">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-black/30 group-focus-within:text-primary">
                    pin
                  </span>

                  <input
                    className="w-full h-12 pl-11 pr-4 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-black/30 outline-none font-Confortaa tracking-[0.5em]"
                    id="code"
                    name="code"
                    placeholder="000000"
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-gray-400 italic ml-1">
                  {translate(
                    "forgotPassword.Enter the 6-digit code we sent to your email.",
                  )}
                </p>
                {formErrors.code ? (
                  <span className="text-sm text-red-500 font-Confortaa">
                    {formErrors.code}
                  </span>
                ) : null}
              </div>

              <button
                className="w-full h-12 bg-primary text-label-md rounded-lg shadow-md font-HankenGrotesk hover:bg-primary-container active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-white text-md cursor-pointer my-3"
                type="submit"
              >
                {isSubmitting ? (
                  <LoadingSpin color="#FFFFFF" />
                ) : (
                  translate("forgotPassword.Verify Code")
                )}
              </button>
            </form>
          )}
          {/* End of Verification Code Input */}

          {/* Begin of New Password Input */}
          {signIn.status === "needs_new_password" && status === "verified" && (
            <form onSubmit={handleSubmitNewPassword}>
              <InputPassword
                title="Password"
                icon="lock"
                value={password}
                onChange={(password) => setPassword(password)}
                error={formErrors.password}
              />
              <InputPassword
                title="Confirm password"
                icon="lock_reset"
                value={confirmPassword}
                onChange={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
                error={formErrors.confirmPassword}
              />
              <button
                className="w-full h-12 bg-primary text-label-md rounded-lg shadow-md font-HankenGrotesk hover:bg-primary-container active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-white text-md cursor-pointer my-3"
                type="submit"
              >
                {isSubmitting ? (
                  <LoadingSpin color="#FFFFFF" />
                ) : (
                  <span>{translate("forgotPassword.Update")}</span>
                )}
              </button>
            </form>
          )}
          {/* End of New Password Input */}

          {/* Begin of Back to Login Link */}
          <NavLink
            to={"/auth/login"}
            className="w-full h-12 border border-gray-300 text-on-primary text-label-md rounded-lg font-HankenGrotesk hover:bg-primary-container active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-black/70 text-md cursor-pointer"
          >
            <span>{translate("forgotPassword.Back to Login")}</span>
          </NavLink>
          {/* End of Back to Login Link */}

          {/* Begin of Resend Code */}
          <div
            className={`${status === "codeSent" ? "border-t border-gray-200 mt-5 text-center pt-5" : ""}`}
          >
            {status === "codeSent" &&
              (canResend ? (
                <button
                  type="button"
                  className="text-primary font-bold hover:underline focus:outline-none px-1 transition-all cursor-pointer text-xs"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending
                    ? translate("forgotPassword.Sending...")
                    : translate("forgotPassword.Resend Code")}
                </button>
              ) : (
                <p className="text-xs text-gray-500">
                  {translate("forgotPassword.Didn't receive the code?")}{" "}
                  <span className="text-primary font-bold">
                    {translate("forgotPassword.Resend in")} {countdown}s
                  </span>
                </p>
              ))}
          </div>
          {/* End of Resend Code */}
        </div>
      </div>
    </main>
  );
}
