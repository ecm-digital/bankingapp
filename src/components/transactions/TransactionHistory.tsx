import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils';

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

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'FOOD': return 'bg-green-100 text-green-700';
      case 'TRANSPORT': return 'bg-blue-100 text-blue-700';
      case 'SHOPPING': return 'bg-purple-100 text-purple-700';
      case 'BILLS': return 'bg-amber-100 text-amber-700';
      case 'ENTERTAINMENT': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Szukaj po opisie lub numerze referencyjnym..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 hidden lg:block" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as Transaction['type'] | 'ALL')}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Wszystkie typy</option>
              <option value="TRANSFER">Przelewy</option>
              <option value="DEPOSIT">Wpłaty</option>
              <option value="WITHDRAWAL">Wypłaty</option>
              <option value="PAYMENT">Płatności</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Transaction['status'] | 'ALL')}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Wszystkie statusy</option>
            <option value="COMPLETED">Zakończone</option>
            <option value="PENDING">Oczekujące</option>
            <option value="FAILED">Nieudane</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Znaleziono <span className="font-semibold text-slate-900">{filteredTransactions.length}</span> transakcji
        </p>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          <Download className="h-4 w-4" />
          Eksportuj CSV
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Data i czas
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Typ
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {formatDateTime(transaction.timestamp)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {transaction.type === 'TRANSFER' ? 'Przelew' :
                         transaction.type === 'DEPOSIT' ? 'Wpłata' :
                         transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{transaction.description}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {transaction.referenceNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryStyles(transaction.category)}`}>
                        {getCategoryLabel(transaction.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${
                        transaction.type === 'DEPOSIT' ? 'text-green-600' : 
                        transaction.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-slate-900'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                        transaction.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status === 'COMPLETED' ? 'Zakończona' :
                         transaction.status === 'PENDING' ? 'Oczekująca' : 'Nieudana'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {onViewReceipt && (
                        <button
                          onClick={() => onViewReceipt(transaction)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Potwierdzenie
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-sm text-slate-500">Brak transakcji spełniających kryteria wyszukiwania</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}