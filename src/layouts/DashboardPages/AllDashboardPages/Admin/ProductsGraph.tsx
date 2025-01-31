import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'tailwindcss/tailwind.css';
import { useGetProductsQuery } from '../../../../services/products';
import Loader from '../../../loader';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ProductStockStatistics = () => {
  const { data: productsData, isLoading } = useGetProductsQuery();

  const products = productsData?.data || [];

  // Count products by stock status
  const productCounts = {
    inStock: products.filter(product => product.stockQuantity >= 100).length,
    outOfStock: products.filter(product => product.stockQuantity === 0).length,
    lowStock: products.filter(product => product.stockQuantity > 0 && product.stockQuantity < 100).length,
  };

  const data = {
    labels: ['Product Stock'],
    datasets: [
      {
        label: 'In Stock',
        data: [productCounts.inStock],
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
      {
        label: 'Out of Stock',
        data: [productCounts.outOfStock],
        backgroundColor: '#FF3300',
        borderColor: '#CC2900',
        borderWidth: 1,
      },
      {
        label: 'Low Stock',
        data: [productCounts.lowStock],
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
        text: 'Product Stock Status',
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

export default ProductStockStatistics;
