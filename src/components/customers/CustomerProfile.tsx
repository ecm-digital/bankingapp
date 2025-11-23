import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Edit2, User } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { Customer } from '@/types';
import { formatDate, getInitials, getStatusColor } from '@/utils';
import { EditContactModal } from './EditContactModal';

interface CustomerProfileProps {
  customer: Customer;
  onUpdate: (updates: Partial<Customer>) => void;
}

export function CustomerProfile({ customer, onUpdate }: CustomerProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { personalInfo, bankingInfo } = customer;
  const initials = getInitials(personalInfo.firstName, personalInfo.lastName);
  const accountStatus = bankingInfo.accounts[0]?.isActive ? 'ACTIVE' : 'INACTIVE';
  const statusColor = getStatusColor(accountStatus);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client Profile Section */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Klient od {formatDate(bankingInfo.customerSince)}
              </p>
              <span className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                {accountStatus === 'ACTIVE' ? 'Aktywny' : 'Nieaktywny'}
              </span>
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">ID Klienta:</span>
                  <span className="font-mono text-gray-900">{customer.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Segment:</span>
                  <span className="font-medium text-gray-900">{bankingInfo.segment}</span>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edytuj Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information & Contact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o Koncie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankingInfo.accounts.map((account, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {account.type === 'PERSONAL_CHECKING' ? 'Konto Osobiste' : 
                         account.type === 'SAVINGS' ? 'Konto Oszczędnościowe' : 
                         account.type === 'BUSINESS' ? 'Konto Biznesowe' :
                         'Konto Inwestycyjne'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(account.isActive ? 'ACTIVE' : 'INACTIVE')}`}>
                        {account.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Numer konta</p>
                    <p className="font-mono text-sm text-gray-900 mb-2">{account.accountNumber}</p>
                    <p className="text-xs text-gray-500 mb-1">IBAN</p>
                    <p className="font-mono text-xs text-gray-700">{account.iban}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Dane Kontaktowe</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edytuj
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefon</p>
                    <p className="text-sm text-gray-900">{personalInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adres</p>
                    <p className="text-sm text-gray-900">
                      {personalInfo.address.street}<br />
                      {personalInfo.address.postalCode} {personalInfo.address.city}<br />
                      {personalInfo.address.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data urodzenia</p>
                    <p className="text-sm text-gray-900">{formatDate(personalInfo.dateOfBirth)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">PESEL</p>
                    <p className="text-sm text-gray-900 font-mono">{personalInfo.pesel}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditContactModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={customer}
        onSave={onUpdate}
      />
    </>
  );
}
