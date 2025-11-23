import { ArrowRight } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { Transaction } from '@/types';
import { formatCurrency, formatDate, getCategoryColor } from '@/utils';

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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ostatnie Transakcje</h3>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              Zobacz wszystkie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opis
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoria
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kwota
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {transaction.type === 'TRANSFER' ? 'Przelew' : 
                           transaction.type === 'DEPOSIT' ? 'Wpłata' : 
                           transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getCategoryColor(transaction.category || 'OTHER')
                      }`}>
                        {transaction.category || 'OTHER'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <span className={
                        transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'
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
      </CardContent>
    </Card>
  );
}
