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

const navItems = [
  { name: 'Pulpit', href: '/', icon: LayoutDashboard },
  { name: 'Klienci', href: '/customers', icon: Users },
  { name: 'Transakcje', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Karty', href: '/cards', icon: CreditCard },
  { name: 'Produkty', href: '/products', icon: Package },
  { name: 'Kredyty', href: '/loans', icon: PiggyBank },
  { name: 'Kolejka', href: '/queue', icon: ListOrdered },
  { name: 'Raporty', href: '/reports', icon: BarChart3 },
  { name: 'Ustawienia', href: '/settings', icon: Settings },
];

interface NavigationProps {
  onItemClick?: () => void;
}

export function Navigation({ onItemClick }: NavigationProps) {
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