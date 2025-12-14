import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { QueueItem } from '@/types';

interface ServiceTimerProps {
  customer: QueueItem | null;
  onComplete: () => void;
}

export function ServiceTimer({ customer, onComplete }: ServiceTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && customer) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, customer]);

  useEffect(() => {
    setElapsedTime(0);
    setIsRunning(false);
  }, [customer?.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const handleComplete = () => {
    setIsRunning(false);
    onComplete();
    setElapsedTime(0);
  };

  if (!customer) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex items-center justify-center">
        <div className="text-center py-8">
          <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Brak aktywnej obsługi</p>
          <p className="text-sm text-slate-400 mt-1">
            Wywołaj klienta, aby rozpocząć pomiar czasu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full">
      <div className="text-center">
        <h3 className="text-base font-semibold text-slate-900 mb-2">Timer Obsługi</h3>
        <p className="text-sm text-slate-500 mb-4">
          Klient: <span className="font-medium text-slate-900">{customer.customerName}</span>
        </p>

        {/* Timer Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
          <div className={`text-5xl font-mono font-bold ${elapsedTime > customer.estimatedTime * 60 ? 'text-red-600' : 'text-green-600'}`}>
            {formatTime(elapsedTime)}
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Szacowany czas: {customer.estimatedTime} min
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-2 mb-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
            >
              <Pause className="h-4 w-4" />
              Pauza
            </button>
          )}
          <button
            onClick={handleStop}
            disabled={elapsedTime === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300"
          >
            <Square className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Complete Service */}
        <button
          onClick={handleComplete}
          disabled={elapsedTime === 0}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zakończ Obsługę
        </button>

        {/* Service Info */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Usługa</p>
              <p className="font-medium text-slate-900">{customer.serviceType}</p>
            </div>
            <div>
              <p className="text-slate-500">Priorytet</p>
              <p className={`font-medium ${customer.priority === 'URGENT' ? 'text-red-600' :
                customer.priority === 'HIGH' ? 'text-orange-600' :
                  customer.priority === 'NORMAL' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                {customer.priority === 'URGENT' ? 'Pilny' :
                  customer.priority === 'HIGH' ? 'Wysoki' :
                    customer.priority === 'NORMAL' ? 'Normalny' : 'Niski'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}