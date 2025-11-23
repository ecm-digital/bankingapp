import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Input, Button } from '@/components/ui';

interface AmountInputProps {
  value: number;
  currency: string;
  onChange: (amount: number, currency: string) => void;
  onNext: () => void;
}

export function AmountInput({ value, currency, onChange, onNext }: AmountInputProps) {
  const [amount, setAmount] = useState(value.toString());
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleNext = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('Kwota musi być większa od 0');
      return;
    }

    if (numAmount > 1000000) {
      setError('Kwota przekracza dzienny limit (1,000,000 PLN)');
      return;
    }

    onChange(numAmount, selectedCurrency);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Wprowadź kwotę transakcji</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kwota
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="pl-10 text-2xl font-semibold"
              placeholder="0.00"
              error={error}
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waluta
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['PLN', 'EUR', 'USD'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`p-3 border-2 rounded-lg font-medium transition-all ${
                  selectedCurrency === curr
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-700 hover:border-primary-300'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Szybki wybór
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="p-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleNext}
        className="w-full"
        disabled={!amount || parseFloat(amount) <= 0}
      >
        Dalej
      </Button>
    </div>
  );
}
