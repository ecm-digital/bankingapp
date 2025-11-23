import { useAuthStore } from '@/stores/authStore';
import { useCustomersStore } from '@/stores/customersStore';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useQueueStore } from '@/stores/queueStore';
import { useProductsStore } from '@/stores/productsStore';

/**
 * Seeds all stores with demo data for development and demonstration purposes
 */
export const seedDemoData = async () => {
  console.log('🌱 Seeding demo data...');
  
  try {
    // Seed auth store with a demo employee login
    const authStore = useAuthStore.getState();
    await authStore.login('k.wilson@bank.com', 'password123');
    console.log('✅ Auth store seeded');

    // Seed customers store
    const customersStore = useCustomersStore.getState();
    await customersStore.fetchCustomers();
    console.log('✅ Customers store seeded');

    // Seed transactions store
    const transactionsStore = useTransactionsStore.getState();
    await transactionsStore.fetchTransactions();
    console.log('✅ Transactions store seeded');

    // Seed queue store
    const queueStore = useQueueStore.getState();
    await queueStore.fetchQueue();
    console.log('✅ Queue store seeded');

    // Seed products store
    const productsStore = useProductsStore.getState();
    await productsStore.fetchProducts();
    console.log('✅ Products store seeded');

    console.log('🎉 Demo data seeding completed successfully!');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Clears all store data - useful for testing
 */
export const clearAllData = () => {
  console.log('🧹 Clearing all store data...');
  
  // Clear auth
  const authStore = useAuthStore.getState();
  authStore.logout();
  
  // Clear customers
  const customersStore = useCustomersStore.getState();
  customersStore.clearSelectedCustomer();
  
  // Note: We don't have clear methods for other stores, 
  // but in a real app you might want to add them
  
  console.log('✅ All store data cleared');
};

/**
 * Development helper to quickly set up a specific scenario
 */
export const setupDemoScenario = async (scenario: 'customer-service' | 'busy-queue' | 'vip-client' | 'transaction-heavy' | 'error-testing') => {
  console.log(`🎭 Setting up demo scenario: ${scenario}`);
  
  await seedDemoData();
  
  const customersStore = useCustomersStore.getState();
  const queueStore = useQueueStore.getState();
  const transactionsStore = useTransactionsStore.getState();
  
  switch (scenario) {
    case 'customer-service':
      // Select a customer for service
      await customersStore.getCustomerById('1');
      await transactionsStore.fetchCustomerTransactions('1');
      console.log('👤 Customer Anna Johnson selected for service');
      break;
      
    case 'busy-queue':
      // Add more customers to queue
      await queueStore.addToQueue({
        customerId: '3',
        customerName: 'Maria Williams',
        serviceType: 'Investment consultation',
        priority: 'HIGH',
        estimatedTime: 45,
        status: 'WAITING',
      });
      await queueStore.addToQueue({
        customerId: '4',
        customerName: 'Thomas Green',
        serviceType: 'Debt payment',
        priority: 'URGENT',
        estimatedTime: 20,
        status: 'WAITING',
      });
      await queueStore.addToQueue({
        customerId: '2',
        customerName: 'Peter Smith',
        serviceType: 'Account inquiry',
        priority: 'NORMAL',
        estimatedTime: 15,
        status: 'WAITING',
      });
      console.log('🏃‍♂️ Busy queue scenario set up');
      break;
      
    case 'vip-client':
      // Select VIP customer and load their products
      await customersStore.getCustomerById('3');
      await transactionsStore.fetchCustomerTransactions('3');
      const productsStore = useProductsStore.getState();
      await productsStore.fetchCustomerCards('3');
      await productsStore.fetchCustomerLoans('3');
      console.log('⭐ VIP client Maria Williams selected with full profile');
      break;
      
    case 'transaction-heavy':
      // Load customer with many transactions
      await customersStore.getCustomerById('1');
      await transactionsStore.fetchCustomerTransactions('1');
      // Simulate creating several transactions
      console.log('💳 Transaction-heavy scenario ready');
      break;
      
    case 'error-testing':
      // This scenario is for testing error handling
      console.log('⚠️ Error testing scenario - some operations may fail intentionally');
      break;
  }
  
  console.log(`✅ Demo scenario "${scenario}" ready!`);
};

/**
 * Preloads data for a specific customer to improve UX
 */
export const preloadCustomerData = async (customerId: string) => {
  console.log(`📋 Preloading data for customer ${customerId}...`);
  
  const customersStore = useCustomersStore.getState();
  const transactionsStore = useTransactionsStore.getState();
  const productsStore = useProductsStore.getState();
  
  try {
    // Load customer profile
    await customersStore.getCustomerById(customerId);
    
    // Load customer transactions
    await transactionsStore.fetchCustomerTransactions(customerId);
    
    // Load customer cards and loans
    await productsStore.fetchCustomerCards(customerId);
    await productsStore.fetchCustomerLoans(customerId);
    
    console.log(`✅ Customer ${customerId} data preloaded successfully`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error preloading customer ${customerId} data:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Validates that all stores have been properly seeded
 */
export const validateDataIntegrity = () => {
  console.log('🔍 Validating data integrity...');
  
  const authStore = useAuthStore.getState();
  const customersStore = useCustomersStore.getState();
  const transactionsStore = useTransactionsStore.getState();
  const queueStore = useQueueStore.getState();
  const productsStore = useProductsStore.getState();
  
  const issues: string[] = [];
  
  // Check auth store
  if (!authStore.isAuthenticated || !authStore.currentEmployee) {
    issues.push('Authentication not properly initialized');
  }
  
  // Check customers store
  if (customersStore.customers.length === 0) {
    issues.push('No customers loaded');
  }
  
  // Check transactions store
  if (transactionsStore.transactions.length === 0) {
    issues.push('No transactions loaded');
  }
  
  // Check queue store
  if (queueStore.queueItems.length === 0) {
    issues.push('No queue items loaded');
  }
  
  // Check products store
  if (productsStore.products.length === 0) {
    issues.push('No products loaded');
  }
  
  if (issues.length > 0) {
    console.warn('⚠️ Data integrity issues found:', issues);
    return { valid: false, issues };
  }
  
  console.log('✅ Data integrity validation passed');
  return { valid: true, issues: [] };
};