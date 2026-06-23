import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function ForgotPassword() {
  const { t: translate } = useTranslation();

  return (
    <NavLink
      to="/auth/forgot-password"
      className="font-Confortaa text-sm text-primary cursor-pointer hover:underline text-center"
    >
      {translate("login.Forgot Password?")}
    </NavLink>
  );
}
