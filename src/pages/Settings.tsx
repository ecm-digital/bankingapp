import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Settings as SettingsIcon, Shield, Bell, User, Save, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Wymagane'),
  newPassword: z.string().min(8, 'Hasło musi mieć min. 8 znaków'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function Settings() {
  const { currentEmployee, updateProfile, isLoading } = useAuthStore();
  const { toasts, success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentEmployee?.firstName || '',
      lastName: currentEmployee?.lastName || '',
      email: currentEmployee?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      success('Profil zaktualizowany', 'Twoje dane zostały pomyślnie zapisane.');
    } catch (err) {
      error('Błąd aktualizacji', 'Nie udało się zapisać zmian.');
    }
  };

  const onPasswordSubmit = async (_data: PasswordFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    success('Hasło zmienione', 'Wyloguj się i zaloguj ponownie aby użyć nowego hasła.');
    passwordForm.reset();
  };

  if (!currentEmployee) return null;

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ustawienia Systemu</h1>
        <p className="text-slate-500 mt-1">
          Zarządzaj swoim profilem i preferencjami aplikacji
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Mój Profil</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'security'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Shield className="h-5 w-5" />
            <span className="font-medium">Bezpieczeństwo</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'notifications'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Bell className="h-5 w-5" />
            <span className="font-medium">Powiadomienia</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
                    {currentEmployee.firstName[0]}{currentEmployee.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {currentEmployee.firstName} {currentEmployee.lastName}
                    </h2>
                    <p className="text-sm text-slate-500">{currentEmployee.role} • {currentEmployee.department}</p>
                  </div>
                </div>

                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5 max-w-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Imię</label>
                      <input
                        {...profileForm.register('firstName')}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-xs text-red-600">{profileForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nazwisko</label>
                      <input
                        {...profileForm.register('lastName')}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-xs text-red-600">{profileForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Adres Email</label>
                    <input
                      {...profileForm.register('email')}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-xs text-red-600">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Zapisywanie...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Zapisz Zmiany
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Zmiana Hasła</h3>
                  <p className="text-sm text-slate-500">Pamiętaj o używaniu silnego hasła</p>
                </div>

                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Aktualne Hasło</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        {...passwordForm.register('currentPassword')}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-xs text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nowe Hasło</label>
                      <input
                        type="password"
                        {...passwordForm.register('newPassword')}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-xs text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Potwierdź Hasło</label>
                      <input
                        type="password"
                        {...passwordForm.register('confirmPassword')}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={passwordForm.formState.isSubmitting}
                      className="flex items-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50 border border-slate-300"
                    >
                      {passwordForm.formState.isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <SettingsIcon className="h-4 w-4 mr-2" />
                      )}
                      Zmień Hasło
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Preferencje Powiadomień</h3>
                  <p className="text-sm text-slate-500">Wybierz, jakie powiadomienia chcesz otrzymywać</p>
                </div>

                <div className="space-y-3 max-w-2xl">
                  {[
                    { title: 'Nowe zadania', desc: 'Powiadomienia o przypisaniu nowych zadań lub klientów' },
                    { title: 'Wiadomości od klientów', desc: 'Gdy klient wyśle wiadomość przez portal' },
                    { title: 'Alerty bezpieczeństwa', desc: 'Ważne informacje dotyczące bezpieczeństwa konta' },
                    { title: 'Aktualizacje systemu', desc: 'Informacje o przerwach technicznych i nowościach' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="font-medium text-slate-900">{item.title}</label>
                        <p className="text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}