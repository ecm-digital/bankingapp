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
    // Reset timer when customer changes
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
      <div className="glass-panel rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Brak aktywnej obsługi</p>
          <p className="text-sm text-gray-500 mt-1">
            Wywołaj klienta, aby rozpocząć pomiar czasu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 h-full">
      <div className="text-center">
        <h3 className="text-lg font-medium text-white mb-2">Timer Obsługi</h3>
        <p className="text-sm text-gray-400 mb-4">
          Klient: <strong className="text-white">{customer.customerName}</strong>
        </p>

        {/* Timer Display */}
        <div className="bg-black/40 rounded-xl p-8 mb-6 border border-white/5 shadow-inner">
          <div className={`text-6xl font-mono font-bold transition-colors duration-500 ${elapsedTime > customer.estimatedTime * 60 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
            }`}>
            {formatTime(elapsedTime)}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Szacowany czas: {customer.estimatedTime} min
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-3 mb-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Play className="h-5 w-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors shadow-lg shadow-yellow-500/20"
            >
              <Pause className="h-5 w-5" />
              Pauza
            </button>
          )}
          <button
            onClick={handleStop}
            disabled={elapsedTime === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="h-5 w-5" />
            Reset
          </button>
        </div>

        {/* Complete Service */}
        <button
          onClick={handleComplete}
          disabled={elapsedTime === 0}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zakończ Obsługę
        </button>

        {/* Service Info */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Usługa</p>
              <p className="font-medium text-white">{customer.serviceType}</p>
            </div>
            <div>
              <p className="text-gray-500">Priorytet</p>
              <p className={`font-medium ${customer.priority === 'URGENT' ? 'text-red-400' :
                customer.priority === 'HIGH' ? 'text-orange-400' :
                  customer.priority === 'NORMAL' ? 'text-blue-400' : 'text-gray-400'
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
