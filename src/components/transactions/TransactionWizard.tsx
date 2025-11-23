import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { Transaction } from '@/types';
import { AmountInput } from './AmountInput';
import { AccountSelector } from './AccountSelector';
import { TransferForm } from './TransferForm';
import { ConfirmationScreen } from './ConfirmationScreen';

interface TransactionWizardProps {
  onComplete: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>) => void;
  onCancel: () => void;
  customerId?: string;
  employeeId: string;
}

type Step = 'type' | 'amount' | 'accounts' | 'details' | 'confirmation';

export function TransactionWizard({ onComplete, onCancel, customerId, employeeId }: TransactionWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [transactionData, setTransactionData] = useState<Partial<Transaction>>({
    type: 'TRANSFER',
    currency: 'PLN',
    customerId: customerId || '',
    employeeId: employeeId,
    category: 'OTHER',
    status: 'PENDING',
  });

  const steps: { id: Step; label: string }[] = [
    { id: 'type', label: 'Typ' },
    { id: 'amount', label: 'Kwota' },
    { id: 'accounts', label: 'Konta' },
    { id: 'details', label: 'Szczegóły' },
    { id: 'confirmation', label: 'Potwierdzenie' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleComplete = () => {
    if (transactionData.amount && transactionData.fromAccount && transactionData.description) {
      onComplete(transactionData as Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>);
    }
  };

  const updateTransactionData = (updates: Partial<Transaction>) => {
    setTransactionData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      index < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : index === currentStepIndex
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 'type' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Wybierz typ transakcji</h3>
              <div className="grid grid-cols-2 gap-4">
                {(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      updateTransactionData({ type });
                      handleNext();
                    }}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      transactionData.type === type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">
                      {type === 'TRANSFER' ? 'Przelew' :
                       type === 'DEPOSIT' ? 'Wpłata' :
                       type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {type === 'TRANSFER' ? 'Przelew między kontami' :
                       type === 'DEPOSIT' ? 'Wpłata gotówki' :
                       type === 'WITHDRAWAL' ? 'Wypłata gotówki' : 'Płatność rachunku'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'amount' && (
            <AmountInput
              value={transactionData.amount || 0}
              currency={transactionData.currency || 'PLN'}
              onChange={(amount, currency) => updateTransactionData({ amount, currency })}
              onNext={handleNext}
            />
          )}

          {currentStep === 'accounts' && (
            <AccountSelector
              transactionType={transactionData.type!}
              fromAccount={transactionData.fromAccount}
              toAccount={transactionData.toAccount}
              onSelect={(fromAccount, toAccount) => updateTransactionData({ fromAccount, toAccount })}
              onNext={handleNext}
            />
          )}

          {currentStep === 'details' && (
            <TransferForm
              description={transactionData.description || ''}
              category={transactionData.category || 'OTHER'}
              onChange={(description, category) => updateTransactionData({ description, category })}
              onNext={handleNext}
            />
          )}

          {currentStep === 'confirmation' && (
            <ConfirmationScreen
              transaction={transactionData as Transaction}
              onConfirm={handleComplete}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={currentStepIndex === 0 ? onCancel : handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStepIndex === 0 ? 'Anuluj' : 'Wstecz'}
        </Button>

        {currentStep !== 'confirmation' && currentStep !== 'type' && (
          <Button variant="primary" onClick={handleNext}>
            Dalej
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
