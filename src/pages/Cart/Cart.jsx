import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { accessToken } = useAuth();

  const handleCheckout = () => {
    if (!accessToken) {
      // Save the current path to return after login
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    // TODO: Implement checkout functionality
    alert('Checkout functionality will be implemented soon!');
  };

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Shop</span>
            </button>
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Shopping Cart
              </span>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const categoryName = typeof item.category === 'object' 
                      ? item.category?.name 
                      : item.category;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                      >
                        {/* Product Image */}
                        <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Product')}&size=200&background=27ae60&color=fff&bold=true`;
                              }}
                            />
                          ) : (
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Product')}&size=200&background=27ae60&color=fff&bold=true`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              {categoryName && (
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded mb-2 inline-block">
                                  {categoryName}
                                </span>
                              )}
                              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {item.description || 'No description available'}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Quantity:</span>
                              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 transition rounded-l-lg"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 transition rounded-r-lg"
                                  disabled={item.quantity >= (item.Quantity || 0)}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              {(item.Quantity || 0) > 0 && (
                                <span className="text-xs text-gray-500">
                                  ({item.Quantity} available)
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500">
                                  ₹{item.price.toLocaleString()} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {total >= 5000 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>₹200</span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{(total + (total >= 5000 ? 0 : 200)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {total >= 5000 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}

                {!accessToken && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800 font-medium">
                      🔒 Please login to proceed with checkout
                    </p>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{accessToken ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full mt-4 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

