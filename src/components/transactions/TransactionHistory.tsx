import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
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
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Szukaj po opisie lub numerze..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 placeholder-gray-500 transition-all"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as Transaction['type'] | 'ALL')}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="ALL" className="bg-gray-900">Wszystkie typy</option>
              <option value="TRANSFER" className="bg-gray-900">Przelewy</option>
              <option value="DEPOSIT" className="bg-gray-900">Wpłaty</option>
              <option value="WITHDRAWAL" className="bg-gray-900">Wypłaty</option>
              <option value="PAYMENT" className="bg-gray-900">Płatności</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Transaction['status'] | 'ALL')}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="ALL" className="bg-gray-900">Wszystkie statusy</option>
              <option value="COMPLETED" className="bg-gray-900">Zakończone</option>
              <option value="PENDING" className="bg-gray-900">Oczekujące</option>
              <option value="FAILED" className="bg-gray-900">Nieudane</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-gray-400">
          Znaleziono <strong className="text-white">{filteredTransactions.length}</strong> transakcji
        </p>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-all">
          <Download className="h-4 w-4" />
          Eksportuj do CSV
        </button>
      </div>

      {/* Transaction List */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-lg overflow-hidden">
        <div className="overflow-x-auto -mx-6 lg:mx-0">
          <div className="min-w-[800px] px-6 lg:px-0">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/10">
                  <th className="pb-4 pl-4">Data i czas</th>
                  <th className="pb-4">Typ</th>
                  <th className="pb-4">Opis</th>
                  <th className="pb-4">Kategoria</th>
                  <th className="pb-4">Kwota</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 pl-4 text-sm text-gray-400">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="py-4 text-sm text-white font-medium">
                        {transaction.type === 'TRANSFER' ? 'Przelew' :
                         transaction.type === 'DEPOSIT' ? 'Wpłata' :
                         transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        <div>
                          <p className="font-medium text-white">{transaction.description}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            {transaction.referenceNumber}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          // Mapping categories to glass styles instead of using getCategoryColor directly which returns tailwind classes for light mode
                          transaction.category === 'FOOD' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          transaction.category === 'TRANSPORT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          transaction.category === 'SHOPPING' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          transaction.category === 'BILLS' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          transaction.category === 'ENTERTAINMENT' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          transaction.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'
                        }>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          transaction.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          transaction.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {transaction.status === 'COMPLETED' ? 'Zakończona' :
                           transaction.status === 'PENDING' ? 'Oczekująca' : 'Nieudana'}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm">
                        {onViewReceipt && (
                          <button
                            onClick={() => onViewReceipt(transaction)}
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors text-xs uppercase tracking-wide"
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
        </div>
      </div>
    </div>
  );
}