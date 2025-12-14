import { X } from 'lucide-react';
import { Navigation } from './Navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-slate-900 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">BankApp</h1>
              <p className="text-slate-400 text-xs">Panel Pracownika</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <Navigation onItemClick={onClose} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="px-3 py-2 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Aktywna sesja</p>
            <p className="text-white text-sm font-medium">Oddział: Warszawa Centrum</p>
            <p className="text-slate-400 text-xs mt-1">Stanowisko: OK-01</p>
          </div>
        </div>
      </aside>
    </>
  );
}