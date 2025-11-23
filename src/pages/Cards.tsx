import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Input, Card as UICard, CardContent } from '@/components/ui';
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
    // Fetch cards for first customer as demo
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
    // Mock card application
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zarządzanie Kartami</h1>
          <p className="mt-1 text-sm text-gray-500">
            Przeglądaj i zarządzaj kartami klientów
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewCardWizard(true)}
          disabled={!selectedCustomerId}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nowa Karta
        </Button>
      </div>

      {/* Customer Selector & Search */}
      <UICard>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz klienta
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  fetchCustomerCards(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szukaj karty
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Szukaj po numerze lub marce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </UICard>

      {/* Cards Overview */}
      {selectedCustomerId ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Karty klienta ({filteredCards.length})
            </h2>
          </div>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <UICard>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">
                  {searchQuery
                    ? 'Nie znaleziono kart spełniających kryteria wyszukiwania'
                    : 'Klient nie posiada żadnych kart'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowNewCardWizard(true)}
                  className="mt-4"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Złóż wniosek o kartę
                </Button>
              </CardContent>
            </UICard>
          )}
        </div>
      ) : (
        <UICard>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Wybierz klienta, aby wyświetlić jego karty</p>
          </CardContent>
        </UICard>
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