import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, User, Bell, Menu, Heart, TrendingUp, Package, Zap } from 'lucide-react';
import { getCategories, getProducts, getAvailableServices } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import ProductDetailModal from '../../components/Modal/ProductDetailModal';
import ServiceDetailModal from '../../components/Modal/ServiceDetailModal';

const Dashboard = () => {
  const { accessToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const [catRes, prodRes, servRes] = await Promise.all([
          getCategories(),
          getProducts(accessToken),
          getAvailableServices(accessToken)
        ]);
        
        console.log('Categories Response:', catRes);
        console.log('Products Response:', prodRes);
        console.log('Services Response:', servRes);
        
        // Handle different response structures
        const categoriesData = Array.isArray(catRes) ? catRes : (catRes.categories || []);
        const productsData = Array.isArray(prodRes) ? prodRes : (prodRes.products || []);
        const servicesData = Array.isArray(servRes) ? servRes : (servRes.services || []);
        
        console.log('Parsed Categories:', categoriesData);
        console.log('Parsed Products:', productsData);
        console.log('Parsed Services:', servicesData);
        
        setCategories(categoriesData);
        setProducts(productsData);
        setServices(servicesData);
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
    setCartCount(c => c + 1);
    setIsProductModalOpen(false);
    // You can add toast notification here
  };

  const handleBookService = () => {
    setIsServiceModalOpen(false);
    // Handle service booking logic
    alert('Service booking request submitted!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navigation */}
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
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition">
                <User className="w-6 h-6 text-gray-600" />
                <span className="hidden lg:block text-sm font-medium text-gray-700">Profile</span>
              </button>
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
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.category_id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-6 rounded-xl transition transform hover:scale-105 shadow-md ${
                      selectedCategory === cat.name
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : 'bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                    <p className={`text-sm ${selectedCategory === cat.name ? 'text-green-50' : 'text-gray-600'}`}>
                      {cat.description}
                    </p>
                  </button>
                ))}
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
                    key={prod.product_id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden group cursor-pointer"
                    onClick={() => handleProductClick(prod)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-6xl">📦</div>
                      <button 
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle wishlist
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
                            setCartCount(c => c + 1);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                        >
                          Add to Cart
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
                <li><a href="#" className="hover:text-green-400">Contact Us</a></li>
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

      {/* Product Detail Modal */}
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

      {/* Service Detail Modal */}
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