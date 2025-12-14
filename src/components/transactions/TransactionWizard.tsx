import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
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
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-300"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  index < currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : index === currentStepIndex
                    ? 'bg-white text-blue-600 border-2 border-blue-600'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${
                index <= currentStepIndex ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {currentStep === 'type' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Wybierz typ transakcji</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    updateTransactionData({ type });
                    handleNext();
                  }}
                  className={`p-5 border rounded-xl text-left transition-all ${
                    transactionData.type === type
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <p className={`font-semibold text-base ${
                    transactionData.type === type ? 'text-blue-700' : 'text-slate-900'
                  }`}>
                    {type === 'TRANSFER' ? 'Przelew' :
                     type === 'DEPOSIT' ? 'Wpłata' :
                     type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
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
            category={(transactionData.category || 'OTHER') as Transaction['category']}
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
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-slate-200">
        <button
          onClick={currentStepIndex === 0 ? onCancel : handleBack}
          className="flex items-center px-5 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStepIndex === 0 ? 'Anuluj' : 'Wstecz'}
        </button>

        {currentStep !== 'confirmation' && currentStep !== 'type' && (
          <button 
            onClick={handleNext}
            className="flex items-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium shadow-sm"
          >
            Dalej
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}