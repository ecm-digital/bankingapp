import { ArrowRight } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'FOOD': return 'Żywność';
      case 'TRANSPORT': return 'Transport';
      case 'SHOPPING': return 'Zakupy';
      case 'BILLS': return 'Rachunki';
      case 'ENTERTAINMENT': return 'Rozrywka';
      default: return 'Inne';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Ostatnie Transakcje</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Opis
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Kategoria
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Kwota
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <p className="text-xs text-slate-500">
                        {transaction.type === 'TRANSFER' ? 'Przelew' :
                          transaction.type === 'DEPOSIT' ? 'Wpłata' :
                            transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {getCategoryLabel(transaction.category || 'OTHER')}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    <span className={
                      transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-slate-900'
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
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">Brak transakcji do wyświetlenia</p>
        </div>
      )}
    </div>
  );
}