import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Package, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useCart } from '../../context/CartContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { getProductById } from '../../services/api';
import TopBar from '../../components/Layout/TopBar';
import Modal from '../../components/Modal/Modal';
import ProductDetailModal from '../../components/Modal/ProductDetailModal';

const Favourites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favourites, loading: favouritesLoading, isFavourite, toggleFavouriteProduct, loadFavourites } = useFavourites();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useSnackbar();
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavouriteProducts = async () => {
      if (favourites.length === 0) {
        setFavouriteProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const productPromises = favourites.map(productId => 
          getProductById(productId, null).catch(err => {
            console.warn(`Failed to fetch product ${productId}`, err);
            return null;
          })
        );
        
        const products = await Promise.all(productPromises);
        const validProducts = products
          .map(res => res?.product || res)
          .filter(product => product && (product.id || product.product_id));
        
        setFavouriteProducts(validProducts);
      } catch (err) {
        console.error('Failed to load favourite products', err);
        setError(err.message || 'Failed to load favourite products');
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteProducts();
  }, [favourites, user, navigate]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar brandVariant="dashboard" />
      
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Favourites</h1>
              <p className="text-green-50 mt-2">Your saved products</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {favouritesLoading || loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your favourites...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : favouriteProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">No favourites yet</h2>
            <p className="text-gray-600 mb-8">Start adding products to your favourites!</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {favouriteProducts.length} {favouriteProducts.length === 1 ? 'Favourite' : 'Favourites'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favouriteProducts.map((product) => {
                const productId = product.product_id || product.id;
                const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
                const displayStock = product.Quantity ?? product.quantity ?? product.stock ?? 0;
                
                return (
                  <div
                    key={productId}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden group cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'Product')}&size=400&background=27ae60&color=fff&bold=true`;
                          }}
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'Product')}&size=400&background=27ae60&color=fff&bold=true`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-100 transition"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await toggleFavouriteProduct(productId, showError);
                            const isFav = isFavourite(productId);
                            if (isFav) {
                              showSuccess('Added to favourites');
                            } else {
                              showSuccess('Removed from favourites');
                            }
                            // Reload favourites after toggle
                            await loadFavourites();
                          } catch (err) {
                            console.error('Failed to toggle favourite', err);
                          }
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 transition ${
                            isFavourite(productId)
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-5">
                      {categoryName && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {categoryName}
                        </span>
                      )}
                      <h3 className="font-bold text-lg mt-2 mb-1 text-gray-900">{product.name || 'Unnamed Product'}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description || 'No description available'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">
                          Rs.{product.price ? product.price.toLocaleString() : '0'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (displayStock > 0) {
                              handleAddToCart(product);
                            }
                          }}
                          disabled={displayStock === 0}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
      >
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={() => {
            if (selectedProduct) {
              handleAddToCart(selectedProduct);
            }
            setIsProductModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Favourites;

