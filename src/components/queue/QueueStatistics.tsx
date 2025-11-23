import { Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { QueueItem } from '@/types';

interface QueueStatisticsProps {
  queueItems: QueueItem[];
}

export function QueueStatistics({ queueItems }: QueueStatisticsProps) {
  const waiting = queueItems.filter(item => item.status === 'WAITING').length;
  const inService = queueItems.filter(item => item.status === 'IN_SERVICE').length;
  const completed = queueItems.filter(item => item.status === 'COMPLETED').length;
  
  const avgWaitTime = waiting > 0
    ? Math.round(
        queueItems
          .filter(item => item.status === 'WAITING')
          .reduce((sum, item) => sum + item.estimatedTime, 0) / waiting
      )
    : 0;

  const stats = [
    {
      name: 'Oczekujący',
      value: waiting.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: waiting > 5 ? 'Wysoka kolejka' : 'Normalna kolejka',
      changeType: waiting > 5 ? 'warning' : 'normal',
    },
    {
      name: 'W Obsłudze',
      value: inService.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      change: `${inService} stanowisk aktywnych`,
      changeType: 'normal',
    },
    {
      name: 'Średni Czas',
      value: `${avgWaitTime} min`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: avgWaitTime > 15 ? 'Powyżej normy' : 'W normie',
      changeType: avgWaitTime > 15 ? 'warning' : 'positive',
    },
    {
      name: 'Obsłużeni Dzisiaj',
      value: completed.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+' + Math.round(completed * 0.15) + ' od wczoraj',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                  <dd className="mt-1">
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : stat.changeType === 'warning'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
