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
    if (customers.length > 0 && !selectedCustomerId) {
      const firstCustomerId = customers[0].id;
      setSelectedCustomerId(firstCustomerId);
      fetchCustomerLoans(firstCustomerId);
    }
  }, [fetchCustomers, fetchCustomerLoans, customers, selectedCustomerId]);

  const handleViewDetails = (loan: Loan) => {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Zarządzanie Kredytami</h1>
          <p className="text-slate-500 mt-1">
            Przeglądaj i zarządzaj kredytami klientów
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${showCalculator
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Calculator className="h-5 w-5" />
            Kalkulator
          </button>
          <button
            disabled={!selectedCustomerId}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Nowy Wniosek
          </button>
        </div>
      </div>

      {/* Customer Selector & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Wybierz klienta
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                fetchCustomerLoans(e.target.value);
              }}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Wybierz klienta...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Szukaj kredytu
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj po ID lub typie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {selectedCustomerId && activeLoans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Aktywne kredyty</p>
            <p className="text-2xl font-bold text-slate-900">{activeLoans.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Całkowite zadłużenie</p>
            <p className="text-2xl font-bold text-slate-900">
              {totalDebt.toLocaleString('pl-PL')} PLN
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Miesięczne raty</p>
            <p className="text-2xl font-bold text-slate-900">
              {totalMonthlyPayment.toLocaleString('pl-PL')} PLN
            </p>
          </div>
        </div>
      )}

      {/* Calculator */}
      {showCalculator && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoanCalculator />
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Informacje o kredytach</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900 mb-1">Kredyt Osobisty</p>
                <p className="text-blue-700">Oprocentowanie od 5.5% • Do 200,000 PLN</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-900 mb-1">Kredyt Hipoteczny</p>
                <p className="text-green-700">Oprocentowanie od 4.5% • Do 1,000,000 PLN</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="font-medium text-purple-900 mb-1">Kredyt Samochodowy</p>
                <p className="text-purple-700">Oprocentowanie od 6.0% • Do 300,000 PLN</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loans Overview */}
      {selectedCustomerId ? (
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Kredyty klienta ({filteredLoans.length})
          </h2>

          {filteredLoans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLoans.map((loan) => (
                <LoanComponent
                  key={loan.id}
                  loan={loan}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <p className="text-slate-500">
                {searchQuery
                  ? 'Nie znaleziono kredytów spełniających kryteria wyszukiwania'
                  : 'Klient nie posiada żadnych kredytów'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">Wybierz klienta, aby wyświetlić jego kredyty</p>
        </div>
      )}
    </div>
  );
}