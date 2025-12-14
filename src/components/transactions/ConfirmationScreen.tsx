import { Check } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils';

interface ConfirmationScreenProps {
  transaction: Partial<Transaction>;
  onConfirm: () => void;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'FOOD': return 'Żywność';
    case 'TRANSPORT': return 'Transport';
    case 'SHOPPING': return 'Zakupy';
    case 'BILLS': return 'Rachunki';
    case 'ENTERTAINMENT': return 'Rozrywka';
    default: return 'Inne';
  }
};

export function ConfirmationScreen({ transaction, onConfirm }: ConfirmationScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Potwierdź transakcję</h3>
        <p className="text-sm text-slate-500 mt-1">
          Sprawdź wszystkie dane przed zatwierdzeniem
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg divide-y divide-slate-200">
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-slate-600">Typ transakcji</span>
          <span className="font-medium text-slate-900">
            {transaction.type === 'TRANSFER' ? 'Przelew' :
             transaction.type === 'DEPOSIT' ? 'Wpłata' :
             transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
          </span>
        </div>

        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-slate-600">Kwota</span>
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(transaction.amount || 0, transaction.currency || 'PLN')}
          </span>
        </div>

        {transaction.fromAccount && (
          <div className="flex justify-between items-start p-4">
            <span className="text-sm text-slate-600">Z konta</span>
            <span className="font-mono text-sm text-slate-900 text-right max-w-[60%]">
              {transaction.fromAccount}
            </span>
          </div>
        )}

        {transaction.toAccount && (
          <div className="flex justify-between items-start p-4">
            <span className="text-sm text-slate-600">Na konto</span>
            <span className="font-mono text-sm text-slate-900 text-right max-w-[60%]">
              {transaction.toAccount}
            </span>
          </div>
        )}

        <div className="flex justify-between items-start p-4">
          <span className="text-sm text-slate-600">Opis</span>
          <span className="text-sm text-slate-900 text-right max-w-[60%]">
            {transaction.description}
          </span>
        </div>

        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-slate-600">Kategoria</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
            {getCategoryLabel(transaction.category || 'OTHER')}
          </span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Ważne:</strong> Po zatwierdzeniu transakcja zostanie przetworzona natychmiast.
          Upewnij się, że wszystkie dane są poprawne.
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm transition-colors"
      >
        Zatwierdź i Wykonaj Transakcję
      </button>
    </div>
  );
}