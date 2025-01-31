import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'tailwindcss/tailwind.css';
import { useGetAllUsersQuery } from '../../../../services/users';
import Loader from '../../../loader';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UserStatistics = () => {
  const { data: usersData, isLoading } = useGetAllUsersQuery();

  const users = usersData?.data || [];

  // Count users by role
  const userCounts = {
    mentors: users.filter(user => user.role === 'mentor').length,
    youth: users.filter(user => user.role === 'youth').length,
    employers: users.filter(user => user.role === 'employer').length
  };

  const data = {
    labels: ['Users'],
    datasets: [
      {
        label: 'Mentors',
        data: [userCounts.mentors],
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
      {
        label: 'Youth',
        data: [userCounts.youth],
        backgroundColor: '#FF9800',
        borderColor: '#F57C00',
        borderWidth: 1,
      },
      {
        label: 'Employers',
        data: [userCounts.employers],
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Total Users by Type',
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-4">
          <Bar data={data} options={options} />
        </div>
      )}
    </>
  );
};

export default UserStatistics;
