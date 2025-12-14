import { useState, useEffect } from 'react';
import { Plus, Search, CreditCard } from 'lucide-react';
import { CardComponent, CardDetailsModal, NewCardWizard } from '@/components/cards';
import { useProductsStore } from '@/stores/productsStore';
import { useCustomersStore } from '@/stores/customersStore';
import { Card } from '@/types';

export function Cards() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showNewCardWizard, setShowNewCardWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const { cards, fetchCustomerCards, updateCardStatus, updateCardLimits } = useProductsStore();
  const { customers, fetchCustomers } = useCustomersStore();

  useEffect(() => {
    fetchCustomers();
    if (customers.length > 0 && !selectedCustomerId) {
      const firstCustomerId = customers[0].id;
      setSelectedCustomerId(firstCustomerId);
      fetchCustomerCards(firstCustomerId);
    }
  }, [fetchCustomers, fetchCustomerCards, customers, selectedCustomerId]);

  const handleViewDetails = (card: Card) => {
    setSelectedCard(card);
    setShowDetails(true);
  };

  const handleBlockCard = async (card: Card) => {
    if (confirm('Czy na pewno chcesz zablokować tę kartę?')) {
      await updateCardStatus(card.id, 'BLOCKED');
      if (selectedCustomerId) {
        fetchCustomerCards(selectedCustomerId);
      }
    }
  };

  const handleUnblockCard = async (card: Card) => {
    if (confirm('Czy na pewno chcesz odblokować tę kartę?')) {
      await updateCardStatus(card.id, 'ACTIVE');
      if (selectedCustomerId) {
        fetchCustomerCards(selectedCustomerId);
      }
    }
  };

  const handleUpdateLimits = async (cardId: string, newLimit: number) => {
    await updateCardLimits(cardId, newLimit);
    if (selectedCustomerId) {
      fetchCustomerCards(selectedCustomerId);
    }
    setShowDetails(false);
  };

  const handleNewCard = async (cardType: Card['cardType'], cardBrand: Card['cardBrand'], creditLimit?: number) => {
    console.log('New card application:', { cardType, cardBrand, creditLimit, customerId: selectedCustomerId });
    alert('Wniosek o nową kartę został złożony! (Symulacja)');
    setShowNewCardWizard(false);
  };

  const filteredCards = cards.filter(card =>
    card.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.cardBrand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Zarządzanie Kartami</h1>
          <p className="text-slate-500 mt-1">
            Przeglądaj i zarządzaj kartami klientów
          </p>
        </div>
        <button
          onClick={() => setShowNewCardWizard(true)}
          disabled={!selectedCustomerId}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5" />
          Nowa Karta
        </button>
      </div>

      {/* Customer Selector & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Wybierz klienta
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                fetchCustomerCards(e.target.value);
              }}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Wybierz klienta...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Szukaj karty
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj po numerze lub marce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Overview */}
      {selectedCustomerId ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Karty klienta ({filteredCards.length})
            </h2>
          </div>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <CardComponent
                  key={card.id}
                  card={card}
                  onViewDetails={handleViewDetails}
                  onBlockCard={handleBlockCard}
                  onUnblockCard={handleUnblockCard}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <p className="text-slate-500 mb-4">
                {searchQuery
                  ? 'Nie znaleziono kart spełniających kryteria wyszukiwania'
                  : 'Klient nie posiada żadnych kart'}
              </p>
              <button
                onClick={() => setShowNewCardWizard(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                Złóż wniosek o kartę
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">Wybierz klienta, aby wyświetlić jego karty</p>
        </div>
      )}

      {/* Modals */}
      {selectedCard && (
        <CardDetailsModal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
          onUpdateLimits={handleUpdateLimits}
        />
      )}

      <NewCardWizard
        isOpen={showNewCardWizard}
        onClose={() => setShowNewCardWizard(false)}
        customerId={selectedCustomerId}
        onSubmit={handleNewCard}
      />
    </div>
  );
}