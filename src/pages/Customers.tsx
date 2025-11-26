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

  // Filter transactions for selected customer
  const customerTransactions = selectedCustomer
    ? transactions.filter(t => t.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Klienci</h1>
        <p className="mt-1 text-sm text-gray-400">
          Wyszukaj i zarządzaj profilami klientów banku
        </p>
      </div>

      {/* Customer Search */}
      {viewMode === 'search' && (
        <>
          <div className="glass-panel rounded-2xl p-6">
            <CustomerSearch
              onSearch={handleSearch}
              searchResults={searchResults}
              onSelectCustomer={handleSelectCustomer}
              isLoading={isLoading}
            />
          </div>

          {/* Customer List */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              Wszyscy Klienci ({customers.length})
            </h3>
            {customers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.slice(0, 12).map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                        {customer.personalInfo.firstName[0]}{customer.personalInfo.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors">
                          {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {customer.personalInfo.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
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
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
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
            {/* Balance Card */}
            <div className="lg:col-span-1">
              {selectedCustomer.bankingInfo.accounts[0] && (
                <BalanceCard
                  account={selectedCustomer.bankingInfo.accounts[0]}
                  onNewTransaction={() => {
                    // TODO: Navigate to transactions page
                    console.log('Navigate to new transaction');
                  }}
                />
              )}
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={customerTransactions}
                onViewAll={() => {
                  // TODO: Navigate to transactions page with filter
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