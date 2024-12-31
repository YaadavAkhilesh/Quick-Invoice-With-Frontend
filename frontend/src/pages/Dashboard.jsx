import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { FileText, Users, CreditCard, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  // Sample data - replace with actual data from your backend
  const stats = [
    { name: 'Total Invoices', value: '156', icon: FileText, change: '+12%' },
    { name: 'Active Customers', value: '32', icon: Users, change: '+3%' },
    { name: 'Total Revenue', value: '₹45,231', icon: CreditCard, change: '+8%' },
    { name: 'Pending Payments', value: '₹12,234', icon: TrendingUp, change: '-2%' },
  ]

  const revenueData = [
    { month: 'Jan', amount: 4000 },
    { month: 'Feb', amount: 3000 },
    { month: 'Mar', amount: 2000 },
    { month: 'Apr', amount: 2780 },
    { month: 'May', amount: 1890 },
    { month: 'Jun', amount: 2390 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center gap-2">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">
                {stat.value}
              </span>
              <span className={`text-sm ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">
            Monthly revenue for the current year
          </p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}