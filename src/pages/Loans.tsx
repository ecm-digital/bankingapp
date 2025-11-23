import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { LoanComponent, LoanCalculator } from '@/components/loans';
import { useProductsStore } from '@/stores/productsStore';
import { useCustomersStore } from '@/stores/customersStore';
import { Loan } from '@/types';

export function Loans() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
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
    setSelectedLoan(loan);
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
          <h1 className="text-2xl font-bold text-gray-900">Zarządzanie Kredytami</h1>
          <p className="mt-1 text-sm text-gray-500">
            Przeglądaj i zarządzaj kredytami klientów
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            Kalkulator
          </Button>
          <Button
            variant="primary"
            disabled={!selectedCustomerId}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nowy Wniosek
          </Button>
        </div>
      </div>

      {/* Customer Selector & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz klienta
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  fetchCustomerLoans(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szukaj kredytu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Szukaj po ID lub typie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {selectedCustomerId && activeLoans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Aktywne kredyty</p>
              <p className="text-3xl font-bold text-gray-900">{activeLoans.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Całkowite zadłużenie</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalDebt.toLocaleString('pl-PL')} PLN
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Miesięczne raty</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalMonthlyPayment.toLocaleString('pl-PL')} PLN
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calculator */}
      {showCalculator && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoanCalculator />
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o kredytach</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-blue-900 mb-1">Kredyt Osobisty</p>
                  <p className="text-blue-700">Oprocentowanie od 5.5% • Do 200,000 PLN</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-green-900 mb-1">Kredyt Hipoteczny</p>
                  <p className="text-green-700">Oprocentowanie od 4.5% • Do 1,000,000 PLN</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="font-medium text-purple-900 mb-1">Kredyt Samochodowy</p>
                  <p className="text-purple-700">Oprocentowanie od 6.0% • Do 300,000 PLN</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loans Overview */}
      {selectedCustomerId ? (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
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
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">
                  {searchQuery
                    ? 'Nie znaleziono kredytów spełniających kryteria wyszukiwania'
                    : 'Klient nie posiada żadnych kredytów'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Wybierz klienta, aby wyświetlić jego kredyty</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}