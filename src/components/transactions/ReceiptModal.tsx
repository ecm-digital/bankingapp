import { Download, Printer, X } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    console.log('Downloading receipt for transaction:', transaction.id);
    alert('Funkcja pobierania zostanie zaimplementowana w pełnej wersji aplikacji');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Potwierdzenie Transakcji">
      <div className="space-y-6">
        {/* Receipt Content */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8" id="receipt-content">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bank Prototype</h2>
            <p className="text-sm text-gray-500 mt-1">Potwierdzenie Transakcji</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Numer referencyjny</span>
              <span className="font-mono font-medium text-gray-900">{transaction.referenceNumber}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Data i czas</span>
              <span className="font-medium text-gray-900">{formatDateTime(transaction.timestamp)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Typ transakcji</span>
              <span className="font-medium text-gray-900">
                {transaction.type === 'TRANSFER' ? 'Przelew' :
                 transaction.type === 'DEPOSIT' ? 'Wpłata' :
                 transaction.type === 'WITHDRAWAL' ? 'Wypłata' : 'Płatność'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Kwota</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(transaction.amount, transaction.currency)}
              </span>
            </div>

            {transaction.fromAccount && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Z konta</span>
                <span className="font-mono text-sm text-gray-900 text-right">
                  {transaction.fromAccount}
                </span>
              </div>
            )}

            {transaction.toAccount && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Na konto</span>
                <span className="font-mono text-sm text-gray-900 text-right">
                  {transaction.toAccount}
                </span>
              </div>
            )}

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Opis</span>
              <span className="text-sm text-gray-900 text-right max-w-xs">
                {transaction.description}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {transaction.status === 'COMPLETED' ? 'Zakończona' :
                 transaction.status === 'PENDING' ? 'Oczekująca' : 'Nieudana'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">ID Pracownika</span>
              <span className="font-mono text-sm text-gray-900">{transaction.employeeId}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Dokument wygenerowany automatycznie przez system bankowy
            </p>
            <p className="text-xs text-gray-500 mt-1">
              W razie pytań prosimy o kontakt z obsługą klienta
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Drukuj
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Pobierz PDF
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
