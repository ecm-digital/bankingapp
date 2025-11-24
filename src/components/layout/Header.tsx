import { Bell, Menu, Search, Settings, LayoutDashboard, CreditCard, Calendar, PieChart, Globe } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t, language, toggleLanguage } = useLanguage();

  const navItems = [
    { name: t.nav.dashboard, icon: LayoutDashboard, href: '/' },
    { name: t.nav.tracker, icon: PieChart, href: '/tracker' },
    { name: t.nav.transactions, icon: CreditCard, href: '/transactions' },
    { name: t.nav.calendar, icon: Calendar, href: '/calendar' },
    { name: t.nav.analytics, icon: PieChart, href: '/analytics' },
    { name: t.nav.settings, icon: Settings, href: '/settings' },
  ];

  return (
    <header className="bg-dashboard-bg py-4 sticky top-0 z-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl px-6 border border-white/10">
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
                <div className="h-6 w-6 rounded-full bg-dashboard-accent-green border-2 border-dashboard-bg z-10"></div>
                <div className="h-6 w-6 rounded-full bg-dashboard-text-light border-2 border-dashboard-bg"></div>
              </div>
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden lg:flex items-center bg-white/10 rounded-full p-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-dashboard-accent-teal text-white shadow-lg'
                      : 'text-dashboard-text-muted hover:text-white hover:bg-white/5'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
             <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-dashboard-text-muted hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button className="p-2 text-dashboard-text-muted hover:text-white transition-colors bg-white/10 rounded-full">
              <Search className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-dashboard-text-muted hover:text-white transition-colors bg-white/10 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-dashboard-accent-green ring-2 ring-dashboard-bg"></span>
            </button>

            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80" 
                alt="User" 
                className="h-8 w-8 rounded-full object-cover border-2 border-white/20"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}