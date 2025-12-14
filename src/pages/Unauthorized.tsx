import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldX, Home, LogOut, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-amber-100 text-amber-600 mb-6">
            <ShieldX className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Brak dostępu
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Nie masz uprawnień do przeglądania tej strony.
          </p>
        </div>

        {/* Warning Message */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 max-w-lg mx-auto">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-semibold text-amber-900 mb-2">
                Wymagane uprawnienia
              </h3>
              <p className="text-sm text-amber-800">
                Ta strona wymaga specjalnych uprawnień, których Twoje konto nie posiada. 
                Skontaktuj się z administratorem, jeśli uważasz, że powinieneś mieć dostęp.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Wyloguj się
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 mt-8">
          Jeśli potrzebujesz dostępu do tej funkcji, skontaktuj się z administratorem systemu.
        </p>
      </div>
    </div>
  );
}
