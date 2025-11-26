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
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-xl shadow-emerald-500/20">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-white">
              {personalInfo.firstName} {personalInfo.lastName}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Klient od {formatDate(bankingInfo.customerSince)}
            </p>
            <span className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${accountStatus === 'ACTIVE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
              {accountStatus === 'ACTIVE' ? 'Aktywny' : 'Nieaktywny'}
            </span>
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-gray-400">ID Klienta:</span>
                <span className="font-mono text-white">{customer.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-gray-400">Segment:</span>
                <span className="font-medium text-emerald-400">{bankingInfo.segment}</span>
              </div>
            </div>
            <button
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
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
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Informacje o Koncie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankingInfo.accounts.map((account, index) => (
                <div key={index} className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">
                      {account.type === 'PERSONAL_CHECKING' ? 'Konto Osobiste' :
                        account.type === 'SAVINGS' ? 'Konto Oszczędnościowe' :
                          account.type === 'BUSINESS' ? 'Konto Biznesowe' :
                            'Konto Inwestycyjne'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${account.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {account.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Numer konta</p>
                      <p className="font-mono text-sm text-white tracking-wide">{account.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">IBAN</p>
                      <p className="font-mono text-xs text-gray-400">{account.iban}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Dane Kontaktowe</h3>
              <button
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="h-4 w-4" />
                Edytuj
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Mail className="h-5 w-5 text-emerald-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-white">{personalInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Phone className="h-5 w-5 text-emerald-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefon</p>
                  <p className="text-sm text-white">{personalInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
                <MapPin className="h-5 w-5 text-emerald-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Adres</p>
                  <p className="text-sm text-white">
                    {personalInfo.address.street}<br />
                    {personalInfo.address.postalCode} {personalInfo.address.city}<br />
                    {personalInfo.address.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Calendar className="h-5 w-5 text-emerald-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Data urodzenia</p>
                  <p className="text-sm text-white">{formatDate(personalInfo.dateOfBirth)}</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors">
                <User className="h-5 w-5 text-emerald-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">PESEL</p>
                  <p className="text-sm text-white font-mono">{personalInfo.pesel}</p>
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
