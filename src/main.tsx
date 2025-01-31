import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  LoaderFunctionArgs,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store.ts";
import "./index.css";
import ErrorPage from "./layouts/error.page.tsx";
import { ConfigProvider } from "antd";
import CustomAppLayout from "./components/secondary/CustomAppLayout.tsx";
import DashboardPage from "./layouts/DashboardPages/Dashboard.page.tsx";
import ForgotPasswordPage from "./layouts/Authentication/forgotPassword.page.tsx";
import "./index.css";
import ResetPasswordPage from "./layouts/Authentication/resetPassword.page.tsx";
import ResetPasswordLinkPage from "./layouts/Authentication/resetPasswordLink.page.tsx";
import RegisterPage from "./layouts/Authentication/register.page.tsx";
import MessagesPage from "./layouts/DashboardPages/Messaging/Messages.page.tsx";
import LoginPage from "./layouts/Authentication/Login.page.tsx";
import Onboarding from "./layouts/OnboardingPages/Onboarding.tsx";
import SuccessOnboardPage from "./layouts/OnboardingPages/OnboardSuccessPage.tsx";
import SettingsPage from "./layouts/DashboardPages/Settings/Settings.page.tsx";
import OpportunitiesPage from "./layouts/DashboardPages/Opportunities/Opportunities.page.tsx";
import OpportunitiesDetailsPage from "./layouts/DashboardPages/Opportunities/OpportuntiesDetailsPage.tsx";
import UsersPage from "./layouts/DashboardPages/Users/UsersTable.tsx";
import ProductsPage from "./layouts/DashboardPages/Products/Products.page.tsx";
import ProductDetailsPage from "./layouts/DashboardPages/Products/ProductDetails.page.tsx";
import UsersDetailsPage from "./layouts/DashboardPages/Users/UsersDetails.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileSettings from "./layouts/DashboardPages/Settings/Profile.tsx";

function protectedLoader({ request }: LoaderFunctionArgs) {
  const loginDetails = localStorage.getItem("loginDetails");
  if (!loginDetails) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}
function protectedOnBoardingLoader() {
  const loginDetails = localStorage.getItem("loginDetails");
  if (!loginDetails) {
    return redirect("/login");
  }
  return null;
}

async function loginLoader() {
  const loginDetails = localStorage.getItem("loginDetails");
  if (loginDetails) {
    return redirect("/");
  }
  return null;
}
// async function registerLoader() {
//   const userDetails = localStorage.getItem("userDetails");
//   if (userDetails) {
//     return redirect("onboarding");
//   }
//   return null;
// }


const router = createBrowserRouter([
  {
    path: "/",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <DashboardPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/opportunities",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <OpportunitiesPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/opportunities/:id",
    element: (
      <CustomAppLayout>
        <OpportunitiesDetailsPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
  },


  {
    path: "/messages",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <MessagesPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/settings",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <SettingsPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/products",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <ProductsPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/products/:id",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <ProductDetailsPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "/users",
    loader: protectedLoader,
    element: (
      <CustomAppLayout>
        <UsersPage />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: "/users/:userId",
    element: (
      <CustomAppLayout>
        <ProfileSettings />
      </CustomAppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    loader: loginLoader,
    errorElement: <ErrorPage />,
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    loader: loginLoader,
    errorElement: <ErrorPage />,
    element: <ResetPasswordPage />,
  },
  {
    path: "/reset-password-link",
    loader: loginLoader,
    errorElement: <ErrorPage />,
    element: <ResetPasswordLinkPage />,
  },
  {
    path: "/register",
    // loader: registerLoader,
    errorElement: <ErrorPage />,
    element: <RegisterPage />,
  },
  {
    path: "/login",
    loader: loginLoader,
    errorElement: <ErrorPage />,
    element: <LoginPage />,
  },
  {
    path: "/onboarding",
    loader: protectedOnBoardingLoader,
    errorElement: <ErrorPage />,
    element: <Onboarding />,
  },

  {
    path: "/onboard-success",
    loader: protectedOnBoardingLoader,
    errorElement: <ErrorPage />,
    element: <SuccessOnboardPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5b9bd5",
            // fontFamily: "Roboto !important"
          },
          components: {
            Layout: {
              headerBg: "#5b9bd5",
            },
          },
        }}
      >
        <RouterProvider router={router} />
        <ToastContainer position="top-center" />
      </ConfigProvider>
    </React.StrictMode>
  </Provider>
);
