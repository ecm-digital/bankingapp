import { Check } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils';

interface ConfirmationScreenProps {
  transaction: Partial<Transaction>;
  onConfirm: () => void;
}

export function ConfirmationScreen({ transaction, onConfirm }: ConfirmationScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Check className="h-10 w-10 text-emerald-400" />
        </div>
        <h3 className="text-xl font-medium text-white">Potwierdź transakcję</h3>
        <p className="text-sm text-gray-400 mt-2">
          Sprawdź wszystkie dane przed zatwierdzeniem
        </p>
      </div>

      <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">Typ transakcji</span>
          <span className="font-medium text-white">
            {transaction.type === 'TRANSFER' ? 'Przelew' :
             transaction.type === 'DEPOSIT' ? 'Wpłata' :
             transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">Kwota</span>
          <span className="text-2xl font-bold text-white">
            {formatCurrency(transaction.amount || 0, transaction.currency || 'PLN')}
          </span>
        </div>

        {transaction.fromAccount && (
          <div className="flex justify-between items-start pb-4 border-b border-white/10">
            <span className="text-sm text-gray-400">Z konta</span>
            <span className="font-mono text-sm text-white text-right">
              {transaction.fromAccount}
            </span>
          </div>
        )}

        {transaction.toAccount && (
          <div className="flex justify-between items-start pb-4 border-b border-white/10">
            <span className="text-sm text-gray-400">Na konto</span>
            <span className="font-mono text-sm text-white text-right">
              {transaction.toAccount}
            </span>
          </div>
        )}

        <div className="flex justify-between items-start pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">Opis</span>
          <span className="text-sm text-white text-right max-w-xs">
            {transaction.description}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Kategoria</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
            {transaction.category}
          </span>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <p className="text-sm text-amber-300">
          <strong>Ważne:</strong> Po zatwierdzeniu transakcja zostanie przetworzona natychmiast.
          Upewnij się, że wszystkie dane są poprawne.
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
      >
        Zatwierdź i Wykonaj Transakcję
      </button>
    </div>
  );
}