import toast from "react-hot-toast";
import CustomToast from "../CustomToast";

type NotifyProps = {
  message: string;
  success?: boolean;
};

export default function Notify({ message, success }: NotifyProps) {
  return toast.custom((t) => (
    <CustomToast t={t} message={message} success={success} />
  ));
}
