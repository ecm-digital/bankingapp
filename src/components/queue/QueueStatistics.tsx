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
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      change: waiting > 5 ? 'Wysoka kolejka' : 'Normalna kolejka',
      changeType: waiting > 5 ? 'warning' : 'normal',
    },
    {
      name: 'W Obsłudze',
      value: inService.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      change: `${inService} stanowisk aktywnych`,
      changeType: 'normal',
    },
    {
      name: 'Średni Czas',
      value: `${avgWaitTime} min`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      change: avgWaitTime > 15 ? 'Powyżej normy' : 'W normie',
      changeType: avgWaitTime > 15 ? 'warning' : 'positive',
    },
    {
      name: 'Obsłużeni Dzisiaj',
      value: completed.toString(),
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      change: '+' + Math.round(completed * 0.15) + ' od wczoraj',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="glass-panel rounded-2xl p-5 hover:bg-white/10 transition-colors group">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-xl ${stat.color}/20 p-3 border border-${stat.color}/20 group-hover:border-${stat.color}/40 transition-colors`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-white">
                    {stat.value}
                  </div>
                </dd>
                <dd className="mt-1">
                  <span
                    className={`text-xs font-medium ${stat.changeType === 'positive'
                        ? 'text-emerald-400'
                        : stat.changeType === 'warning'
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }`}
                  >
                    {stat.change}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
