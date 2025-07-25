import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();
  
  // Generate breadcrumb items from current path if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-300 mx-2" />
            {item.href && index < breadcrumbItems.length - 1 ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const routeLabels: Record<string, string> = {
    customers: 'Klienci',
    transactions: 'Transakcje',
    queue: 'Kolejka',
    cards: 'Karty',
    loans: 'Kredyty',
    products: 'Produkty',
    reports: 'Raporty',
    settings: 'Ustawienia',
  };

  return pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return {
      label,
      href: index < pathSegments.length - 1 ? href : undefined,
    };
  });
}