import { Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between text-sm text-gray-500">
        {/* Left side - Connection status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
              {isOnline ? 'Połączono' : 'Brak połączenia'}
            </span>
          </div>
          
          <div className="hidden sm:block">
            <span>Wersja 1.0.0</span>
          </div>
        </div>

        {/* Right side - Date and time */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="font-mono">
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}