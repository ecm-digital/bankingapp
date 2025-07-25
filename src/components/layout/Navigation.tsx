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

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Klienci', href: '/customers', icon: Users },
  { name: 'Transakcje', href: '/transactions', icon: CreditCard },
  { name: 'Kolejka', href: '/queue', icon: Clock, badge: 3 },
  { name: 'Karty', href: '/cards', icon: CreditCard },
  { name: 'Kredyty', href: '/loans', icon: DollarSign },
  { name: 'Produkty', href: '/products', icon: Building2 },
  { name: 'Raporty', href: '/reports', icon: BarChart3 },
  { name: 'Ustawienia', href: '/settings', icon: Settings },
];

interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
}

export function Navigation({ items = navigationItems, className }: NavigationProps) {
  return (
    <nav className={cn('flex flex-1 flex-col', className)}>
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {items.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'h-6 w-6 shrink-0 transition-colors',
                          isActive 
                            ? 'text-primary-600' 
                            : 'text-gray-400 group-hover:text-primary-600'
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