import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Edit2, User } from 'lucide-react';
import { Customer } from '@/types';
import { formatDate, getInitials } from '@/utils';
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

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client Profile Section */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {personalInfo.firstName} {personalInfo.lastName}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Klient od {formatDate(bankingInfo.customerSince)}
            </p>
            <span className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${accountStatus === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}>
              {accountStatus === 'ACTIVE' ? 'Aktywny' : 'Nieaktywny'}
            </span>
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50">
                <span className="text-slate-500">ID Klienta:</span>
                <span className="font-mono text-slate-900">{customer.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50">
                <span className="text-slate-500">Segment:</span>
                <span className="font-medium text-blue-600">{bankingInfo.segment}</span>
              </div>
            </div>
            <button
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 className="h-4 w-4" />
              Edytuj Profil
            </button>
          </div>
        </div>

        {/* Account Information & Contact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Informacje o Koncie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankingInfo.accounts.map((account, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      {account.type === 'PERSONAL_CHECKING' ? 'Konto Osobiste' :
                        account.type === 'SAVINGS' ? 'Konto Oszczędnościowe' :
                          account.type === 'BUSINESS' ? 'Konto Biznesowe' :
                            'Konto Inwestycyjne'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${account.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {account.isActive ? 'Aktywne' : 'Nieaktywne'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Numer konta</p>
                      <p className="font-mono text-sm text-slate-900">{account.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">IBAN</p>
                      <p className="font-mono text-xs text-slate-600">{account.iban}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Dane Kontaktowe</h3>
              <button
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="h-4 w-4" />
                Edytuj
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start p-3 rounded-lg bg-slate-50">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm text-slate-900">{personalInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Telefon</p>
                  <p className="text-sm text-slate-900">{personalInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Adres</p>
                  <p className="text-sm text-slate-900">
                    {personalInfo.address.street}<br />
                    {personalInfo.address.postalCode} {personalInfo.address.city}
                  </p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Data urodzenia</p>
                  <p className="text-sm text-slate-900">{formatDate(personalInfo.dateOfBirth)}</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50">
                <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">PESEL</p>
                  <p className="text-sm text-slate-900 font-mono">{personalInfo.pesel}</p>
                </div>
              </div>
            </div>
          </div>
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