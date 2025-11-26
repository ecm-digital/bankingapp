import { useEffect } from 'react';
import { Users, CreditCard, Clock, TrendingUp, Calendar, Bell, ArrowRight, DollarSign } from 'lucide-react';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useQueueStore } from '@/stores/queueStore';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils';

export function Dashboard() {
  const { currentEmployee } = useAuth();
  const { transactions, fetchTransactions } = useTransactionsStore();
  const { queueItems, fetchQueue } = useQueueStore();

  useEffect(() => {
    fetchTransactions();
    fetchQueue();
  }, [fetchTransactions, fetchQueue]);

  // Calculate today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTransactions = transactions.filter(t => {
    const txDate = new Date(t.timestamp);
    txDate.setHours(0, 0, 0, 0);
    return txDate.getTime() === today.getTime();
  });

  const customersServedToday = new Set(todayTransactions.map(t => t.customerId)).size;
  const waitingCustomers = queueItems.filter(q => q.status === 'WAITING').length;
  const avgWaitTime = waitingCustomers > 0
    ? Math.round(queueItems.filter(q => q.status === 'WAITING').reduce((sum, q) => sum + q.estimatedTime, 0) / waitingCustomers)
    : 0;

  const stats = [
    {
      name: 'Obsłużeni Klienci',
      value: customersServedToday.toString(),
      change: '+2 od wczoraj',
      changeType: 'increase' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Transakcje Dzisiaj',
      value: todayTransactions.length.toString(),
      change: `+${Math.round(todayTransactions.length * 0.15)}`,
      changeType: 'increase' as const,
      icon: CreditCard,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      name: 'Czas Oczekiwania',
      value: `${avgWaitTime} min`,
      change: '-2 min',
      changeType: 'decrease' as const,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
    },
    {
      name: 'Cel Miesięczny',
      value: '78%',
      change: '+12%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  // Mock upcoming appointments
  const upcomingAppointments = [
    { id: 1, customer: 'Jan Kowalski', time: '10:00', type: 'Konsultacja kredytowa' },
    { id: 2, customer: 'Anna Nowak', time: '11:30', type: 'Otwarcie konta' },
    { id: 3, customer: 'Piotr Wiśniewski', time: '14:00', type: 'Karta kredytowa' },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, type: 'urgent', message: 'Wniosek kredytowy wymaga zatwierdzenia', time: '5 min temu' },
    { id: 2, type: 'info', message: 'Nowa aktualizacja systemu dostępna', time: '1 godz. temu' },
    { id: 3, type: 'success', message: 'Cel dzienny osiągnięty!', time: '2 godz. temu' },
  ];

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Witaj, {currentEmployee?.firstName || 'Pracownik'}!
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Podsumowanie aktywności na {new Date().toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 shadow-lg group hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"
              style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
            />
            <dt>
              <div className={`absolute rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-400">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'increase' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg">
          <h3 className="text-lg font-medium leading-6 text-white mb-4">Szybkie Akcje</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group text-left">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-white">Nowy Klient</div>
                <div className="text-xs text-gray-400">Zarejestruj nowego klienta</div>
              </div>
            </button>
            <button className="w-full flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group text-left">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 group-hover:text-emerald-300 transition-colors">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-white">Nowy Przelew</div>
                <div className="text-xs text-gray-400">Wykonaj transakcję bankową</div>
              </div>
            </button>
            <button className="w-full flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group text-left">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 group-hover:text-amber-300 transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-white">Zarządzaj Kolejką</div>
                <div className="text-xs text-gray-400">{waitingCustomers} klientów oczekuje</div>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-white">Powiadomienia</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-xl border ${notification.type === 'urgent'
                  ? 'bg-red-500/10 border-red-500/20 text-red-200'
                  : notification.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
                  }`}
              >
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs opacity-70 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Calendar Widget - Upcoming Appointments */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-white">Nadchodzące Spotkania</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{appointment.customer}</p>
                  <p className="text-xs text-gray-400">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            Zobacz wszystkie spotkania
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-white">Ostatnie Transakcje</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {transaction.type === 'TRANSFER' ? 'Przelew' :
                        transaction.type === 'DEPOSIT' ? 'Wpłata' :
                          transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.timestamp).toLocaleTimeString('pl-PL', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${transaction.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'
                      }`}>
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${transaction.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      transaction.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {transaction.status === 'COMPLETED' ? 'Zakończona' :
                        transaction.status === 'PENDING' ? 'Oczekująca' : 'Nieudana'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Brak ostatnich transakcji
              </p>
            )}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            Zobacz wszystkie transakcje
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}