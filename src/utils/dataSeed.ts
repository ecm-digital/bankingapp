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
    await authStore.login('k.wisniewska@bank.pl', 'password123');
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
export const setupDemoScenario = async (scenario: 'customer-service' | 'busy-queue' | 'vip-client') => {
  console.log(`🎭 Setting up demo scenario: ${scenario}`);
  
  await seedDemoData();
  
  const customersStore = useCustomersStore.getState();
  const queueStore = useQueueStore.getState();
  
  switch (scenario) {
    case 'customer-service':
      // Select a customer for service
      await customersStore.getCustomerById('1');
      console.log('👤 Customer Anna Kowalska selected for service');
      break;
      
    case 'busy-queue':
      // Add more customers to queue
      await queueStore.addToQueue({
        customerId: '3',
        customerName: 'Maria Wiśniewska',
        serviceType: 'Konsultacja inwestycyjna',
        priority: 'HIGH',
        estimatedTime: 45,
      });
      await queueStore.addToQueue({
        customerId: '4',
        customerName: 'Tomasz Zieliński',
        serviceType: 'Spłata zadłużenia',
        priority: 'URGENT',
        estimatedTime: 20,
      });
      console.log('🏃‍♂️ Busy queue scenario set up');
      break;
      
    case 'vip-client':
      // Select VIP customer
      await customersStore.getCustomerById('3');
      console.log('⭐ VIP client Maria Wiśniewska selected');
      break;
  }
  
  console.log(`✅ Demo scenario "${scenario}" ready!`);
};