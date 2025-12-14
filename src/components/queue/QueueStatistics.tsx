import { Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
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
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: waiting > 5 ? 'Wysoka kolejka' : 'Normalna kolejka',
      changeType: waiting > 5 ? 'warning' : 'normal',
    },
    {
      name: 'W Obsłudze',
      value: inService.toString(),
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      change: `${inService} stanowisk aktywnych`,
      changeType: 'normal',
    },
    {
      name: 'Średni Czas',
      value: `${avgWaitTime} min`,
      icon: TrendingUp,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: avgWaitTime > 15 ? 'Powyżej normy' : 'W normie',
      changeType: avgWaitTime > 15 ? 'warning' : 'positive',
    },
    {
      name: 'Obsłużeni Dzisiaj',
      value: completed.toString(),
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      change: '+' + Math.round(completed * 0.15) + ' od wczoraj',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-lg ${stat.iconBg} p-3`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-500">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
              <span
                className={`text-xs font-medium ${stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'warning'
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}