import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  const popularPages = [
    { name: 'Dashboard', path: '/' },
    { name: 'Klienci', path: '/customers' },
    { name: 'Transakcje', path: '/transactions' },
    { name: 'Kolejka', path: '/queue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-100 text-red-600 mb-6">
            <AlertCircle className="h-16 w-16" />
          </div>
          <h1 className="text-9xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Strona nie została znaleziona
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Przepraszamy, strona której szukasz nie istnieje lub została przeniesiona.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Powrót do Dashboard
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Wstecz
          </Button>
        </div>

        {/* Popular Pages */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Popularne strony
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularPages.map((page) => (
              <button
                key={page.path}
                onClick={() => navigate(page.path)}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium text-slate-700 hover:text-blue-700"
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 mt-8">
          Jeśli uważasz, że to błąd, skontaktuj się z administratorem systemu.
        </p>
      </div>
    </div>
  );
}
