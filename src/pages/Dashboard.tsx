import { Users, CreditCard, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';

export function Dashboard() {
  const stats = [
    {
      name: 'Customers Served',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Transactions Today',
      value: '24',
      change: '+4',
      changeType: 'increase',
      icon: CreditCard,
    },
    {
      name: 'Wait Time',
      value: '8 min',
      change: '-2 min',
      changeType: 'decrease',
      icon: Clock,
    },
    {
      name: 'Monthly Goal',
      value: '78%',
      change: '+12%',
      changeType: 'increase',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Activity overview for {new Date().toLocaleDateString('en-US')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <CardContent className="p-5">
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </dd>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="secondary" className="h-auto p-4 justify-start">
              <Users className="h-6 w-6 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-900">New Customer</span>
            </Button>
            <Button variant="secondary" className="h-auto p-4 justify-start">
              <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-900">New Transfer</span>
            </Button>
            <Button variant="secondary" className="h-auto p-4 justify-start">
              <Clock className="h-6 w-6 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-900">Manage Queue</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity placeholder */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
          <div className="mt-5">
            <p className="text-sm text-gray-500">No recent activities to display.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}