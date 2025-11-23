import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, Input, Button } from '@/components/ui';
import { Transaction } from '@/types';
import { formatCurrency, formatDateTime, getCategoryColor, getStatusColor } from '@/utils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onViewReceipt?: (transaction: Transaction) => void;
}

export function TransactionHistory({ transactions, onViewReceipt }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<Transaction['type'] | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<Transaction['status'] | 'ALL'>('ALL');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Szukaj po opisie lub numerze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as Transaction['type'] | 'ALL')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="ALL">Wszystkie typy</option>
                <option value="TRANSFER">Przelewy</option>
                <option value="DEPOSIT">Wpłaty</option>
                <option value="WITHDRAWAL">Wypłaty</option>
                <option value="PAYMENT">Płatności</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Transaction['status'] | 'ALL')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="ALL">Wszystkie statusy</option>
                <option value="COMPLETED">Zakończone</option>
                <option value="PENDING">Oczekujące</option>
                <option value="FAILED">Nieudane</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Znaleziono <strong>{filteredTransactions.length}</strong> transakcji
        </p>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Eksportuj do CSV
        </Button>
      </div>

      {/* Transaction List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data i czas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kwota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.type === 'TRANSFER' ? 'Przelew' :
                         transaction.type === 'DEPOSIT' ? 'Wpłata' :
                         transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            {transaction.referenceNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getCategoryColor(transaction.category)
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'
                        }>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(transaction.status)
                        }`}>
                          {transaction.status === 'COMPLETED' ? 'Zakończona' :
                           transaction.status === 'PENDING' ? 'Oczekująca' : 'Nieudana'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {onViewReceipt && (
                          <button
                            onClick={() => onViewReceipt(transaction)}
                            className="text-primary-600 hover:text-primary-900 font-medium"
                          >
                            Potwierdzenie
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      Brak transakcji spełniających kryteria wyszukiwania
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
