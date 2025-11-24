import { useEffect } from 'react';
import { QueueDisplay, ServiceTimer, QueueStatistics } from '@/components/queue';
import { useQueueStore } from '@/stores/queueStore';

export function Queue() {
  const {
    queueItems,
    currentlyServing,
    fetchQueue,
    callNextCustomer,
    updateQueueItemStatus,
  } = useQueueStore();

  useEffect(() => {
    fetchQueue();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchQueue();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleCallCustomer = async () => {
    await callNextCustomer();
  };

  const handleCompleteService = async () => {
    if (currentlyServing) {
      await updateQueueItemStatus(currentlyServing.id, 'COMPLETED');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Zarządzanie Kolejką</h1>
        <p className="mt-1 text-sm text-gray-500">
          System zarządzania kolejką klientów w oddziale
        </p>
      </div>

      {/* Queue Statistics */}
      <QueueStatistics queueItems={queueItems} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Display */}
        <div className="lg:col-span-2">
          <QueueDisplay
            queueItems={queueItems}
            onCallCustomer={handleCallCustomer}
            currentlyServing={currentlyServing}
          />
        </div>

        {/* Service Timer */}
        <div className="lg:col-span-1">
          <ServiceTimer
            customer={currentlyServing}
            onComplete={handleCompleteService}
          />
        </div>
      </div>
    </div>
  );
}