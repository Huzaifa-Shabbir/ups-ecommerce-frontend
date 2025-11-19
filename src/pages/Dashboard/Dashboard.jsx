import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, Menu, Heart, TrendingUp, Package, Zap } from 'lucide-react';
import { getCategories, getProducts, getAvailableServices } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/Modal/Modal';
import ProductDetailModal from '../../components/Modal/ProductDetailModal';
import ServiceDetailModal from '../../components/Modal/ServiceDetailModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { addToCart, getCartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr(null);
      try {
        // Fetch categories and products
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts(accessToken)
        ]);
        
        const categoriesData = Array.isArray(catRes) ? catRes : (catRes.categories || []);
        const productsData = Array.isArray(prodRes) ? prodRes : (prodRes.products || []);
        
        setCategories(categoriesData);
        setProducts(productsData);
        
        // Try to fetch services, but don't fail if it errors
        try {
          const servRes = await getAvailableServices(accessToken);
          const servicesData = Array.isArray(servRes) ? servRes : (servRes.services || []);
          setServices(servicesData);
        } catch (serviceError) {
          console.warn('Error fetching services (non-critical):', serviceError);
          // Set empty services array so the page still works
          setServices([]);
        }
      } catch (e) {
        console.error('Error fetching data:', e);
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const filteredProducts = products.filter(p => {
    const categoryName = typeof p.category === 'object' ? p.category?.name : p.category;
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const matchesSearch = searchTerm === '' || (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
      setIsProductModalOpen(false);
    }
  };

  const handleBookService = () => {
    setIsServiceModalOpen(false);
    alert('Service booking request submitted!');
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleProfileNavigation = (path) => {
    setIsProfileMenuOpen(false);
    switch (path) {
      case 'profile':
        alert('Profile page coming soon!');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'password':
        alert('Change password feature coming soon!');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Electrify
              </span>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
              <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
              {accessToken ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <User className="w-6 h-6 text-gray-600" />
                    <span className="hidden lg:block text-sm font-medium text-gray-700">Profile</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                      <button
                        onClick={() => handleProfileNavigation('profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleProfileNavigation('orders')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Orders
                      </button>
                      <button
                        onClick={() => handleProfileNavigation('password')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Change Password
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
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
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Power Your Future
              </h1>
              <p className="text-xl text-green-50 mb-6">
                Premium UPS systems & power solutions for your needs
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition transform hover:scale-105">
                  Shop Now
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg">
                <TrendingUp className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{products.length}+</div>
                <div className="text-sm text-green-50">Products</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg">
                <Package className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{categories.length}+</div>
                <div className="text-sm text-green-50">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      )}

      {err && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error loading data:</p>
            <p>{err}</p>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            {categories.length > 0 ? (
              <div className="overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar">
                <div className="flex space-x-4 min-w-max">
                  {categories.map(cat => (
                    <button
                      key={cat.category_id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`relative overflow-hidden rounded-xl transition transform hover:scale-105 shadow-md flex-shrink-0 w-64 ${
                        selectedCategory === cat.name
                          ? 'ring-4 ring-green-500'
                          : 'hover:shadow-lg'
                      }`}
                    >
                      {/* Category Image Background */}
                      <div className="relative h-32 overflow-hidden">
                        {cat.image ? (
                          <img 
                            src={cat.image} 
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name || 'Category')}&size=300&background=random&color=fff&bold=true`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <span className="text-5xl">⚡</span>
                          </div>
                        )}
                        {/* Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          selectedCategory === cat.name 
                            ? 'from-green-600/90 to-green-500/70' 
                            : 'from-black/60 to-black/20'
                        } transition-all`}></div>
                      </div>
                      
                      {/* Category Info */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                        <h3 className="font-bold text-lg mb-1 drop-shadow-lg">{cat.name}</h3>
                        <p className="text-xs text-white/90 line-clamp-2 drop-shadow">
                          {cat.description || 'Browse products'}
                        </p>
                      </div>
                      
                      {/* Selected Indicator */}
                      {selectedCategory === cat.name && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No categories available.</p>
              </div>
            )}
          </section>

          {/* Products */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
              </h2>
              {selectedCategory !== 'all' && (
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
                >
                  <span>Clear Filter</span>
                  <span>×</span>
                </button>
              )}
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(prod => (
                  <div 
                    key={prod.id || prod.product_id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden group cursor-pointer"
                    onClick={() => handleProductClick(prod)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                      {prod.image ? (
                        <img 
                          src={prod.image} 
                          alt={prod.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(prod.name || 'Product')}&size=400&background=27ae60&color=fff&bold=true`;
                          }}
                        />
                      ) : (
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(prod.name || 'Product')}&size=400&background=27ae60&color=fff&bold=true`}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button 
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    <div className="p-5">
                      {prod.category && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {typeof prod.category === 'object' ? prod.category.name : prod.category}
                        </span>
                      )}
                      <h3 className="font-bold text-lg mt-2 mb-1 text-gray-900">{prod.name || 'Unnamed Product'}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{prod.description || 'No description available'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{prod.price ? prod.price.toLocaleString() : '0'}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if ((prod.Quantity || 0) > 0) {
                              addToCart(prod);
                            }
                          }}
                          disabled={(prod.Quantity || 0) === 0}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {(prod.Quantity || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            )}
          </section>

          {/* Services */}
          {services.length > 0 && (
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map(serv => (
                  <div 
                    key={serv.service_id} 
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition cursor-pointer transform hover:scale-105"
                    onClick={() => handleServiceClick(serv)}
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{serv.service_name || 'Service'}</h3>
                    <p className="text-gray-300 mb-4">Professional service with warranty</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-400">
                        ₹{serv.price ? serv.price.toLocaleString() : '0'}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(serv);
                        }}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-green-500" />
                <span className="text-xl font-bold text-white">Electrify</span>
              </div>
              <p className="text-sm">Your trusted partner for power solutions</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400">UPS Systems</a></li>
                <li><a href="#" className="hover:text-green-400">Batteries</a></li>
                <li><a href="#" className="hover:text-green-400">Inverters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://wa.me/923304325987" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400">FAQs</a></li>
                <li><a href="#" className="hover:text-green-400">Warranty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Newsletter</h4>
              <p className="text-sm mb-4">Get updates on new products</p>
              <div className="flex">
                <input type="email" placeholder="Email" className="px-4 py-2 rounded-l-lg text-gray-900 flex-1" />
                <button className="bg-green-600 px-4 py-2 rounded-r-lg hover:bg-green-700">→</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2024 Electrify. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)}
      >
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </Modal>

      <Modal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)}
      >
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setIsServiceModalOpen(false)}
          onBookService={handleBookService}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;