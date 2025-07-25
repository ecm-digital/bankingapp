import { create } from 'zustand';
import { QueueItem } from '@/types';
import { generateMockQueue } from '@/data/mockData';

interface QueueState {
  queueItems: QueueItem[];
  currentlyServing: QueueItem | null;
  isLoading: boolean;
  error: string | null;
}

interface QueueActions {
  fetchQueue: () => Promise<void>;
  addToQueue: (item: Omit<QueueItem, 'id' | 'arrivalTime' | 'queueNumber'>) => Promise<void>;
  callNextCustomer: () => Promise<void>;
  updateQueueItemStatus: (id: string, status: QueueItem['status']) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  clearError: () => void;
}

type QueueStore = QueueState & QueueActions;

export const useQueueStore = create<QueueStore>((set, get) => ({
  // Initial state
  queueItems: [],
  currentlyServing: null,
  isLoading: false,
  error: null,

  // Actions
  fetchQueue: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const queueItems = generateMockQueue();
      set({
        queueItems,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania kolejki',
      });
    }
  },

  addToQueue: async (itemData: Omit<QueueItem, 'id' | 'arrivalTime' | 'queueNumber'>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { queueItems } = get();
      const nextQueueNumber = Math.max(...queueItems.map(item => item.queueNumber), 0) + 1;
      
      const newQueueItem: QueueItem = {
        ...itemData,
        id: `q_${Date.now()}`,
        arrivalTime: new Date(),
        queueNumber: nextQueueNumber,
        status: 'WAITING',
      };
      
      const updatedQueue = [...queueItems, newQueueItem];
      
      set({
        queueItems: updatedQueue,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd dodawania do kolejki',
      });
    }
  },

  callNextCustomer: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { queueItems } = get();
      
      // Find next waiting customer with highest priority
      const waitingCustomers = queueItems.filter(item => item.status === 'WAITING');
      
      if (waitingCustomers.length === 0) {
        throw new Error('Brak klientów w kolejce');
      }
      
      // Sort by priority and arrival time
      const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
      const nextCustomer = waitingCustomers.sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.arrivalTime.getTime() - b.arrivalTime.getTime();
      })[0];
      
      const updatedQueue = queueItems.map(item =>
        item.id === nextCustomer.id ? { ...item, status: 'IN_SERVICE' as const } : item
      );
      
      set({
        queueItems: updatedQueue,
        currentlyServing: { ...nextCustomer, status: 'IN_SERVICE' },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd wywoływania klienta',
      });
    }
  },

  updateQueueItemStatus: async (id: string, status: QueueItem['status']) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { queueItems, currentlyServing } = get();
      const updatedQueue = queueItems.map(item =>
        item.id === id ? { ...item, status } : item
      );
      
      const updatedCurrentlyServing = currentlyServing?.id === id
        ? (status === 'COMPLETED' ? null : { ...currentlyServing, status })
        : currentlyServing;
      
      set({
        queueItems: updatedQueue,
        currentlyServing: updatedCurrentlyServing,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd aktualizacji statusu kolejki',
      });
    }
  },

  removeFromQueue: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { queueItems, currentlyServing } = get();
      const updatedQueue = queueItems.filter(item => item.id !== id);
      const updatedCurrentlyServing = currentlyServing?.id === id ? null : currentlyServing;
      
      set({
        queueItems: updatedQueue,
        currentlyServing: updatedCurrentlyServing,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd usuwania z kolejki',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));