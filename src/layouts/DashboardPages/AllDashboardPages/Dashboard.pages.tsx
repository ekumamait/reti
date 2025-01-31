
import "tailwindcss/tailwind.css";
import Header from "../../../components/secondary/Header";
import YouthDashboardPage from "./YouthDashbord";
import AdminDashboardPage from "./Admin/AdminDashboard";
import { loginDetails } from "../../../utils";
import Chat from "../../../components/secondary/Chat";

const DashboardPage = () => {
  const role = loginDetails()?.user?.role;
  return (
    <>
      <Header pageTitle="Dashboard" />
      {role === 'admin' ? <AdminDashboardPage /> : <YouthDashboardPage /> }
      {role !== 'admin' && <Chat />}
    </>
  );
};

export default DashboardPage;
