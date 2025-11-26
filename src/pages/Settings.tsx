import { Settings as SettingsIcon, Shield, Bell, User } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Ustawienia Systemu</h1>
        <p className="mt-1 text-sm text-gray-400">
          Konfiguracja aplikacji i preferencje użytkownika
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-white/10">
        <div className="flex justify-center space-x-4 mb-6">
          <div className="p-4 rounded-full bg-gray-500/10 animate-spin-slow">
            <SettingsIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Panel Ustawień w Budowie</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Wkrótce będziesz mógł zarządzać wszystkimi aspektami systemu z tego miejsca.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 opacity-50">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium text-gray-300">Bezpieczeństwo</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 opacity-50">
            <Bell className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Powiadomienia</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 opacity-50">
            <User className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Profil</span>
          </div>
        </div>
      </div>
    </div>
  );
}