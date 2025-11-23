import { useEffect } from 'react';
import { Users, CreditCard, Clock, TrendingUp, Calendar, Bell, ArrowRight, DollarSign } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
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
    },
    {
      name: 'Transakcje Dzisiaj',
      value: todayTransactions.length.toString(),
      change: `+${Math.round(todayTransactions.length * 0.15)}`,
      changeType: 'increase' as const,
      icon: CreditCard,
    },
    {
      name: 'Czas Oczekiwania',
      value: `${avgWaitTime} min`,
      change: '-2 min',
      changeType: 'decrease' as const,
      icon: Clock,
    },
    {
      name: 'Cel Miesięczny',
      value: '78%',
      change: '+12%',
      changeType: 'increase' as const,
      icon: TrendingUp,
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
        <h1 className="text-2xl font-bold text-gray-900">
          Witaj, {currentEmployee?.firstName || 'Pracownik'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Szybkie Akcje</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start h-auto p-4">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Nowy Klient</div>
                  <div className="text-xs text-gray-500">Zarejestruj nowego klienta</div>
                </div>
              </Button>
              <Button variant="secondary" className="w-full justify-start h-auto p-4">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Nowy Przelew</div>
                  <div className="text-xs text-gray-500">Wykonaj transakcję bankową</div>
                </div>
              </Button>
              <Button variant="secondary" className="w-full justify-start h-auto p-4">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Zarządzaj Kolejką</div>
                  <div className="text-xs text-gray-500">{waitingCustomers} klientów oczekuje</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Panel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Powiadomienia</h3>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.type === 'urgent'
                      ? 'bg-red-50 border-red-200'
                      : notification.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Calendar Widget - Upcoming Appointments */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Nadchodzące Spotkania</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.customer}</p>
                    <p className="text-xs text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-600">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              Zobacz wszystkie spotkania
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Ostatnie Transakcje</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.type === 'TRANSFER' ? 'Przelew' : 
                         transaction.type === 'DEPOSIT' ? 'Wpłata' : 
                         transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleTimeString('pl-PL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
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
            <Button variant="ghost" className="w-full mt-4">
              Zobacz wszystkie transakcje
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}