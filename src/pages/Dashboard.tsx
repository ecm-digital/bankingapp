import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useQueueStore } from '@/stores/queueStore';
import { QueueItem } from '@/types';

export default function Dashboard() {
  const { transactions } = useTransactionsStore();
  const { queueItems } = useQueueStore();
  
  // Calculate queue stats
  const queueStats = {
    waiting: queueItems.filter(item => item.status === 'WAITING').length,
    served: queueItems.filter(item => item.status === 'COMPLETED').length,
    averageWaitTime: queueItems.length > 0 
      ? Math.round(queueItems.reduce((sum, item) => sum + item.estimatedTime, 0) / queueItems.length)
      : 0,
  };

  // Oblicz statystyki
  const todayTransactions = (transactions || []).slice(0, 5);
  const totalDeposits = (transactions || [])
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = (transactions || [])
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      name: 'Obsłużeni klienci',
      value: queueStats?.served || 24,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Wpłaty dzisiaj',
      value: `${(totalDeposits / 1000).toFixed(1)}k PLN`,
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ArrowDownLeft,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      name: 'Wypłaty dzisiaj',
      value: `${(totalWithdrawals / 1000).toFixed(1)}k PLN`,
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: ArrowUpRight,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      name: 'Śr. czas obsługi',
      value: `${queueStats?.averageWaitTime || 8} min`,
      change: '-2 min',
      changeType: 'positive' as const,
      icon: Clock,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Zakończona
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="h-3 w-3" />
            Oczekująca
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" />
            Odrzucona
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Wpłata';
      case 'WITHDRAWAL': return 'Wypłata';
      case 'TRANSFER': return 'Przelew';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pulpit</h1>
          <p className="text-slate-500 mt-1">Przegląd działań i statystyk oddziału</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          <span>Ostatnia aktualizacja: {new Date().toLocaleTimeString('pl-PL')}</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <span className={`inline-flex items-center text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Ostatnie transakcje</h2>
              <p className="text-sm text-slate-500 mt-0.5">Dzisiejsze operacje w oddziale</p>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              Zobacz wszystkie
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Kwota
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Godzina
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayTransactions.length > 0 ? (
                  todayTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">
                              {transaction.description?.charAt(0) || 'K'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {transaction.description || 'Klient'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {transaction.fromAccount?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-700">
                          {getTransactionTypeLabel(transaction.type)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'DEPOSIT' ? 'text-green-600' : 
                          transaction.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-slate-900'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? '+' : 
                           transaction.type === 'WITHDRAWAL' ? '-' : ''}
                          {transaction.amount.toLocaleString('pl-PL')} PLN
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          {new Date(transaction.timestamp).toLocaleTimeString('pl-PL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                      Brak transakcji do wyświetlenia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Queue status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Kolejka klientów</h2>
              <p className="text-sm text-slate-500 mt-0.5">Oczekujący na obsługę</p>
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            {/* Queue stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">{queueStats?.waiting || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Oczekujących</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">{queueStats?.averageWaitTime || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Min. oczekiwania</p>
              </div>
            </div>

            {/* Queue items */}
            <div className="space-y-2">
              {(queueItems || []).slice(0, 4).map((item: QueueItem, index: number) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    index === 0 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.queueNumber}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.customerName || `Bilet ${item.queueNumber}`}
                      </p>
                      <p className="text-xs text-slate-500">{item.serviceType}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Następny
                    </span>
                  )}
                </div>
              ))}
              {(!queueItems || queueItems.length === 0) && (
                <div className="text-center py-6">
                  <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Brak klientów w kolejce</p>
                </div>
              )}
            </div>

            <button className="w-full py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Wywołaj następnego
            </button>
          </div>
        </div>
      </div>

      {/* Alerts section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Powiadomienia systemowe</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Limit dzienny wpłat gotówkowych bliski przekroczenia
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Wykorzystano 85% limitu (425,000 / 500,000 PLN)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                System AML - wszystkie weryfikacje pozytywne
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                Ostatnia aktualizacja: dziś o 09:45
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Planowana przerwa techniczna
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                Dziś w godz. 22:00-23:00 - aktualizacja systemu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}