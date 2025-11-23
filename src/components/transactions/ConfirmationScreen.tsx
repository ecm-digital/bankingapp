import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
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
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">Potwierdź transakcję</h3>
        <p className="text-sm text-gray-500 mt-2">
          Sprawdź wszystkie dane przed zatwierdzeniem
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-sm text-gray-500">Typ transakcji</span>
          <span className="font-medium text-gray-900">
            {transaction.type === 'TRANSFER' ? 'Przelew' :
             transaction.type === 'DEPOSIT' ? 'Wpłata' :
             transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-sm text-gray-500">Kwota</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(transaction.amount || 0, transaction.currency || 'PLN')}
          </span>
        </div>

        {transaction.fromAccount && (
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <span className="text-sm text-gray-500">Z konta</span>
            <span className="font-mono text-sm text-gray-900 text-right">
              {transaction.fromAccount}
            </span>
          </div>
        )}

        {transaction.toAccount && (
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <span className="text-sm text-gray-500">Na konto</span>
            <span className="font-mono text-sm text-gray-900 text-right">
              {transaction.toAccount}
            </span>
          </div>
        )}

        <div className="flex justify-between items-start pb-4 border-b border-gray-200">
          <span className="text-sm text-gray-500">Opis</span>
          <span className="text-sm text-gray-900 text-right max-w-xs">
            {transaction.description}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Kategoria</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {transaction.category}
          </span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Ważne:</strong> Po zatwierdzeniu transakcja zostanie przetworzona natychmiast.
          Upewnij się, że wszystkie dane są poprawne.
        </p>
      </div>

      <Button
        variant="primary"
        onClick={onConfirm}
        className="w-full"
      >
        Zatwierdź i Wykonaj Transakcję
      </Button>
    </div>
  );
}
