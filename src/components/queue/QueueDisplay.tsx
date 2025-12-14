import { Clock, User, AlertCircle } from 'lucide-react';
import { QueueItem } from '@/types';

interface QueueDisplayProps {
  queueItems: QueueItem[];
  onCallCustomer: (item: QueueItem) => void;
  currentlyServing: QueueItem | null;
}

const priorityColors = {
  URGENT: 'bg-red-100 border-red-200 text-red-700',
  HIGH: 'bg-orange-100 border-orange-200 text-orange-700',
  NORMAL: 'bg-blue-100 border-blue-200 text-blue-700',
  LOW: 'bg-slate-100 border-slate-200 text-slate-700',
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1 font-medium">Obecnie obsługiwany</p>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentlyServing.customerName}</h3>
              <div className="flex items-center gap-4 text-sm">
                <p className="text-slate-600">
                  Numer: <span className="font-mono font-bold text-green-600 text-lg">{currentlyServing.queueNumber}</span>
                </p>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <p className="text-slate-600">
                  Usługa: {currentlyServing.serviceType}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[currentlyServing.priority]}`}>
                {priorityLabels[currentlyServing.priority]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Waiting Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            Kolejka Oczekujących ({waitingCustomers.length})
          </h3>
          {waitingCustomers.length > 0 && (
            <button
              onClick={() => onCallCustomer(waitingCustomers[0])}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Wywołaj Następnego
            </button>
          )}
        </div>

        {waitingCustomers.length > 0 ? (
          <div className="space-y-2">
            {waitingCustomers.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all hover:bg-slate-50 ${index === 0
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-slate-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-blue-600' : 'bg-slate-400'}`}>
                        {item.queueNumber}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <p className="font-medium text-slate-900">{item.customerName}</p>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{item.serviceType}</p>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-xs text-slate-400">
                          Oczekuje: {Math.round((Date.now() - item.arrivalTime.getTime()) / 60000)} min
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[item.priority]}`}>
                      {priorityLabels[item.priority]}
                    </span>
                    <button
                      onClick={() => onCallCustomer(item)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Wywołaj
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Brak klientów w kolejce</p>
          </div>
        )}
      </div>

      {/* In Service */}
      {inServiceCustomers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Obecnie Obsługiwani ({inServiceCustomers.length})
          </h3>
          <div className="space-y-2">
            {inServiceCustomers.map((item) => (
              <div key={item.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{item.customerName}</p>
                    <p className="text-sm text-slate-500">{item.serviceType}</p>
                    {item.assignedEmployee && (
                      <p className="text-xs text-slate-400 mt-1">
                        Pracownik: {item.assignedEmployee}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    W trakcie obsługi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}