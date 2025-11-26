import { Clock, User, AlertCircle } from 'lucide-react';
import { QueueItem } from '@/types';

interface QueueDisplayProps {
  queueItems: QueueItem[];
  onCallCustomer: (item: QueueItem) => void;
  currentlyServing: QueueItem | null;
}

const priorityColors = {
  URGENT: 'bg-red-500/10 border-red-500/20 text-red-400',
  HIGH: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  NORMAL: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  LOW: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
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
        <div className="glass-panel rounded-2xl p-6 border-emerald-500/30 shadow-lg shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-8 -mt-8" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-emerald-400 mb-1 font-medium">Obecnie obsługiwany</p>
              <h3 className="text-3xl font-bold text-white mb-2">{currentlyServing.customerName}</h3>
              <div className="flex items-center gap-4 text-sm">
                <p className="text-gray-300">
                  Numer: <span className="font-mono font-bold text-emerald-400 text-lg">{currentlyServing.queueNumber}</span>
                </p>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <p className="text-gray-300">
                  Usługa: {currentlyServing.serviceType}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${priorityColors[currentlyServing.priority]
                }`}>
                {priorityLabels[currentlyServing.priority]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Waiting Queue */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">
            Kolejka Oczekujących ({waitingCustomers.length})
          </h3>
          {waitingCustomers.length > 0 && (
            <button
              onClick={() => onCallCustomer(waitingCustomers[0])}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              Wywołaj Następnego
            </button>
          )}
        </div>

        {waitingCustomers.length > 0 ? (
          <div className="space-y-3">
            {waitingCustomers.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all hover:bg-white/5 ${index === 0
                    ? 'bg-emerald-500/5 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'bg-black/20 border-white/5'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${index === 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-white/10'
                        }`}>
                        {item.queueNumber}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="font-medium text-white">{item.customerName}</p>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.serviceType}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        <p className="text-xs text-gray-500">
                          Oczekuje: {Math.round((Date.now() - item.arrivalTime.getTime()) / 60000)} min
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[item.priority]
                      }`}>
                      {priorityLabels[item.priority]}
                    </span>
                    <button
                      onClick={() => onCallCustomer(item)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
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
            <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Brak klientów w kolejce</p>
          </div>
        )}
      </div>

      {/* In Service */}
      {inServiceCustomers.length > 0 && (
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Obecnie Obsługiwani ({inServiceCustomers.length})
          </h3>
          <div className="space-y-3">
            {inServiceCustomers.map((item) => (
              <div key={item.id} className="p-4 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{item.customerName}</p>
                    <p className="text-sm text-gray-400">{item.serviceType}</p>
                    {item.assignedEmployee && (
                      <p className="text-xs text-gray-500 mt-1">
                        Pracownik: {item.assignedEmployee}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
