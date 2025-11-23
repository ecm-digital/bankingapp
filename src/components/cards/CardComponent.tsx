import { CreditCard, Lock, Unlock, Settings } from 'lucide-react';
import { Card as UICard, CardContent, Button } from '@/components/ui';
import { Card } from '@/types';
import { formatDate } from '@/utils';

interface CardComponentProps {
  card: Card;
  onViewDetails: (card: Card) => void;
  onBlockCard?: (card: Card) => void;
  onUnblockCard?: (card: Card) => void;
}

const cardBrandColors = {
  VISA: 'from-blue-600 to-blue-800',
  MASTERCARD: 'from-orange-600 to-red-700',
  AMEX: 'from-gray-700 to-gray-900',
};

const cardTypeLabels = {
  DEBIT: 'Debetowa',
  CREDIT: 'Kredytowa',
  PREPAID: 'Przedpłacona',
};

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  BLOCKED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
};

const statusLabels = {
  ACTIVE: 'Aktywna',
  BLOCKED: 'Zablokowana',
  EXPIRED: 'Wygasła',
  PENDING: 'Oczekująca',
};

export function CardComponent({ card, onViewDetails, onBlockCard, onUnblockCard }: CardComponentProps) {
  const isExpired = new Date(card.expiryDate) < new Date();
  const displayStatus = isExpired ? 'EXPIRED' : card.status;

  return (
    <UICard className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Card Visual */}
        <div className={`bg-gradient-to-br ${cardBrandColors[card.cardBrand]} p-6 text-white relative`}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs opacity-75 mb-1">{cardTypeLabels[card.cardType]}</p>
              <p className="text-lg font-bold">{card.cardBrand}</p>
            </div>
            <CreditCard className="h-8 w-8 opacity-75" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs opacity-75 mb-1">Numer karty</p>
              <p className="text-xl font-mono tracking-wider">
                {card.cardNumber}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-75 mb-1">Ważna do</p>
                <p className="font-mono">
                  {new Date(card.expiryDate).toLocaleDateString('pl-PL', { 
                    month: '2-digit', 
                    year: '2-digit' 
                  })}
                </p>
              </div>
              {card.cardType === 'CREDIT' && card.creditLimit && (
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">Dostępny limit</p>
                  <p className="font-semibold">
                    {card.availableLimit?.toLocaleString('pl-PL')} PLN
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[displayStatus]
            }`}>
              {statusLabels[displayStatus]}
            </span>
            {card.lastUsed && (
              <p className="text-xs text-gray-500">
                Ostatnie użycie: {formatDate(card.lastUsed)}
              </p>
            )}
          </div>

          {card.cardType === 'CREDIT' && card.creditLimit && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Wykorzystany limit</span>
                <span className="font-medium text-gray-900">
                  {((card.creditLimit - (card.availableLimit || 0)) / card.creditLimit * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((card.creditLimit - (card.availableLimit || 0)) / card.creditLimit * 100)}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(card)}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Szczegóły
            </Button>
            {card.status === 'ACTIVE' && onBlockCard && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onBlockCard(card)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Zablokuj
              </Button>
            )}
            {card.status === 'BLOCKED' && onUnblockCard && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUnblockCard(card)}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Odblokuj
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </UICard>
  );
}
