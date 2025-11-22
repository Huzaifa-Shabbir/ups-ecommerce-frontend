import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Search, Bell, Heart, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavourites } from '../../context/FavouritesContext';
import { getProducts } from '../../services/api';

const TopBar = ({
  title = 'Electrify',
  subtitle = 'Power solutions for the modern world',
  showSearch = true,
  brandVariant = 'default'
}) => {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuth();
  const { getCartCount } = useCart();
  const { favourites } = useFavourites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!showSearch) return;
    let ignore = false;
    const fetchProducts = async () => {
      try {
        const response = await getProducts(accessToken);
        if (ignore) return;
        const data = Array.isArray(response) ? response : response?.products || [];
        setProducts(data);
      } catch (err) {
        console.warn('Failed to preload products for search suggestions:', err);
      }
    };
    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [accessToken, showSearch]);

  useEffect(() => {
    if (!showSearch) return;
    const handler = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSearch]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const normalized = searchTerm.toLowerCase();
    const matches = products
      .filter((product) => (product.name || '').toLowerCase().includes(normalized))
      .slice(0, 6);
    setFilteredResults(matches);
  }, [searchTerm, products]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowSuggestions(Boolean(value.trim()));
  };

  const handleResultClick = (product) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate('/dashboard', {
      state: {
        highlightedProductId: product.product_id || product.id
      }
    });
  };

  const handleMenuSelect = (action) => {
    setIsMenuOpen(false);
    switch (action) {
      case 'profile':
        alert('Profile page coming soon!');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'password':
        navigate('/change-password');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const renderBrand = () => {
    if (brandVariant === 'dashboard') {
      return (
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-3 px-2 py-1 rounded-xl hover:bg-gray-100 transition group"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Electrify
          </span>
        </button>
      );
    }

    return (
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition group"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg shadow-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-[11px] text-gray-500">{subtitle}</p>
        </div>
      </button>
    );
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {renderBrand()}

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-6" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(Boolean(searchTerm))}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {filteredResults.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-500">No products found</p>
                    ) : (
                      filteredResults.map((product) => (
                        <button
                          key={product.product_id || product.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleResultClick(product)}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    product.name || 'Product'
                                  )}&size=128&background=27ae60&color=fff&bold=true`;
                                }}
                              />
                            ) : (
                              <span className="text-xs font-semibold text-gray-500">
                                {(product.name || 'PR')
                                  .split(' ')
                                  .map((word) => word[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {typeof product.category === 'object'
                                ? product.category?.name
                                : product.category || 'Product'}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Notifications">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => {
                if (user) {
                  navigate('/favourites');
                } else {
                  navigate('/login', { state: { from: '/favourites' } });
                }
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              title="Favourites"
            >
              <Heart className={`w-5 h-5 ${favourites.length > 0 ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              {favourites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favourites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            {(user || accessToken) ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block text-sm font-semibold">
                    {user?.name || user?.username || 'Account'}
                  </span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <button
                      onClick={() => handleMenuSelect('profile')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleMenuSelect('orders')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => handleMenuSelect('password')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Change Password
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;

