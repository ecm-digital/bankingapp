import { create } from 'zustand';
import { BankProduct, Card, Loan } from '@/types';
import { generateMockProducts, generateMockCards, generateMockLoans } from '@/data/mockData';

interface ProductsState {
  products: BankProduct[];
  cards: Card[];
  loans: Loan[];
  isLoading: boolean;
  error: string | null;
}

interface ProductsActions {
  fetchProducts: () => Promise<void>;
  fetchCustomerCards: (customerId: string) => Promise<void>;
  fetchCustomerLoans: (customerId: string) => Promise<void>;
  applyForProduct: (productId: string, customerId: string, applicationData: any) => Promise<{ applicationId: string; status: string }>;
  updateCardStatus: (cardId: string, status: Card['status']) => Promise<void>;
  updateCardLimits: (cardId: string, creditLimit: number) => Promise<void>;
  clearError: () => void;
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // Initial state
  products: [],
  cards: [],
  loans: [],
  isLoading: false,
  error: null,

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const products = generateMockProducts();
      set({
        products,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania produktów',
      });
    }
  },

  fetchCustomerCards: async (customerId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allCards = generateMockCards();
      const customerCards = allCards.filter(card => card.customerId === customerId);
      
      set({
        cards: customerCards,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania kart klienta',
      });
    }
  },

  fetchCustomerLoans: async (customerId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allLoans = generateMockLoans();
      const customerLoans = allLoans.filter(loan => loan.customerId === customerId);
      
      set({
        loans: customerLoans,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania kredytów klienta',
      });
    }
  },

  applyForProduct: async (productId: string, customerId: string, applicationData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock application processing
      const applicationId = `app_${Date.now()}`;
      
      // In a real app, this would create an application record
      console.log('Application submitted:', {
        applicationId,
        productId,
        customerId,
        applicationData,
        status: 'PENDING',
        submittedAt: new Date(),
      });
      
      set({ isLoading: false });
      
      return { applicationId, status: 'PENDING' };
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd składania wniosku',
      });
      throw error;
    }
  },

  updateCardStatus: async (cardId: string, status: Card['status']) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { cards } = get();
      const updatedCards = cards.map(card =>
        card.id === cardId ? { ...card, status } : card
      );
      
      set({
        cards: updatedCards,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd aktualizacji statusu karty',
      });
    }
  },

  updateCardLimits: async (cardId: string, creditLimit: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { cards } = get();
      const updatedCards = cards.map(card =>
        card.id === cardId 
          ? { 
              ...card, 
              creditLimit,
              availableLimit: creditLimit - (card.creditLimit! - card.availableLimit!)
            } 
          : card
      );
      
      set({
        cards: updatedCards,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd aktualizacji limitów karty',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));