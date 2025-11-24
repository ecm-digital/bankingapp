import React, { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/Loading';

/**
 * Demo component showcasing state management and mock API functionality
 * This component demonstrates all the features implemented in task 5
 */
export const StateManagementDemo: React.FC = () => {
  const {
    isInitialized,
    isLoading,
    hasError,
    auth,
    customers,
    transactions,
    queue,
    products,
    setupScenario,
    loadCustomerData,
    clearAllErrors,
    refreshAllData,
    getHealthStatus,
    cache,
  } = useAppState();

  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [demoResults, setDemoResults] = useState<any[]>([]);

  const healthStatus = getHealthStatus();

  const addResult = (operation: string, result: any) => {
    setDemoResults(prev => [
      { timestamp: new Date(), operation, result },
      ...prev.slice(0, 9) // Keep last 10 results
    ]);
  };

  const handleScenarioSetup = async () => {
    if (!selectedScenario) return;
    
    const result = await setupScenario(selectedScenario as any);
    addResult(`Setup Scenario: ${selectedScenario}`, result);
  };

  const handleCustomerLoad = async () => {
    if (!selectedCustomerId) return;
    
    const result = await loadCustomerData(selectedCustomerId);
    addResult(`Load Customer: ${selectedCustomerId}`, result);
  };

  const handleRefreshData = async () => {
    const result = await refreshAllData();
    addResult('Refresh All Data', result);
  };

  const handleErrorTest = async () => {
    try {
      // Intentionally trigger an error for demonstration
      await customers.searchCustomers('x'); // Too short query
    } catch (error) {
      addResult('Error Test', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg">Initializing application...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          State Management & Mock API Demo
        </h1>
        <p className="text-gray-600">
          Demonstrating Zustand stores, mock API, error handling, and loading states
        </p>
      </div>

      {/* Health Status */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Application Health Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg ${healthStatus.isHealthy ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="text-sm font-medium">Overall Health</div>
            <div className={`text-lg font-bold ${healthStatus.isHealthy ? 'text-green-800' : 'text-red-800'}`}>
              {healthStatus.isHealthy ? 'Healthy' : 'Issues'}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${healthStatus.authenticated ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <div className="text-sm font-medium">Authentication</div>
            <div className={`text-lg font-bold ${healthStatus.authenticated ? 'text-green-800' : 'text-yellow-800'}`}>
              {healthStatus.authenticated ? 'Authenticated' : 'Not Auth'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-100">
            <div className="text-sm font-medium">Cache Size</div>
            <div className="text-lg font-bold text-blue-800">{cache.size()}</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-100">
            <div className="text-sm font-medium">Queue Length</div>
            <div className="text-lg font-bold text-purple-800">{queue.queueItems.length}</div>
          </div>
        </div>
      </Card>

      {/* Data Overview */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{customers.customers.length}</div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{transactions.transactions.length}</div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{queue.queueItems.length}</div>
            <div className="text-sm text-gray-600">Queue Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{products.products.length}</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
        </div>
      </Card>

      {/* Demo Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario Setup */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Demo Scenarios</h3>
          <div className="space-y-3">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a scenario...</option>
              <option value="customer-service">Customer Service</option>
              <option value="busy-queue">Busy Queue</option>
              <option value="vip-client">VIP Client</option>
              <option value="transaction-heavy">Transaction Heavy</option>
              <option value="error-testing">Error Testing</option>
            </select>
            <Button 
              onClick={handleScenarioSetup}
              disabled={!selectedScenario || isLoading}
              className="w-full"
            >
              Setup Scenario
            </Button>
          </div>
        </Card>

        {/* Customer Data Loading */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Customer Data Loading</h3>
          <div className="space-y-3">
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a customer...</option>
              {customers.customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                </option>
              ))}
            </select>
            <Button 
              onClick={handleCustomerLoad}
              disabled={!selectedCustomerId || isLoading}
              className="w-full"
            >
              Load Customer Data
            </Button>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleRefreshData} disabled={isLoading}>
            Refresh All Data
          </Button>
          <Button onClick={clearAllErrors} variant="secondary">
            Clear All Errors
          </Button>
          <Button onClick={handleErrorTest} variant="danger">
            Test Error Handling
          </Button>
          <Button onClick={() => cache.clear()} variant="secondary">
            Clear Cache
          </Button>
          <Button onClick={() => setDemoResults([])} variant="secondary">
            Clear Results
          </Button>
        </div>
      </Card>

      {/* Error Display */}
      {hasError && (
        <Card className="p-4 border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-800 mb-3">Current Errors</h3>
          <div className="space-y-2">
            {auth.error && <div className="text-red-700">Auth: {auth.error}</div>}
            {customers.error && <div className="text-red-700">Customers: {customers.error}</div>}
            {transactions.error && <div className="text-red-700">Transactions: {transactions.error}</div>}
            {queue.error && <div className="text-red-700">Queue: {queue.error}</div>}
            {products.error && <div className="text-red-700">Products: {products.error}</div>}
          </div>
        </Card>
      )}

      {/* Loading States */}
      {isLoading && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-blue-800">Operations in progress...</span>
          </div>
        </Card>
      )}

      {/* Demo Results */}
      {demoResults.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Recent Operations</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {demoResults.map((result, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="font-medium text-gray-900">
                  {result.operation}
                </div>
                <div className="text-gray-600 text-xs">
                  {result.timestamp.toLocaleTimeString()}
                </div>
                <div className="mt-1">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Current Employee Info */}
      {auth.currentEmployee && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Current Employee</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium">{auth.employeeName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Role</div>
              <div className="font-medium">{auth.currentEmployee.role}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Department</div>
              <div className="font-medium">{auth.currentEmployee.department}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Session Valid</div>
              <div className={`font-medium ${auth.sessionValid ? 'text-green-600' : 'text-red-600'}`}>
                {auth.sessionValid ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};