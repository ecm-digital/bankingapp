import { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { Input, Card, CardContent } from '@/components/ui';
import { ProductCard, ProductDetailsModal } from '@/components/products';
import { useProductsStore } from '@/stores/productsStore';
import { useCustomersStore } from '@/stores/customersStore';
import { BankProduct } from '@/types';

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<BankProduct | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BankProduct['category'] | 'ALL'>('ALL');
  const [showPromotionalOnly, setShowPromotionalOnly] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const { products, fetchProducts, applyForProduct } = useProductsStore();
  const { customers, fetchCustomers } = useCustomersStore();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, [fetchProducts, fetchCustomers]);

  const handleViewDetails = (product: BankProduct) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleApply = async (product: BankProduct) => {
    if (!selectedCustomerId) {
      alert('Proszę wybrać klienta przed złożeniem wniosku');
      return;
    }

    try {
      const result = await applyForProduct(product.id, selectedCustomerId, {
        // Mock application data
        requestedAmount: product.category === 'LOAN' ? 50000 : undefined,
      });
      
      alert(`Wniosek został złożony!\nNumer wniosku: ${result.applicationId}\nStatus: ${result.status}`);
    } catch (error) {
      alert('Wystąpił błąd podczas składania wniosku');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesPromotional = !showPromotionalOnly || product.isPromotional;

    return matchesSearch && matchesCategory && matchesPromotional;
  });

  const promotionalProducts = filteredProducts.filter(p => p.isPromotional);
  const regularProducts = filteredProducts.filter(p => !p.isPromotional);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Katalog Produktów Bankowych</h1>
        <p className="mt-1 text-sm text-gray-500">
          Przeglądaj i oferuj produkty bankowe klientom
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Klient
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
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

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szukaj
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Szukaj produktu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as BankProduct['category'] | 'ALL')}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ALL">Wszystkie kategorie</option>
                  <option value="ACCOUNT">Konta</option>
                  <option value="LOAN">Kredyty</option>
                  <option value="INVESTMENT">Inwestycje</option>
                  <option value="INSURANCE">Ubezpieczenia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Promotional Filter */}
          <div className="mt-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPromotionalOnly}
                onChange={(e) => setShowPromotionalOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <Sparkles className="h-4 w-4 text-yellow-500 ml-2 mr-1" />
              <span className="text-sm text-gray-700">Pokaż tylko produkty promocyjne</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Znaleziono <strong>{filteredProducts.length}</strong> produktów
          {promotionalProducts.length > 0 && (
            <span className="text-yellow-600 ml-2">
              ({promotionalProducts.length} promocyjnych)
            </span>
          )}
        </p>
      </div>

      {/* Promotional Products */}
      {promotionalProducts.length > 0 && !showPromotionalOnly && (
        <div>
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Produkty Promocyjne</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onApply={selectedCustomerId ? handleApply : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Products */}
      {regularProducts.length > 0 && !showPromotionalOnly && (
        <div>
          {promotionalProducts.length > 0 && (
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Wszystkie Produkty</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onApply={selectedCustomerId ? handleApply : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show all when promotional only filter is active */}
      {showPromotionalOnly && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
              onApply={selectedCustomerId ? handleApply : undefined}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">
              Nie znaleziono produktów spełniających kryteria wyszukiwania
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onApply={selectedCustomerId ? handleApply : undefined}
        />
      )}
    </div>
  );
}