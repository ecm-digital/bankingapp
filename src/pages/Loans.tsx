import { useState, useEffect } from 'react';
import { Plus, Search, Calculator } from 'lucide-react';
import { LoanComponent, LoanCalculator } from '@/components/loans';
import { useProductsStore } from '@/stores/productsStore';
import { useCustomersStore } from '@/stores/customersStore';
import { Loan } from '@/types';

export function Loans() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);

  const { loans, fetchCustomerLoans } = useProductsStore();
  const { customers, fetchCustomers } = useCustomersStore();

  useEffect(() => {
    fetchCustomers();
    // Fetch loans for first customer as demo
    if (customers.length > 0 && !selectedCustomerId) {
      const firstCustomerId = customers[0].id;
      setSelectedCustomerId(firstCustomerId);
      fetchCustomerLoans(firstCustomerId);
    }
  }, [fetchCustomers, fetchCustomerLoans, customers, selectedCustomerId]);

  const handleViewDetails = (loan: Loan) => {
    // In full app, would open details modal
    alert(`Szczegóły kredytu ${loan.id} - funkcja zostanie zaimplementowana w pełnej wersji`);
  };

  const filteredLoans = loans.filter(loan =>
    loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.loanType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeLoans = filteredLoans.filter(l => l.status === 'ACTIVE');
  const totalDebt = activeLoans.reduce((sum, l) => sum + l.currentBalance, 0);
  const totalMonthlyPayment = activeLoans.reduce((sum, l) => sum + l.monthlyPayment, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Zarządzanie Kredytami</h1>
          <p className="mt-1 text-sm text-gray-400">
            Przeglądaj i zarządzaj kredytami klientów
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${showCalculator
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
          >
            <Calculator className="h-5 w-5" />
            Kalkulator
          </button>
          <button
            disabled={!selectedCustomerId}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Nowy Wniosek
          </button>
        </div>
      </div>

      {/* Customer Selector & Search */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wybierz klienta
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                fetchCustomerLoans(e.target.value);
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            >
              <option value="" className="bg-[#0f172a]">Wybierz klienta...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id} className="bg-[#0f172a]">
                  {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Szukaj kredytu
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Szukaj po ID lub typie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {selectedCustomerId && activeLoans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-emerald-500/20 transition-colors" />
            <p className="text-sm text-gray-400 mb-1">Aktywne kredyty</p>
            <p className="text-3xl font-bold text-white">{activeLoans.length}</p>
          </div>
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-blue-500/20 transition-colors" />
            <p className="text-sm text-gray-400 mb-1">Całkowite zadłużenie</p>
            <p className="text-3xl font-bold text-white">
              {totalDebt.toLocaleString('pl-PL')} PLN
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-purple-500/20 transition-colors" />
            <p className="text-sm text-gray-400 mb-1">Miesięczne raty</p>
            <p className="text-3xl font-bold text-white">
              {totalMonthlyPayment.toLocaleString('pl-PL')} PLN
            </p>
          </div>
        </div>
      )}

      {/* Calculator */}
      {showCalculator && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <LoanCalculator />
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Informacje o kredytach</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 hover:bg-blue-500/20 transition-colors">
                <p className="font-medium text-blue-400 mb-1">Kredyt Osobisty</p>
                <p className="text-blue-300">Oprocentowanie od 5.5% • Do 200,000 PLN</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/20 transition-colors">
                <p className="font-medium text-emerald-400 mb-1">Kredyt Hipoteczny</p>
                <p className="text-emerald-300">Oprocentowanie od 4.5% • Do 1,000,000 PLN</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 hover:bg-purple-500/20 transition-colors">
                <p className="font-medium text-purple-400 mb-1">Kredyt Samochodowy</p>
                <p className="text-purple-300">Oprocentowanie od 6.0% • Do 300,000 PLN</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loans Overview */}
      {selectedCustomerId ? (
        <div>
          <h2 className="text-lg font-medium text-white mb-4">
            Kredyty klienta ({filteredLoans.length})
          </h2>

          {filteredLoans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLoans.map((loan) => (
                <LoanComponent
                  key={loan.id}
                  loan={loan}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <p className="text-gray-400">
                {searchQuery
                  ? 'Nie znaleziono kredytów spełniających kryteria wyszukiwania'
                  : 'Klient nie posiada żadnych kredytów'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-gray-400">Wybierz klienta, aby wyświetlić jego kredyty</p>
        </div>
      )}
    </div>
  );
}