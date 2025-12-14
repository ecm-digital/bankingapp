import { CreditCard, Lock, Unlock, Settings } from 'lucide-react';
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
  AMEX: 'from-slate-700 to-slate-900',
};

const cardTypeLabels = {
  DEBIT: 'Debetowa',
  CREDIT: 'Kredytowa',
  PREPAID: 'Przedpłacona',
};

export function CardComponent({ card, onViewDetails, onBlockCard, onUnblockCard }: CardComponentProps) {
  const isExpired = new Date(card.expiryDate) < new Date();
  const displayStatus = isExpired ? 'EXPIRED' : card.status;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Visual */}
      <div className={`bg-gradient-to-br ${cardBrandColors[card.cardBrand]} p-5 text-white relative`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-white/70 mb-1 font-medium">{cardTypeLabels[card.cardType]}</p>
            <p className="text-lg font-bold">{card.cardBrand}</p>
          </div>
          <CreditCard className="h-8 w-8 text-white/50" />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-white/70 mb-0.5">Numer karty</p>
            <p className="text-lg font-mono tracking-wider">
              {card.cardNumber}
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-white/70 mb-0.5">Ważna do</p>
              <p className="font-mono font-medium">
                {new Date(card.expiryDate).toLocaleDateString('pl-PL', {
                  month: '2-digit',
                  year: '2-digit'
                })}
              </p>
            </div>
            {card.cardType === 'CREDIT' && card.creditLimit && (
              <div className="text-right">
                <p className="text-xs text-white/70 mb-0.5">Dostępny limit</p>
                <p className="font-semibold">
                  {card.availableLimit?.toLocaleString('pl-PL')} PLN
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' :
              displayStatus === 'BLOCKED' ? 'bg-red-100 text-red-700' :
                displayStatus === 'EXPIRED' ? 'bg-slate-100 text-slate-700' :
                  'bg-amber-100 text-amber-700'
            }`}>
            {displayStatus === 'ACTIVE' ? 'Aktywna' :
              displayStatus === 'BLOCKED' ? 'Zablokowana' :
                displayStatus === 'EXPIRED' ? 'Wygasła' : 'Oczekująca'}
          </span>
          {card.lastUsed && (
            <p className="text-xs text-slate-500">
              Ostatnie użycie: {formatDate(card.lastUsed)}
            </p>
          )}
        </div>

        {card.cardType === 'CREDIT' && card.creditLimit && (
          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Wykorzystany limit</span>
              <span className="font-medium text-slate-900">
                {((card.creditLimit - (card.availableLimit || 0)) / card.creditLimit * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((card.creditLimit - (card.availableLimit || 0)) / card.creditLimit * 100)}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => onViewDetails(card)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            Szczegóły
          </button>
          {card.status === 'ACTIVE' && onBlockCard && (
            <button
              onClick={() => onBlockCard(card)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
            >
              <Lock className="h-4 w-4" />
              Zablokuj
            </button>
          )}
          {card.status === 'BLOCKED' && onUnblockCard && (
            <button
              onClick={() => onUnblockCard(card)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 text-sm font-medium rounded-lg transition-colors"
            >
              <Unlock className="h-4 w-4" />
              Odblokuj
            </button>
          )}
        </div>
      </div>
    </div>
  );
}