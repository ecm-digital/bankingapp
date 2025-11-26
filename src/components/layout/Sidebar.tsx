import { Building2, X } from 'lucide-react';
import { Navigation } from './Navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar panel */}
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              {/* Close button */}
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-white hover:text-emerald-400 transition-colors"
                  onClick={onClose}
                  aria-label="Zamknij menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <SidebarContent onItemClick={onClose} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}

interface SidebarContentProps {
  onItemClick?: () => void;
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/20 backdrop-blur-xl border-r border-white/5 px-6 pb-4 shadow-2xl">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BankApp</span>
        </div>
      </div>

      {/* Navigation */}
      <div onClick={onItemClick}>
        <Navigation />
      </div>

      {/* Bottom section */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="text-xs text-gray-400 text-center">
          <p>Prototyp UX/UI</p>
          <p className="mt-1">© 2024 BankApp</p>
        </div>
      </div>
    </div>
  );
}