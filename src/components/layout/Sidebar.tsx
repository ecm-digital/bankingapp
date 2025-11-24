import { Building2, X } from 'lucide-react';
import { Navigation } from './Navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile sidebar overlay - Only visible when isOpen is true */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
            <div className="relative flex w-full flex-1 flex-col transform transition-transform duration-300 ease-out translate-x-0">
              {/* Close button */}
              <div className="absolute -right-12 top-0 flex w-12 justify-center pt-5">
                <button 
                  type="button" 
                  className="p-2.5 text-white hover:text-gray-300 transition-colors bg-black/40 rounded-full backdrop-blur-sm"
                  onClick={onClose}
                  aria-label={t.common.closeMenu}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <SidebarContent onItemClick={onClose} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar - Only visible on large screens and above */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-40 lg:w-64">
        <SidebarContent />
      </div>
    </>
  );
}

interface SidebarContentProps {
  onItemClick?: () => void;
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/20 backdrop-blur-xl px-4 sm:px-6 pb-4 pt-4 sm:pt-0 shadow-2xl border-r border-white/10 h-full">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
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
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
          <p>{t.common.prototype}</p>
          <p className="mt-1">© 2024 BankApp</p>
        </div>
      </div>
    </div>
  );
}