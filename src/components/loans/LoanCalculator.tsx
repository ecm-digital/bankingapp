import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, Input, Button } from '@/components/ui';
import { formatCurrency } from '@/utils';

export function LoanCalculator() {
  const [amount, setAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('5.5');
  const [termMonths, setTermMonths] = useState('120');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(termMonths);

    if (principal > 0 && rate > 0 && months > 0) {
      const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const totalAmount = monthlyPayment * months;
      const totalInterest = totalAmount - principal;

      setResult({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Kalkulator Kredytowy</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kwota kredytu (PLN)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oprocentowanie roczne (%)
            </label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              min="0.1"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Okres kredytowania (miesiące)
            </label>
            <Input
              type="number"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              min="12"
              step="12"
            />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(parseInt(termMonths) / 12)} lat
            </p>
          </div>

          <Button
            variant="primary"
            onClick={calculateLoan}
            className="w-full"
          >
            Oblicz ratę
          </Button>

          {result && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Miesięczna rata</p>
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(result.monthlyPayment, 'PLN')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Całkowity koszt</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(result.totalAmount, 'PLN')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Odsetki</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(result.totalInterest, 'PLN')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
