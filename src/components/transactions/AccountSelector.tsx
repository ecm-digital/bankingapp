import { useState } from 'react';
import { formatCurrency } from '@/utils';

interface AccountSelectorProps {
  transactionType: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT';
  fromAccount?: string;
  toAccount?: string;
  onSelect: (fromAccount: string, toAccount?: string) => void;
  onNext: () => void;
}

const mockAccounts = [
  { id: 'acc_1', number: 'PL 1234 5678 9012 3456 7890 1234', balance: 15420.50, currency: 'PLN', type: 'Osobiste' },
  { id: 'acc_2', number: 'PL 9876 5432 1098 7654 3210 9876', balance: 8750.00, currency: 'PLN', type: 'Oszczędnościowe' },
  { id: 'acc_3', number: 'PL 1111 2222 3333 4444 5555 6666', balance: 2340.75, currency: 'EUR', type: 'Walutowe' },
];

export function AccountSelector({ transactionType, fromAccount, toAccount, onSelect, onNext }: AccountSelectorProps) {
  const [selectedFrom, setSelectedFrom] = useState(fromAccount || '');
  const [selectedTo, setSelectedTo] = useState(toAccount || '');
  const [recipientAccount, setRecipientAccount] = useState('');

  const needsToAccount = transactionType === 'TRANSFER' || transactionType === 'PAYMENT';

  const handleNext = () => {
    if (!selectedFrom) return;
    if (needsToAccount && !selectedTo && !recipientAccount) return;
    
    onSelect(selectedFrom, needsToAccount ? (selectedTo || recipientAccount) : undefined);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {transactionType === 'DEPOSIT' ? 'Wybierz konto docelowe' :
           transactionType === 'WITHDRAWAL' ? 'Wybierz konto źródłowe' :
           'Wybierz konta'}
        </h3>

        {/* From Account */}
        {transactionType !== 'DEPOSIT' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Konto źródłowe
            </label>
            <div className="space-y-2">
              {mockAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedFrom(account.number)}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedFrom === account.number
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${selectedFrom === account.number ? 'text-blue-700' : 'text-slate-900'}`}>
                        {account.type}
                      </p>
                      <p className="text-sm text-slate-500 font-mono mt-1">{account.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Dostępne</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* To Account */}
        {needsToAccount && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Konto docelowe
            </label>
            
            <div className="space-y-2 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Moje konta</p>
              {mockAccounts.filter(acc => acc.number !== selectedFrom).map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setSelectedTo(account.number);
                    setRecipientAccount('');
                  }}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedTo === account.number
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${selectedTo === account.number ? 'text-blue-700' : 'text-slate-900'}`}>
                        {account.type}
                      </p>
                      <p className="text-sm text-slate-500 font-mono mt-1">{account.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Lub wprowadź numer konta</p>
              <input
                type="text"
                value={recipientAccount}
                onChange={(e) => {
                  setRecipientAccount(e.target.value);
                  setSelectedTo('');
                }}
                placeholder="PL XXXX XXXX XXXX XXXX XXXX XXXX"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-all"
              />
            </div>
          </div>
        )}

        {transactionType === 'DEPOSIT' && (
          <div className="space-y-2">
            {mockAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedTo(account.number)}
                className={`w-full p-4 border rounded-lg text-left transition-all ${
                  selectedTo === account.number
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-semibold ${selectedTo === account.number ? 'text-blue-700' : 'text-slate-900'}`}>
                      {account.type}
                    </p>
                    <p className="text-sm text-slate-500 font-mono mt-1">{account.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedFrom && !selectedTo}
      >
        Dalej
      </button>
    </div>
  );
}