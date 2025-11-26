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
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line Background */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10 -z-10"></div>
          
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                  index < currentStepIndex
                    ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : index === currentStepIndex
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-black/40 text-gray-500 border border-white/5'
                }`}
              >
                {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <span className={`text-xs mt-3 font-medium ${
                index <= currentStepIndex ? 'text-white' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div>
        {currentStep === 'type' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Wybierz typ transakcji</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    updateTransactionData({ type });
                    handleNext();
                  }}
                  className={`p-6 border rounded-2xl text-left transition-all group ${
                    transactionData.type === type
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <p className={`font-medium text-lg mb-1 ${
                    transactionData.type === type ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {type === 'TRANSFER' ? 'Przelew' :
                     type === 'DEPOSIT' ? 'Wpłata' :
                     type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
                  </p>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">
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
      <div className="flex justify-between pt-4 border-t border-white/10">
        <button
          onClick={currentStepIndex === 0 ? onCancel : handleBack}
          className="flex items-center px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStepIndex === 0 ? 'Anuluj' : 'Wstecz'}
        </button>

        {currentStep !== 'confirmation' && currentStep !== 'type' && (
          <button 
            onClick={handleNext}
            className="flex items-center px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all font-medium"
          >
            Dalej
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}