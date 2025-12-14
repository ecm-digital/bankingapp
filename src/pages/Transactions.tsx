import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TransactionWizard, TransactionHistory, ReceiptModal } from '@/components/transactions';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useAuth } from '@/hooks/useAuth';
import { Transaction } from '@/types';

export function Transactions() {
  const location = useLocation();
  const locationState = location.state as { customerId?: string; showWizard?: boolean } | null;
  const [showWizard, setShowWizard] = useState(locationState?.showWizard || false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const customerId = locationState?.customerId;

  const { currentEmployee } = useAuth();
  const { transactions, fetchTransactions, createTransaction } = useTransactionsStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter transactions by customerId if provided
  const displayedTransactions = customerId
    ? transactions.filter(t => t.customerId === customerId)
    : transactions;

  const handleCreateTransaction = async (transactionData: Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>) => {
    try {
      const newTransaction = await createTransaction(transactionData);
      setShowWizard(false);
      setSelectedTransaction(newTransaction);
      setShowReceipt(true);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Wystąpił błąd podczas tworzenia transakcji');
    }
  };

  const handleViewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transakcje</h1>
          <p className="text-slate-500 mt-1">
            Historia transakcji i zarządzanie operacjami bankowymi
          </p>
        </div>
        {!showWizard && (
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Nowa Transakcja
          </button>
        )}
      </div>

      {/* Transaction Wizard */}
      {showWizard ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Kreator Nowej Transakcji</h2>
          <TransactionWizard
            onComplete={handleCreateTransaction}
            onCancel={() => setShowWizard(false)}
            employeeId={currentEmployee?.id || 'emp_demo'}
            customerId={customerId}
          />
        </div>
      ) : (
        /* Transaction History */
        <TransactionHistory
          transactions={displayedTransactions}
          onViewReceipt={handleViewReceipt}
        />
      )}

      {/* Receipt Modal */}
      {selectedTransaction && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}