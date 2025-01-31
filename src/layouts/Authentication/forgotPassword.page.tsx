import { Layout } from "antd";
import viteLogo from "/images/undraw_business_chat_re_gg4h.svg";
import ForgotPasswordForm from "../../components/secondary/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <Layout className="h-screen">
      <div className="my-auto sm:mx-auto sm:w-full sm:max-w-md sm:bg-white sm:border sm:rounded-[12px] px-4 py-4">
        <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-24 w-auto"
              src={viteLogo}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Change password
            </h2>

            <p className="mt-2 text-sm text-center text-gray-900">
              Enter a new password below to change your password
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
