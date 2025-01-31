import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'tailwindcss/tailwind.css';
import { useGetOpportunitiesQuery } from '../../../../services/opportunities';
import Loader from '../../../loader';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const JobOpportunitiesStatistics = () => {
  const { data: opportunitiesData, isLoading } = useGetOpportunitiesQuery();

  const opportunities = opportunitiesData?.data || [];

  // Count opportunities by status
  const opportunityCounts = {
    available: opportunities.filter(opp => opp.status === 'active').length,
    applied: opportunities.filter(opp => opp.status === 'applied').length,
    hired: opportunities.filter(opp => opp.status === 'hired').length,
  };

  const data = {
    labels: ['Job Opportunities'],
    datasets: [
      {
        label: 'Available Jobs',
        data: [opportunityCounts.available],
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
      {
        label: 'Applied Jobs',
        data: [opportunityCounts.applied],
        backgroundColor: '#FF9800',
        borderColor: '#F57C00',
        borderWidth: 1,
      },
      {
        label: 'Hired Jobs',
        data: [opportunityCounts.hired],
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
        text: 'Job Opportunities by Status',
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
        </div>)}
    </>
  );
};

export default JobOpportunitiesStatistics;
