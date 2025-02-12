
import "tailwindcss/tailwind.css";
import Header from "../../../components/secondary/Header";
import Dashboard from "./Dashboard";
import AdminDashboardPage from "./Admin/AdminDashboard";
import { loginDetails } from "../../../utils";
import Chat from "../../../components/secondary/Chat";

const DashboardPage = () => {
  const role = loginDetails()?.user?.role;
  return (
    <>
      <Header pageTitle="Dashboard" />
      {role === 'super' ? <AdminDashboardPage /> : <Dashboard /> }
      {role !== 'super' && <Chat />}
    </>
  );
};

export default DashboardPage;
