import { useState } from 'react';
import { CreditCard, Calendar, DollarSign, Activity } from 'lucide-react';
import { Modal } from '@/components/ui';
import { Card } from '@/types';
import { formatDate, formatCurrency } from '@/utils';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  onUpdateLimits?: (cardId: string, newLimit: number) => void;
}

export function CardDetailsModal({ isOpen, onClose, card, onUpdateLimits }: CardDetailsModalProps) {
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [newLimit, setNewLimit] = useState(card.creditLimit?.toString() || '');

  const handleSaveLimit = () => {
    const limitValue = parseFloat(newLimit);
    if (limitValue > 0 && onUpdateLimits) {
      onUpdateLimits(card.id, limitValue);
      setIsEditingLimit(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Szczegóły Karty">
      <div className="space-y-6">
        {/* Card Visual Summary */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl p-6 text-white border border-white/10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-300">
                  {card.cardType === 'DEBIT' ? 'Karta Debetowa' :
                    card.cardType === 'CREDIT' ? 'Karta Kredytowa' : 'Karta Przedpłacona'}
                </p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{card.cardBrand}</p>
              </div>
              <CreditCard className="h-12 w-12 text-emerald-400 opacity-80" />
            </div>
            <p className="text-xl font-mono tracking-wider text-emerald-100">{card.cardNumber}</p>
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <Calendar className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Daty</p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-white">
                  <span className="font-medium text-gray-400">Wydana:</span> {formatDate(card.issuedDate)}
                </p>
                <p className="text-sm text-white">
                  <span className="font-medium text-gray-400">Ważna do:</span> {formatDate(card.expiryDate)}
                </p>
                {card.lastUsed && (
                  <p className="text-sm text-white">
                    <span className="font-medium text-gray-400">Ostatnie użycie:</span> {formatDate(card.lastUsed)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {card.cardType === 'CREDIT' && card.creditLimit && (
            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <DollarSign className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-2">Limity kredytowe</p>

                {isEditingLimit ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      placeholder="Nowy limit"
                      className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveLimit}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                      >
                        Zapisz
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingLimit(false);
                          setNewLimit(card.creditLimit?.toString() || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Limit kredytowy:</span>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(card.creditLimit, 'PLN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Dostępny limit:</span>
                      <span className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(card.availableLimit || 0, 'PLN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Wykorzystane:</span>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(card.creditLimit - (card.availableLimit || 0), 'PLN')}
                      </span>
                    </div>
                    {onUpdateLimits && (
                      <button
                        onClick={() => setIsEditingLimit(true)}
                        className="w-full mt-2 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-emerald-400 transition-colors"
                      >
                        Zmień limit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <Activity className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400 mb-2">Status karty</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Aktualny status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${card.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      card.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        card.status === 'EXPIRED' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                    {card.status === 'ACTIVE' ? 'Aktywna' :
                      card.status === 'BLOCKED' ? 'Zablokowana' :
                        card.status === 'EXPIRED' ? 'Wygasła' : 'Oczekująca'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">ID karty:</span>
                  <span className="text-sm font-mono text-gray-300">{card.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-300">
            <strong className="text-blue-200">Uwaga:</strong> Zmiany limitów kredytowych mogą wymagać dodatkowej weryfikacji
            i zostaną zastosowane w ciągu 24 godzin.
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </Modal>
  );
}
