import { Bell, Menu, Search, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-transparent py-4 lg:py-6 sticky top-0 z-40 transition-all duration-300">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl px-4 lg:px-8 border border-white/10 shadow-2xl">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors mr-4"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-white/10 z-10 shadow-lg"></div>
                <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/10"></div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
            >
              <Globe className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button className="p-2 text-gray-300 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 border border-white/5">
              <Search className="h-5 w-5" />
            </button>

            <button className="p-2 text-gray-300 hover:text-white transition-colors bg-white/5 rounded-full relative hover:bg-white/10 border border-white/5">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-black/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </button>

            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
                alt="User"
                className="h-8 w-8 rounded-full object-cover border-2 border-white/10"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}