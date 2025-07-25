import { useProductsStore } from '@/stores/productsStore';
import { useCallback, useEffect } from 'react';
import { Card } from '@/types';

export const useProducts = () => {
  const {
    products,
    cards,
    loans,
    isLoading,
    error,
    fetchProducts,
    fetchCustomerCards,
    fetchCustomerLoans,
    applyForProduct,
    updateCardStatus,
    updateCardLimits,
    clearError,
  } = useProductsStore();

  // Auto-fetch products on mount
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const handleFetchCustomerCards = useCallback(async (customerId: string) => {
    await fetchCustomerCards(customerId);
  }, [fetchCustomerCards]);

  const handleFetchCustomerLoans = useCallback(async (customerId: string) => {
    await fetchCustomerLoans(customerId);
  }, [fetchCustomerLoans]);

  const handleApplyForProduct = useCallback(async (
    productId: string, 
    customerId: string, 
    applicationData: any
  ) => {
    try {
      await applyForProduct(productId, customerId, applicationData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Application submission error' 
      };
    }
  }, [applyForProduct]);

  const handleUpdateCardStatus = useCallback(async (
    cardId: string, 
    status: Card['status']
  ) => {
    try {
      await updateCardStatus(cardId, status);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error updating card status' 
      };
    }
  }, [updateCardStatus]);

  const handleUpdateCardLimits = useCallback(async (
    cardId: string, 
    creditLimit: number
  ) => {
    try {
      await updateCardLimits(cardId, creditLimit);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error updating card limits' 
      };
    }
  }, [updateCardLimits]);

  // Helper functions for product categorization
  const getProductsByCategory = useCallback((category: string) => {
    return products.filter(product => product.category === category);
  }, [products]);

  const getPromotionalProducts = useCallback(() => {
    return products.filter(product => product.isPromotional);
  }, [products]);

  const getActiveCards = useCallback(() => {
    return cards.filter(card => card.status === 'ACTIVE');
  }, [cards]);

  const getBlockedCards = useCallback(() => {
    return cards.filter(card => card.status === 'BLOCKED');
  }, [cards]);

  const getActiveLoans = useCallback(() => {
    return loans.filter(loan => loan.status === 'ACTIVE');
  }, [loans]);

  const getTotalCreditLimit = useCallback(() => {
    return cards
      .filter(card => card.cardType === 'CREDIT' && card.status === 'ACTIVE')
      .reduce((total, card) => total + (card.creditLimit || 0), 0);
  }, [cards]);

  const getTotalAvailableCredit = useCallback(() => {
    return cards
      .filter(card => card.cardType === 'CREDIT' && card.status === 'ACTIVE')
      .reduce((total, card) => total + (card.availableLimit || 0), 0);
  }, [cards]);

  const getTotalLoanBalance = useCallback(() => {
    return loans
      .filter(loan => loan.status === 'ACTIVE')
      .reduce((total, loan) => total + loan.currentBalance, 0);
  }, [loans]);

  const getMonthlyLoanPayments = useCallback(() => {
    return loans
      .filter(loan => loan.status === 'ACTIVE')
      .reduce((total, loan) => total + loan.monthlyPayment, 0);
  }, [loans]);

  return {
    // State
    products,
    cards,
    loans,
    isLoading,
    error,
    
    // Actions
    fetchProducts,
    fetchCustomerCards: handleFetchCustomerCards,
    fetchCustomerLoans: handleFetchCustomerLoans,
    applyForProduct: handleApplyForProduct,
    updateCardStatus: handleUpdateCardStatus,
    updateCardLimits: handleUpdateCardLimits,
    clearError,
    
    // Computed
    hasProducts: products.length > 0,
    hasCards: cards.length > 0,
    hasLoans: loans.length > 0,
    accountProducts: getProductsByCategory('ACCOUNT'),
    loanProducts: getProductsByCategory('LOAN'),
    investmentProducts: getProductsByCategory('INVESTMENT'),
    insuranceProducts: getProductsByCategory('INSURANCE'),
    promotionalProducts: getPromotionalProducts(),
    activeCards: getActiveCards(),
    blockedCards: getBlockedCards(),
    activeLoans: getActiveLoans(),
    
    // Financial summaries
    totalCreditLimit: getTotalCreditLimit(),
    totalAvailableCredit: getTotalAvailableCredit(),
    totalLoanBalance: getTotalLoanBalance(),
    monthlyLoanPayments: getMonthlyLoanPayments(),
    
    // Helper functions
    getProductsByCategory,
    getPromotionalProducts,
    getActiveCards,
    getBlockedCards,
    getActiveLoans,
  };
};