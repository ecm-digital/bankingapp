import { 
  Home, 
  Users, 
  CreditCard, 
  Clock, 
  DollarSign, 
  Building2, 
  Settings,
  BarChart3
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/index';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  const { t } = useLanguage();

  const defaultItems: NavigationItem[] = [
    { name: t.nav.dashboard, href: '/', icon: Home },
    { name: t.nav.customers, href: '/customers', icon: Users },
    { name: t.nav.transactions, href: '/transactions', icon: CreditCard },
    { name: t.nav.queue, href: '/queue', icon: Clock, badge: 3 },
    { name: t.nav.cards, href: '/cards', icon: CreditCard },
    { name: t.nav.loans, href: '/loans', icon: DollarSign },
    { name: t.nav.products, href: '/products', icon: Building2 },
    { name: t.nav.reports, href: '/reports', icon: BarChart3 },
    { name: t.nav.settings, href: '/settings', icon: Settings },
  ];

  const displayItems = items || defaultItems;

  return (
    <nav className={cn('flex flex-1 flex-col', className)}>
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {displayItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'h-6 w-6 shrink-0 transition-colors',
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-400 group-hover:text-white'
                        )}
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
