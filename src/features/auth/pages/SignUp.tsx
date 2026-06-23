import { NavLink } from "react-router";
import AuthButton from "../components/AuthButton";
import GoogleButton from "../components/GoogleButton";
import InputEmail from "../components/InputEmail";
import InputPassword from "../components/InputPassword";
import { useSignUp } from "@clerk/react";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomToast from "../../../components/CustomToast";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

type FormSignUpErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type user = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validateForm = (user: user) => {
  const errors: FormSignUpErrors = {};

  if (!user.name.trim()) {
    errors.name = "Full name is required";
  } else if (user.name.trim().length < 3) {
    errors.name = "Full name must be at least 3 characters long";
  } else if (user.name.trim().length > 100) {
    errors.name = "Full name must not exceed 100 characters";
  }

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

  if (user.password !== user.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

export default function SignUp() {
  const { t: translate } = useTranslation();
  const [formErrors, setFormErrors] = useState<FormSignUpErrors>({});
  const [user, setUser] = useState<user>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useSignUp();

  const clearForm = () => {
    setUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm(user);

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setIsLoading(true);

      const { error: createError } = await signUp.create({
        emailAddress: user.email,
        firstName: user.name,
        password: user.password,
      });

      if (createError) {
        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message="No se pudo crear la cuenta, vuelve a intentarlo."
          />
        ));
        return;
      }

      const protocol = window.location.protocol;
      const host = window.location.host;

      const { error: sendError } = await signUp.verifications.sendEmailLink({
        verificationUrl: `${protocol}//${host}/redirect`,
      });

      if (sendError) {
        toast.custom((t) => (
          <CustomToast
            title="Error"
            t={t}
            success={false}
            message="No se pudo enviar el link de verificación, vuelve a intentarlo."
          />
        ));
        return;
      }

      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Success"
          message="Your account has been created. Please check your email to verify your account."
          success={true}
        />
      ));
      clearForm();
    } catch (error) {
      if (import.meta.env.VITE_DEV) {
        console.error("Error during sign up:", error);
      } else {
        Sentry.captureException(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="grow flex items-center justify-center px-container-padding-mobile py-stack-lg min-h-screen my-10 sm:my-0">
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
          <h1 className="text-xl font-Confortaa font-bold text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background">
            {translate("signup.Create an Account")}
          </h1>
          <p className="text-black/80 font-Confortaa text-sm">
            {translate("signup.signup To Manage")}
          </p>
        </div>
        {/* End of Header */}

        {/* Begin of Form */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-xl">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-sm text-text-secondary font-Confortaa">
                {translate("signup.Full Name")}
              </label>
              <div className="relative group rounded-lg transition-all duration-200 border-gray-300 text-text-secondary border outline-0 focus-within:border-primary">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-black/30 group-focus-within:text-primary"
                  data-icon="person"
                >
                  person
                </span>
                <input
                  className="w-full h-12 pl-11 pr-4 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-black/30 outline-none font-Confortaa"
                  id="full_name"
                  max={100}
                  placeholder={translate("signup.Name Placeholder")}
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              {formErrors.name ? (
                <span className="text-sm text-red-500 font-Confortaa">
                  {formErrors.name}
                </span>
              ) : null}
            </div>

            <InputEmail
              value={user.email}
              onChange={(email) => setUser({ ...user, email })}
              error={formErrors.email}
            />

            <InputPassword
              title={"Password"}
              icon="lock"
              value={user.password}
              onChange={(password) => setUser({ ...user, password })}
              error={formErrors.password}
            />
            <InputPassword
              title={"Confirm Password"}
              icon="lock_reset"
              value={user.confirmPassword}
              onChange={(confirmPassword) =>
                setUser({ ...user, confirmPassword })
              }
              error={formErrors.confirmPassword}
            />

            <div id="clerk-captcha" />

            <AuthButton text="Sign Up" isLoading={isLoading} />

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="grow border-t border-gray-300"></div>
              <span className="px-3 font-label-sm text-gray-300">
                {translate("signup.or")}
              </span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <GoogleButton />
          </form>
        </div>
        {/* End of Form */}

        {/* Begin of Sign in link */}
        <div className="text-center mt-6">
          <p className="font-Confortaa text-sm font-normal text-text-secondary">
            {translate("signup.Already have an account?")}{" "}
            <NavLink
              className="text-primary font-md font-Confortaa"
              to="/auth/login"
            >
              {translate("signup.Sign in here.")}
            </NavLink>
          </p>
        </div>
        {/* End of Sign in link */}
      </div>
    </main>
  );
}
