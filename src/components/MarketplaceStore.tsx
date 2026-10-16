import React, { useState, useMemo } from 'react';
import { MARKETPLACE_PRODUCTS } from '../data/mockData';
import { MarketplaceItem, CartItem } from '../types';
import {
  ShoppingBag,
  Search,
  Star,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  Package,
} from 'lucide-react';

interface MarketplaceStoreProps {
  cart: CartItem[];
  onAddToCart: (product: MarketplaceItem, withInstallation: boolean) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export const MarketplaceStore: React.FC<MarketplaceStoreProps> = ({
  cart,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  isCartOpen,
  setIsCartOpen,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [includeInstallOnModal, setIncludeInstallOnModal] = useState(true);

  const filteredProducts = useMemo(() => {
    return MARKETPLACE_PRODUCTS.filter((prod) => {
      const matchCat =
        selectedCategory === 'all' || prod.category === selectedCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartSubtotal = cart.reduce((sum, item) => {
    const itemTotal =
      (item.product.price + (item.withInstallation ? item.product.installationFee : 0)) *
      item.quantity;
    return sum + itemTotal;
  }, 0);

  const handleCheckout = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      onClearCart();
      setOrderConfirmed(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span>Direct Architectural Fixtures &amp; Materials Store</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Home Improvement &amp; Fixtures Marketplace
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Curated trade materials, sanitaryware, smart digital locks, and custom cabinetry hardware at wholesale trade prices, with optional certified installation.
            </p>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 relative"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>View Shopping Bag</span>
            {cart.length > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 tabular-nums">
                {cart.reduce((c, i) => c + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by brand, fixture, or material (e.g. Hansgrohe, Caesarstone, Yale, Blum)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-xs"
              />
            </div>

            <div className="text-xs text-stone-500 whitespace-nowrap font-medium">
              Showing <span className="font-bold text-stone-900">{filteredProducts.length}</span> verified fixtures
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'fixtures', label: 'Sanitary & Bath' },
              { id: 'smart_home', label: 'Smart Home & Locks' },
              { id: 'surfaces', label: 'Quartz Slabs & Fluted Panels' },
              { id: 'lighting', label: 'Architectural Lighting' },
              { id: 'cabinetry', label: 'Blum Hardware' },
              { id: 'packages', label: 'Air-Con Systems' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white font-semibold shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-600/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Asset Container (Zero-broken-image compliant CSS/SVG visual showcase) */}
                <div
                  className={`h-48 w-full bg-gradient-to-br ${prod.colorScheme} p-5 flex flex-col justify-between text-white relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
                      {prod.brand}
                    </span>
                    {prod.badge && (
                      <span className="text-[10px] font-bold text-amber-950 bg-amber-400 px-2 py-0.5 rounded shadow-xs">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Tactile Icon & Category Visual Display */}
                  <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                    <Package className="w-12 h-12 text-stone-200/90 mb-2 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-semibold text-stone-200">{prod.categoryLabel}</span>
                  </div>

                  <div className="text-[11px] text-stone-300 font-mono z-10 flex justify-between">
                    <span>{prod.warranty}</span>
                    <span className="text-emerald-300">In Stock ({prod.stock})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-mono tabular-nums">{prod.rating.toFixed(2)}</span>
                      <span className="text-stone-400 font-normal">({prod.reviewsCount})</span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {prod.specs.slice(0, 2).map((s, idx) => (
                      <div key={idx} className="text-xs text-stone-500 line-clamp-1">
                        · {s}
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-stone-100 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-stone-900 font-mono tabular-nums">
                      ${prod.price.toLocaleString()}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-xs text-stone-400 line-through font-mono">
                        ${prod.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIncludeInstallOnModal(true);
                  }}
                  className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Quick View &amp; Configure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div
                  className={`w-20 h-20 rounded-xl bg-gradient-to-br ${selectedProduct.colorScheme} flex items-center justify-center text-white shrink-0 shadow-md`}
                >
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                    {selectedProduct.brand} · {selectedProduct.categoryLabel}
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 font-display mt-0.5">
                    {selectedProduct.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-stone-600">
                    <span className="font-bold text-stone-900 font-mono text-base tabular-nums">
                      ${selectedProduct.price.toLocaleString()} SGD
                    </span>
                    <span className="text-stone-400">|</span>
                    <span className="text-emerald-700 font-medium">
                      {selectedProduct.warranty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs & Features */}
              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Key Specifications
                  </h4>
                  <div className="space-y-1.5">
                    {selectedProduct.specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installation Toggle */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-amber-700" />
                      <span>Add Certified Installation by TTSD Tradesman</span>
                    </div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {selectedProduct.installationFee > 0
                        ? `+$${selectedProduct.installationFee} SGD with 1-year workmanship warranty`
                        : 'Complimentary Pro Installation included in promo'}
                    </div>
                  </div>
                  <button
                    onClick={() => setIncludeInstallOnModal(!includeInstallOnModal)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      includeInstallOnModal ? 'bg-amber-700' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        includeInstallOnModal ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-8 pt-5 border-t border-stone-200 flex gap-3">
                <button
                  onClick={() => {
                    onAddToCart(selectedProduct, includeInstallOnModal);
                    setSelectedProduct(null);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Cart (
                    $
                    {(
                      selectedProduct.price +
                      (includeInstallOnModal ? selectedProduct.installationFee : 0)
                    ).toLocaleString()}{' '}
                    SGD)
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-Over Shopping Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative">
              {/* Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-700" />
                  <h2 className="text-base font-bold text-stone-900 font-display">
                    Your Renovation Bag
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {orderConfirmed ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 font-display">
                      Order Confirmed!
                    </h3>
                    <p className="text-xs text-stone-600">
                      Materials assigned to your active renovation escrow schedule. Delivery &amp; trade pro installation scheduled.
                    </p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 text-xs">
                    Your renovation shopping bag is empty. Explore our verified catalog above!
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                            {item.product.brand}
                          </div>
                          <h4 className="text-xs font-bold text-stone-900">
                            {item.product.name}
                          </h4>
                          <div className="text-xs font-mono font-bold text-stone-900 mt-1 tabular-nums">
                            ${item.product.price.toLocaleString()} SGD
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.withInstallation && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1.5">
                          <Wrench className="w-3 h-3 text-emerald-600" />
                          <span>
                            Includes Certified Trade Pro Install (+$
                            {item.product.installationFee} SGD)
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white text-xs">
                          <button
                            onClick={() =>
                              onUpdateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))
                            }
                            className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              onUpdateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                          $
                          {(
                            (item.product.price +
                              (item.withInstallation ? item.product.installationFee : 0)) *
                            item.quantity
                          ).toLocaleString()}{' '}
                          SGD
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              {!orderConfirmed && cart.length > 0 && (
                <div className="p-5 border-t border-stone-200 bg-white space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums">${cartSubtotal.toLocaleString()} SGD</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>TTSD Escrow Buyer Protection</span>
                      <span className="text-emerald-700 font-bold">$0.00 Free</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                      <span>Total</span>
                      <span className="font-mono text-base tabular-nums">
                        ${cartSubtotal.toLocaleString()} SGD
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Proceed to Secure SafePay Checkout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
