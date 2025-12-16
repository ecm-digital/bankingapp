import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  CreditCard, 
  Package, 
  PiggyBank,
  ListOrdered,
  BarChart3,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationProps {
  onItemClick?: () => void;
}

export function Navigation({ onItemClick }: NavigationProps) {
  const { t } = useLanguage();
  
  const navItems = [
    { name: t.nav.dashboard, href: '/', icon: LayoutDashboard },
    { name: t.nav.customers, href: '/customers', icon: Users },
    { name: t.nav.transactions, href: '/transactions', icon: ArrowLeftRight },
    { name: t.nav.cards, href: '/cards', icon: CreditCard },
    { name: t.nav.products, href: '/products', icon: Package },
    { name: t.nav.loans, href: '/loans', icon: PiggyBank },
    { name: t.nav.queue, href: '/queue', icon: ListOrdered },
    { name: t.nav.reports, href: '/reports', icon: BarChart3 },
    { name: t.nav.settings, href: '/settings', icon: Settings },
  ];

  return (
    <nav className="px-3 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`
          }
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}