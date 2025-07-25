import { useCustomersStore } from '@/stores/customersStore';
import { useCallback, useEffect } from 'react';

export const useCustomers = () => {
  const {
    customers,
    selectedCustomer,
    searchResults,
    isLoading,
    error,
    fetchCustomers,
    searchCustomers,
    getCustomerById,
    updateCustomer,
    addNote,
    clearSelectedCustomer,
    clearError,
  } = useCustomersStore();

  // Auto-fetch customers on mount
  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [customers.length, fetchCustomers]);

  const handleSearch = useCallback(async (query: string) => {
    await searchCustomers(query);
  }, [searchCustomers]);

  const handleSelectCustomer = useCallback(async (customerId: string) => {
    await getCustomerById(customerId);
  }, [getCustomerById]);

  const handleUpdateCustomer = useCallback(async (customerId: string, updates: any) => {
    try {
      await updateCustomer(customerId, updates);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update error' 
      };
    }
  }, [updateCustomer]);

  const handleAddNote = useCallback(async (
    customerId: string, 
    content: string, 
    type: 'GENERAL' | 'IMPORTANT' | 'REMINDER' = 'GENERAL'
  ) => {
    try {
      await addNote(customerId, content, type);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error adding note' 
      };
    }
  }, [addNote]);

  return {
    // State
    customers,
    selectedCustomer,
    searchResults,
    isLoading,
    error,
    
    // Actions
    fetchCustomers,
    searchCustomers: handleSearch,
    selectCustomer: handleSelectCustomer,
    updateCustomer: handleUpdateCustomer,
    addNote: handleAddNote,
    clearSelectedCustomer,
    clearError,
    
    // Computed
    hasCustomers: customers.length > 0,
    hasSearchResults: searchResults.length > 0,
    selectedCustomerName: selectedCustomer 
      ? `${selectedCustomer.personalInfo.firstName} ${selectedCustomer.personalInfo.lastName}`
      : null,
  };
};