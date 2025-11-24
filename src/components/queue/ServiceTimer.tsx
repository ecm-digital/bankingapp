import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
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
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Brak aktywnej obsługi</p>
            <p className="text-sm text-gray-400 mt-1">
              Wywołaj klienta, aby rozpocząć pomiar czasu
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Timer Obsługi</h3>
          <p className="text-sm text-gray-600 mb-4">
            Klient: <strong>{customer.customerName}</strong>
          </p>

          {/* Timer Display */}
          <div className="bg-gray-900 rounded-lg p-8 mb-6">
            <div className="text-6xl font-mono font-bold text-white">
              {formatTime(elapsedTime)}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Szacowany czas: {customer.estimatedTime} min
            </p>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-3 mb-4">
            {!isRunning ? (
              <Button
                variant="primary"
                onClick={handleStart}
                className="flex-1 max-w-xs"
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handlePause}
                className="flex-1 max-w-xs"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pauza
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleStop}
              disabled={elapsedTime === 0}
            >
              <Square className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Complete Service */}
          <Button
            variant="primary"
            onClick={handleComplete}
            className="w-full"
            disabled={elapsedTime === 0}
          >
            Zakończ Obsługę
          </Button>

          {/* Service Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Usługa</p>
                <p className="font-medium text-gray-900">{customer.serviceType}</p>
              </div>
              <div>
                <p className="text-gray-500">Priorytet</p>
                <p className="font-medium text-gray-900">
                  {customer.priority === 'URGENT' ? 'Pilny' :
                   customer.priority === 'HIGH' ? 'Wysoki' :
                   customer.priority === 'NORMAL' ? 'Normalny' : 'Niski'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
