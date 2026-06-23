import InputPassword from "../components/InputPassword";
import InputEmail from "../components/InputEmail";
import RememberMe from "../components/RememberMe";
import ForgotPassword from "../components/ForgotPassword";
import AuthButton from "../components/AuthButton";
import GoogleButton from "../components/GoogleButton";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useSignIn } from "@clerk/react";
import CustomToast from "../../../components/CustomToast";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

type FormLoginErrors = {
  email?: string;
  password?: string;
};

type User = {
  email: string;
  password: string;
};

const validateForm = (user: User) => {
  const errors: FormLoginErrors = {};

  if (!user.email.trim()) {
    errors.email = "Email is required";
  } else if (user.email.trim().length < 2) {
    errors.email = "Email must be at least 2 characters long";
  } else if (user.email.trim().length > 100) {
    errors.email = "Email must not exceed 100 characters";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!user.password.trim()) {
    errors.password = "Password is required";
  } else if (user.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (user.password.trim().length > 100) {
    errors.password = "Password must not exceed 100 characters";
  }

  return errors;
};

export default function Login() {
  const { t: translate } = useTranslation();

  const [formErrors, setFormErrors] = useState<FormLoginErrors>({});
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true" || false,
  );
  const { signIn } = useSignIn();
  const nav = useNavigate();

  const [user, setUser] = useState<User>({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRememberMeChange = (value: boolean) => {
    setRememberMe(value);
    localStorage.setItem("rememberMe", String(value));
    if (!value) {
      localStorage.removeItem("rememberedEmail");
    } else {
      localStorage.setItem("rememberedEmail", user.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const errors = validateForm(user);

      setFormErrors(errors);

      if (Object.keys(errors).length > 0) return;

      const { error } = await signIn.password({
        emailAddress: user.email,
        password: user.password,
      });

      if (error) {
        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message={"Credenciales inválidas o cuenta no verificada."}
          />
        ));
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/redirect");
            nav(url);
          },
        });
      }
    } catch (error) {
      if (import.meta.env.VITE_DEV) {
        console.error("Login error:", error);
      } else {
        Sentry.captureException(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="grow flex items-center justify-center px-container-padding-mobile py-stack-lg">
      <div className="w-full max-w-110 flex flex-col gap-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700 px-5">
        {/* Begin of Header */}
        <div className="text-center flex flex-col gap-2 mb-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-base">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "30px" }}
              data-icon="person"
            >
              person
            </span>
          </div>
          <h1 className="text-2xl font-Confortaa font-bold text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background">
            {translate("login.welcome Back")}
          </h1>
          <p className="text-black/80 font-Confortaa text-sm">
            {translate("login.signin To Manage")}
          </p>
        </div>
        {/* End of Header */}

        {/* Begin of Form */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-xl">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <InputEmail
              value={user.email}
              onChange={(email) => setUser({ ...user, email: email })}
              error={formErrors.email}
            />
            <InputPassword
              value={user.password}
              onChange={(password) => setUser({ ...user, password: password })}
              icon="lock"
              title="Password"
              error={formErrors.password}
            />
            <div className="flex items-center justify-between py-1 mb-6">
              <RememberMe value={rememberMe} onClick={handleRememberMeChange} />
              <ForgotPassword />
            </div>

            <AuthButton text="Login" isLoading={isLoading} />

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="grow border-t border-gray-300"></div>
              <span className="px-3 font-label-sm text-gray-300">
                {translate("login.or")}
              </span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <GoogleButton />
          </form>
        </div>
        {/* End of Form */}

        {/* Begin of Sign up link */}
        <div className="text-center mt-6">
          <p className="font-Confortaa text-sm font-normal text-text-secondary">
            {translate("login.Don't have an account?")}{" "}
            <NavLink
              className="text-primary font-md font-Confortaa"
              to="/auth/sign-up"
            >
              {translate("login.Sign up here.")}
            </NavLink>
          </p>
        </div>
        {/* End of Sign up link */}
      </div>
    </main>
  );
}
