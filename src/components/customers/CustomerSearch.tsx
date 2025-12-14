import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Customer } from '@/types';
import { getInitials } from '@/utils';

interface CustomerSearchProps {
  onSearch: (query: string) => void;
  searchResults: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  isLoading?: boolean;
}

export function CustomerSearch({
  onSearch,
  searchResults,
  onSelectCustomer,
  isLoading = false
}: CustomerSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim().length >= 2) {
        onSearch(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    setQuery('');
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Szukaj klienta po nazwisku, email, telefonie lub ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Wyszukiwanie...
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {searchResults.map((customer) => {
                const initials = getInitials(
                  customer.personalInfo.firstName,
                  customer.personalInfo.lastName
                );
                return (
                  <li key={customer.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full px-4 py-3 hover:bg-slate-50 transition-colors text-left flex items-center space-x-3 group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {customer.personalInfo.email} • {customer.personalInfo.phone}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          ID: {customer.id}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {customer.bankingInfo.segment}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Nie znaleziono klientów
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}