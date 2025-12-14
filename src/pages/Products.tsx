import { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
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
        requestedAmount: product.category === 'LOAN' ? 50000 : undefined,
      });

      alert(`Wniosek został złożony!\nNumer wniosku: ${result.applicationId}\nStatus: ${result.status}`);
    } catch (error) {
      alert('Wystąpił błąd podczas składania wniosku');
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Katalog Produktów Bankowych</h1>
        <p className="text-slate-500 mt-1">
          Przeglądaj i oferuj produkty bankowe klientom
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Klient
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
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

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Szukaj
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kategoria
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as BankProduct['category'] | 'ALL')}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={showPromotionalOnly}
              onChange={(e) => setShowPromotionalOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center ml-3">
              <Sparkles className={`h-4 w-4 mr-2 ${showPromotionalOnly ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className={`text-sm ${showPromotionalOnly ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                Pokaż tylko produkty promocyjne
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Znaleziono <span className="font-semibold text-slate-900">{filteredProducts.length}</span> produktów
          {promotionalProducts.length > 0 && (
            <span className="text-amber-600 ml-2">
              ({promotionalProducts.length} promocyjnych)
            </span>
          )}
        </p>
      </div>

      {/* Promotional Products */}
      {promotionalProducts.length > 0 && !showPromotionalOnly && (
        <div>
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-amber-100 mr-3">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Produkty Promocyjne</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h2 className="text-base font-semibold text-slate-900 mb-4 mt-8">Wszystkie Produkty</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">
            Nie znaleziono produktów spełniających kryteria wyszukiwania
          </p>
        </div>
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