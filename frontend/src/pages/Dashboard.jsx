import { useQuery } from '@tanstack/react-query'
import { getInvoices, getPayments } from '../services/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });

  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  });

  const stats = [
    { name: 'Total Invoices', value: invoices?.length || 0 },
    { name: 'Pending Payments', value: payments?.filter(p => p.status === 'pending').length || 0 },
    { name: 'Total Revenue', value: `$${payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0}` },
  ]

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold leading-6 text-gray-900">Revenue Overview</h2>
            <p className="mt-2 text-sm text-gray-700">
              A chart showing your revenue over the past 6 months.
            </p>
          </div>
        </div>
        <div className="mt-8 h-[400px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  )
}