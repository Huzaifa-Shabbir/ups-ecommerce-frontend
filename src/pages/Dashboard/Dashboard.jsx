import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, Menu, Heart, TrendingUp, Package, Zap, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getCategories, getProducts, getAvailableServices } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useSnackbar } from '../../context/SnackbarContext';
import Modal from '../../components/Modal/Modal';
import ProductDetailModal from '../../components/Modal/ProductDetailModal';
import ServiceDetailModal from '../../components/Modal/ServiceDetailModal';
import TopBar from '../../components/Layout/TopBar';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, logout } = useAuth();
  const { addToCart, getCartCount, cartItems } = useCart();
  const { isFavourite, toggleFavouriteProduct } = useFavourites();
  const { showSuccess, showError } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const categoryScrollRef = useRef(null);
  const productsSectionRef = useRef(null);
  const categoriesSectionRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
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

  // Check if category scrolling is needed
  useEffect(() => {
    const checkScroll = () => {
      if (categoryScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    const scrollElement = categoryScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      // Check on resize
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  // Handle product selection from search
  useEffect(() => {
    if (location.state?.selectedProduct) {
      const product = location.state.selectedProduct;
      setSelectedProduct(product);
      setIsProductModalOpen(true);
      // Clear the state to prevent reopening on re-render
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const filteredProducts = products.filter(p => {
    const categoryName = typeof p.category === 'object' ? p.category?.name : p.category;
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const matchesSearch = searchTerm === '' || (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice = (p.price || 0) >= priceRange.min && (p.price || 0) <= priceRange.max;
    return matchesCategory && matchesSearch && matchesPrice;
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
      const maxQuantity = selectedProduct.Quantity || 0;
      const existingItem = cartItems.find(item => item.id === selectedProduct.id);
      
      if (existingItem && existingItem.quantity >= maxQuantity) {
        showError(`Only ${maxQuantity} units available in stock`);
        return;
      }
      
      addToCart(selectedProduct);
      showSuccess('Product added to cart');
      setIsProductModalOpen(false);
    }
  };

  const handleBookService = (result) => {
    // Service request is handled in the modal
    // This callback can be used for additional actions after booking
    if (result) {
      console.log('Service request created:', result);
      // Snackbar is already shown in ServiceDetailModal, so we don't need to show it again
    }
    setIsServiceModalOpen(false);
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
        navigate('/change-password');
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
      <TopBar brandVariant="dashboard" />

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
                <button 
                  onClick={() => navigate('/resources')}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition"
                >
                  Resources
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
          <section className="mb-12" ref={categoriesSectionRef}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            {categories.length > 0 ? (
              <div className="relative">
                {showLeftArrow && (
                  <button
                    onClick={() => {
                      if (categoryScrollRef.current) {
                        categoryScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                      }
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                )}
                <div className="overflow-x-auto pb-4 -mx-4 px-12 hide-scrollbar" ref={categoryScrollRef}>
                  <div className="flex space-x-4 min-w-max">
                    {categories.map(cat => (
                      <button
                        key={cat.category_id}
                        onClick={() => {
                          // Toggle category selection
                          if (selectedCategory === cat.name) {
                            setSelectedCategory('all');
                          } else {
                            setSelectedCategory(cat.name);
                          }
                        }}
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
                {showRightArrow && (
                  <button
                    onClick={() => {
                      if (categoryScrollRef.current) {
                        categoryScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                      }
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No categories available.</p>
              </div>
            )}
          </section>

          {/* Products */}
          <section className="mb-12" ref={productsSectionRef}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
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
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setPriceRange({ min: 0, max: 100000 });
                        setShowFilters(false);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                        className={`absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition ${
                          isFavourite(prod.id || prod.product_id) ? 'opacity-100' : ''
                        }`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const productId = prod.product_id || prod.id;
                          if (!productId) {
                            console.error('Product ID not found:', prod);
                            return;
                          }
                          try {
                            await toggleFavouriteProduct(productId, showError);
                            const isFav = isFavourite(productId);
                            if (isFav) {
                              showSuccess('Added to favourites');
                            } else {
                              showSuccess('Removed from favourites');
                            }
                          } catch (err) {
                            console.error('Failed to toggle favourite', err);
                            showError(err.message || 'Failed to update favourite');
                          }
                        }}
                      >
                        <Heart 
                          className={`w-5 h-5 transition ${
                            isFavourite(prod.product_id || prod.id) 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-gray-600 hover:text-red-500'
                          }`} 
                        />
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
                          Rs.{prod.price ? prod.price.toLocaleString() : '0'}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if ((prod.Quantity || 0) > 0) {
                              const maxQty = prod.Quantity || 0;
                              const existingItem = cartItems.find(item => item.id === prod.id);
                              if (existingItem && existingItem.quantity >= maxQty) {
                                showError(`Only ${maxQty} units available in stock`);
                              } else {
                                addToCart(prod);
                                showSuccess('Product added to cart');
                              }
                            } else {
                              showError('Product is out of stock');
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
                        Rs.{serv.price ? serv.price.toLocaleString() : '0'}
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
                {categories.slice(0, 3).map((cat) => (
                  <li key={cat.category_id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        // Scroll to categories section with offset for top bar
                        setTimeout(() => {
                          if (categoriesSectionRef.current) {
                            const elementPosition = categoriesSectionRef.current.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - 80; // 80px offset for top bar
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }, 100);
                      }}
                      className="hover:text-green-400 text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://wa.me/923304325987" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">Contact Us</a></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-green-400 text-left">FAQs</button></li>
                <li><button onClick={() => navigate('/warranty')} className="hover:text-green-400 text-left">Warranty</button></li>
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