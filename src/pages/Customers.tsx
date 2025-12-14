import { useEffect, useState } from 'react';
import { useCustomersStore } from '@/stores/customersStore';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { CustomerSearch, CustomerProfile, BalanceCard, RecentTransactions } from '@/components/customers';
import { Customer } from '@/types';
import { ArrowLeft, Users } from 'lucide-react';

export function Customers() {
  const {
    customers,
    selectedCustomer,
    searchResults,
    isLoading,
    fetchCustomers,
    searchCustomers,
    getCustomerById,
    updateCustomer,
    clearSelectedCustomer,
  } = useCustomersStore();

  const {
    transactions,
    fetchTransactions,
  } = useTransactionsStore();

  const [viewMode, setViewMode] = useState<'search' | 'profile'>('search');

  useEffect(() => {
    fetchCustomers();
    fetchTransactions();
  }, [fetchCustomers, fetchTransactions]);

  const handleSearch = (query: string) => {
    searchCustomers(query);
  };

  const handleSelectCustomer = (customer: Customer) => {
    getCustomerById(customer.id);
    setViewMode('profile');
  };

  const handleBackToSearch = () => {
    clearSelectedCustomer();
    setViewMode('search');
  };

  const handleUpdateCustomer = (updates: Partial<Customer>) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, updates);
    }
  };

  const customerTransactions = selectedCustomer
    ? transactions.filter(t => t.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Klienci</h1>
        <p className="text-slate-500 mt-1">
          Wyszukaj i zarządzaj profilami klientów banku
        </p>
      </div>

      {/* Customer Search */}
      {viewMode === 'search' && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <CustomerSearch
              onSearch={handleSearch}
              searchResults={searchResults}
              onSelectCustomer={handleSelectCustomer}
              isLoading={isLoading}
            />
          </div>

          {/* Customer List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Wszyscy Klienci ({customers.length})
            </h3>
            {customers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {customers.slice(0, 12).map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="p-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {customer.personalInfo.firstName[0]}{customer.personalInfo.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {customer.personalInfo.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                Brak klientów do wyświetlenia
              </p>
            )}
          </div>
        </>
      )}

      {/* Customer Profile View */}
      {viewMode === 'profile' && selectedCustomer && (
        <>
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Powrót do wyszukiwania
            </button>
          </div>

          <CustomerProfile
            customer={selectedCustomer}
            onUpdate={handleUpdateCustomer}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {selectedCustomer.bankingInfo.accounts[0] && (
                <BalanceCard
                  account={selectedCustomer.bankingInfo.accounts[0]}
                  onNewTransaction={() => {
                    console.log('Navigate to new transaction');
                  }}
                />
              )}
            </div>

            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={customerTransactions}
                onViewAll={() => {
                  console.log('View all transactions');
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}