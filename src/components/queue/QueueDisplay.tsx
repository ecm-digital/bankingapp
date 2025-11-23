import { Clock, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { QueueItem } from '@/types';

interface QueueDisplayProps {
  queueItems: QueueItem[];
  onCallCustomer: (item: QueueItem) => void;
  currentlyServing: QueueItem | null;
}

const priorityColors = {
  URGENT: 'bg-red-100 border-red-300 text-red-800',
  HIGH: 'bg-orange-100 border-orange-300 text-orange-800',
  NORMAL: 'bg-blue-100 border-blue-300 text-blue-800',
  LOW: 'bg-gray-100 border-gray-300 text-gray-800',
};

const priorityLabels = {
  URGENT: 'Pilne',
  HIGH: 'Wysoki',
  NORMAL: 'Normalny',
  LOW: 'Niski',
};

export function QueueDisplay({ queueItems, onCallCustomer, currentlyServing }: QueueDisplayProps) {
  const waitingCustomers = queueItems.filter(item => item.status === 'WAITING');
  const inServiceCustomers = queueItems.filter(item => item.status === 'IN_SERVICE');

  return (
    <div className="space-y-6">
      {/* Currently Serving */}
      {currentlyServing && (
        <Card className="border-2 border-primary-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Obecnie obsługiwany</p>
                <h3 className="text-2xl font-bold text-gray-900">{currentlyServing.customerName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Numer: <span className="font-mono font-semibold">{currentlyServing.queueNumber}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Usługa: {currentlyServing.serviceType}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  priorityColors[currentlyServing.priority]
                }`}>
                  {priorityLabels[currentlyServing.priority]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting Queue */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Kolejka Oczekujących ({waitingCustomers.length})
            </h3>
            {waitingCustomers.length > 0 && (
              <Button
                variant="primary"
                onClick={() => onCallCustomer(waitingCustomers[0])}
              >
                Wywołaj Następnego
              </Button>
            )}
          </div>

          {waitingCustomers.length > 0 ? (
            <div className="space-y-3">
              {waitingCustomers.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    index === 0 ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
                          {item.queueNumber}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="font-medium text-gray-900">{item.customerName}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.serviceType}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            Oczekuje: {Math.round((Date.now() - item.arrivalTime.getTime()) / 60000)} min
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        priorityColors[item.priority]
                      }`}>
                        {priorityLabels[item.priority]}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onCallCustomer(item)}
                      >
                        Wywołaj
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Brak klientów w kolejce</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In Service */}
      {inServiceCustomers.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Obecnie Obsługiwani ({inServiceCustomers.length})
            </h3>
            <div className="space-y-3">
              {inServiceCustomers.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.customerName}</p>
                      <p className="text-sm text-gray-600">{item.serviceType}</p>
                      {item.assignedEmployee && (
                        <p className="text-xs text-gray-500 mt-1">
                          Pracownik: {item.assignedEmployee}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      W trakcie obsługi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
