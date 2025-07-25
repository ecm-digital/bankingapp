import { useQueueStore } from '@/stores/queueStore';
import { useCallback, useEffect } from 'react';
import { QueueItem } from '@/types';

export const useQueue = () => {
  const {
    queueItems,
    currentlyServing,
    isLoading,
    error,
    fetchQueue,
    addToQueue,
    callNextCustomer,
    updateQueueItemStatus,
    removeFromQueue,
    clearError,
  } = useQueueStore();

  // Auto-fetch queue on mount
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleAddToQueue = useCallback(async (
    itemData: Omit<QueueItem, 'id' | 'arrivalTime' | 'queueNumber'>
  ) => {
    try {
      await addToQueue(itemData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error adding to queue' 
      };
    }
  }, [addToQueue]);

  const handleCallNext = useCallback(async () => {
    try {
      await callNextCustomer();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error calling customer' 
      };
    }
  }, [callNextCustomer]);

  const handleUpdateStatus = useCallback(async (
    itemId: string, 
    status: QueueItem['status']
  ) => {
    try {
      await updateQueueItemStatus(itemId, status);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Status update error' 
      };
    }
  }, [updateQueueItemStatus]);

  const handleRemoveFromQueue = useCallback(async (itemId: string) => {
    try {
      await removeFromQueue(itemId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error removing from queue' 
      };
    }
  }, [removeFromQueue]);

  // Helper functions for queue management
  const getQueueByStatus = useCallback((status: QueueItem['status']) => {
    return queueItems.filter(item => item.status === status);
  }, [queueItems]);

  const getQueueByPriority = useCallback((priority: QueueItem['priority']) => {
    return queueItems.filter(item => item.priority === priority);
  }, [queueItems]);

  const getEstimatedWaitTime = useCallback((queueNumber: number) => {
    const itemsAhead = queueItems.filter(
      item => item.queueNumber < queueNumber && item.status === 'WAITING'
    );
    
    // Estimate 15 minutes per customer ahead
    return itemsAhead.length * 15;
  }, [queueItems]);

  const getAverageWaitTime = useCallback(() => {
    const completedToday = queueItems.filter(item => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const itemDate = new Date(item.arrivalTime);
      itemDate.setHours(0, 0, 0, 0);
      
      return item.status === 'COMPLETED' && itemDate.getTime() === today.getTime();
    });
    
    if (completedToday.length === 0) return 0;
    
    const totalWaitTime = completedToday.reduce((total, item) => {
      return total + item.estimatedTime;
    }, 0);
    
    return Math.round(totalWaitTime / completedToday.length);
  }, [queueItems]);

  return {
    // State
    queueItems,
    currentlyServing,
    isLoading,
    error,
    
    // Actions
    fetchQueue,
    addToQueue: handleAddToQueue,
    callNextCustomer: handleCallNext,
    updateQueueItemStatus: handleUpdateStatus,
    removeFromQueue: handleRemoveFromQueue,
    clearError,
    
    // Computed
    hasQueue: queueItems.length > 0,
    waitingCustomers: getQueueByStatus('WAITING'),
    inServiceCustomers: getQueueByStatus('IN_SERVICE'),
    completedCustomers: getQueueByStatus('COMPLETED'),
    urgentCustomers: getQueueByPriority('URGENT'),
    highPriorityCustomers: getQueueByPriority('HIGH'),
    queueLength: queueItems.filter(item => item.status === 'WAITING').length,
    
    // Helper functions
    getQueueByStatus,
    getQueueByPriority,
    getEstimatedWaitTime,
    getAverageWaitTime,
  };
};