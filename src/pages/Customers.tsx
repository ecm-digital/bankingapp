import { useEffect, useState } from 'react';
import { useCustomersStore } from '@/stores/customersStore';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { CustomerSearch, CustomerProfile, BalanceCard, RecentTransactions } from '@/components/customers';
import { Card, CardContent } from '@/components/ui';
import { Customer } from '@/types';

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
        <h1 className="text-2xl font-bold text-gray-900">Klienci</h1>
        <p className="mt-1 text-sm text-gray-500">
          Wyszukaj i zarządzaj profilami klientów banku
        </p>
      </div>

      {/* Customer Search */}
      {viewMode === 'search' && (
        <>
          <Card>
            <CardContent className="p-6">
              <CustomerSearch
                onSearch={handleSearch}
                searchResults={searchResults}
                onSelectCustomer={handleSelectCustomer}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Customer List */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Wszyscy Klienci ({customers.length})
              </h3>
              {customers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customers.slice(0, 12).map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                          {customer.personalInfo.firstName[0]}{customer.personalInfo.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
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
            </CardContent>
          </Card>
        </>
      )}

      {/* Customer Profile View */}
      {viewMode === 'profile' && selectedCustomer && (
        <>
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToSearch}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Powrót do wyszukiwania
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