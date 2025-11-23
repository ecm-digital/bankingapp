import { useState } from 'react';
import { CreditCard, Calendar, DollarSign, Activity } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
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
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-75">
                {card.cardType === 'DEBIT' ? 'Karta Debetowa' :
                 card.cardType === 'CREDIT' ? 'Karta Kredytowa' : 'Karta Przedpłacona'}
              </p>
              <p className="text-2xl font-bold mt-1">{card.cardBrand}</p>
            </div>
            <CreditCard className="h-12 w-12 opacity-75" />
          </div>
          <p className="text-xl font-mono tracking-wider">{card.cardNumber}</p>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Daty</p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Wydana:</span> {formatDate(card.issuedDate)}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Ważna do:</span> {formatDate(card.expiryDate)}
                </p>
                {card.lastUsed && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Ostatnie użycie:</span> {formatDate(card.lastUsed)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {card.cardType === 'CREDIT' && card.creditLimit && (
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">Limity kredytowe</p>
                
                {isEditingLimit ? (
                  <div className="space-y-3">
                    <Input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      placeholder="Nowy limit"
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveLimit}
                      >
                        Zapisz
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsEditingLimit(false);
                          setNewLimit(card.creditLimit?.toString() || '');
                        }}
                      >
                        Anuluj
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Limit kredytowy:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(card.creditLimit, 'PLN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dostępny limit:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(card.availableLimit || 0, 'PLN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Wykorzystane:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(card.creditLimit - (card.availableLimit || 0), 'PLN')}
                      </span>
                    </div>
                    {onUpdateLimits && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingLimit(true)}
                        className="w-full mt-2"
                      >
                        Zmień limit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-2">Status karty</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aktualny status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    card.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    card.status === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                    card.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {card.status === 'ACTIVE' ? 'Aktywna' :
                     card.status === 'BLOCKED' ? 'Zablokowana' :
                     card.status === 'EXPIRED' ? 'Wygasła' : 'Oczekująca'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ID karty:</span>
                  <span className="text-sm font-mono text-gray-900">{card.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Uwaga:</strong> Zmiany limitów kredytowych mogą wymagać dodatkowej weryfikacji
            i zostaną zastosowane w ciągu 24 godzin.
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Zamknij
          </Button>
        </div>
      </div>
    </Modal>
  );
}
