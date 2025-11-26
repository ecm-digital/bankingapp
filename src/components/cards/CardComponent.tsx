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
  AMEX: 'from-gray-700 to-gray-900',
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
    <div className="glass-panel rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
      {/* Card Visual */}
      <div className={`bg-gradient-to-br ${cardBrandColors[card.cardBrand]} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs opacity-75 mb-1 font-medium tracking-wide">{cardTypeLabels[card.cardType]}</p>
              <p className="text-lg font-bold tracking-tight">{card.cardBrand}</p>
            </div>
            <CreditCard className="h-8 w-8 opacity-75" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs opacity-75 mb-1">Numer karty</p>
              <p className="text-xl font-mono tracking-wider drop-shadow-md">
                {card.cardNumber}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-75 mb-1">Ważna do</p>
                <p className="font-mono font-medium">
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
      </div>

      {/* Card Info */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${displayStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              displayStatus === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                displayStatus === 'EXPIRED' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>
            {displayStatus === 'ACTIVE' ? 'Aktywna' :
              displayStatus === 'BLOCKED' ? 'Zablokowana' :
                displayStatus === 'EXPIRED' ? 'Wygasła' : 'Oczekująca'}
          </span>
          {card.lastUsed && (
            <p className="text-xs text-gray-400">
              Ostatnie użycie: {formatDate(card.lastUsed)}
            </p>
          )}
        </div>

        {card.cardType === 'CREDIT' && card.creditLimit && (
          <div className="pt-3 border-t border-white/5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Wykorzystany limit</span>
              <span className="font-medium text-white">
                {((card.creditLimit - (card.availableLimit || 0)) / card.creditLimit * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
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
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
          >
            <Settings className="h-4 w-4" />
            Szczegóły
          </button>
          {card.status === 'ACTIVE' && onBlockCard && (
            <button
              onClick={() => onBlockCard(card)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors"
            >
              <Lock className="h-4 w-4" />
              Zablokuj
            </button>
          )}
          {card.status === 'BLOCKED' && onUnblockCard && (
            <button
              onClick={() => onUnblockCard(card)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-sm font-medium transition-colors"
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
