import { ArrowRight } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  // Get last 10 transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Ostatnie Transakcje</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Zobacz wszystkie
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {recentTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Opis
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Kategoria
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Kwota
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-3 py-4 text-sm text-white">
                    <div>
                      <p className="font-medium group-hover:text-emerald-300 transition-colors">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.type === 'TRANSFER' ? 'Przelew' :
                          transaction.type === 'DEPOSIT' ? 'Wpłata' :
                            transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10`}>
                      {transaction.category || 'OTHER'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <span className={
                      transaction.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'
                    }>
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Brak transakcji do wyświetlenia</p>
        </div>
      )}
    </div>
  );
}
