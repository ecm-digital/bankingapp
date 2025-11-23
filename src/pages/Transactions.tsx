import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { TransactionWizard, TransactionHistory, ReceiptModal } from '@/components/transactions';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useAuth } from '@/hooks/useAuth';
import { Transaction } from '@/types';

export function Transactions() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const { currentEmployee } = useAuth();
  const { transactions, fetchTransactions, createTransaction } = useTransactionsStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transakcje</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historia transakcji i zarządzanie operacjami bankowymi
          </p>
        </div>
        {!showWizard && (
          <Button
            variant="primary"
            onClick={() => setShowWizard(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nowa Transakcja
          </Button>
        )}
      </div>

      {/* Transaction Wizard */}
      {showWizard ? (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Kreator Nowej Transakcji</h2>
            <TransactionWizard
              onComplete={handleCreateTransaction}
              onCancel={() => setShowWizard(false)}
              employeeId={currentEmployee?.id || 'emp_demo'}
            />
          </CardContent>
        </Card>
      ) : (
        /* Transaction History */
        <TransactionHistory
          transactions={transactions}
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