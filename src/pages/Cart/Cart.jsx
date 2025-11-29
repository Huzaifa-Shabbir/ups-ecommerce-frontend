import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, MapPin, Loader2, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { createOrder, getAddressesByCustomer } from '../../services/api';
import TopBar from '../../components/Layout/TopBar';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getCartCount } = useCart();
  const { user, accessToken } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const total = getCartTotal();
  const shipping = total >= 5000 ? 0 : 200;
  const grandTotal = total + shipping;

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      setAddressesLoading(true);
      setCheckoutError(null);
      try {
        const res = await getAddressesByCustomer(user.user_id, accessToken);
        const data = Array.isArray(res) ? res : res.addresses || [];
        setAddresses(data);
        setSelectedAddressId(data[0]?.address_id ?? null);
      } catch (err) {
        console.error('Failed to load addresses', err);
        setCheckoutError(err.message || 'Failed to load addresses');
      } finally {
        setAddressesLoading(false);
      }
    };
    fetchAddresses();
  }, [user]);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (cartItems.length === 0) {
      showError('Your cart is empty.');
      return;
    }
    if (!selectedAddressId) {
      showError('Please select a delivery address.');
      return;
    }

    try {
      setOrderSubmitting(true);
      setCheckoutError(null);
      const payload = {
        customer_id: user.user_id,
        total_amount: Number(grandTotal.toFixed(2)),
        status: 'pending',
        delivery_address: selectedAddressId,
        delivery_Address: selectedAddressId,
        items: cartItems.map((item) => ({
          product_id: item.product_id || item.id,
          price: item.price,
          quantity: item.quantity
        }))
      };
      await createOrder(payload, accessToken || '');
      clearCart();
      showSuccess('Order placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 1000);
    } catch (err) {
      console.error('Checkout failed', err);
      showError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar brandVariant="dashboard" />
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-green-100">Checkout</p>
            <h1 className="text-4xl font-bold">Your Cart</h1>
            <p className="text-green-50 mt-2">Secure checkout with premium UPS systems and accessories.</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-500" />
            </div>
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
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Review items</p>
                    <h2 className="text-2xl font-bold text-gray-900">Cart Items ({cartItems.length})</h2>
                  </div>
                  <button onClick={clearCart} className="text-sm font-semibold text-red-600 hover:text-red-700">
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white"
                      >
                        <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  item.name || 'Product'
                                )}&size=200&background=27ae60&color=fff&bold=true`;
                              }}
                            />
                          ) : (
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.name || 'Product'
                              )}&size=200&background=27ae60&color=fff&bold=true`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

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
                              onClick={() => {
                                removeFromCart(item.id);
                                showSuccess('Product removed from cart');
                              }}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-4">
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
                                <span className="text-xs text-gray-500">({item.Quantity} available)</span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                Rs.{(item.price * item.quantity).toLocaleString()}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500">Rs.{item.price.toLocaleString()} each</p>
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

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Summary</p>
                  <h2 className="text-2xl font-bold text-gray-900">Order Overview</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold">Rs.{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `Rs.${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-green-600">Rs.{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {total >= 5000 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-medium">🎉 You qualify for free shipping!</p>
                  </div>
                )}

                {user && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>Delivery Address</span>
                      </span>
                      <button
                        onClick={() => navigate('/profile')}
                        className="text-xs font-semibold text-green-600 hover:text-green-700"
                      >
                        Manage
                      </button>
                    </div>

                    {addressesLoading ? (
                      <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                        <span>Loading addresses...</span>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800">
                        No saved addresses. Please add one from the Profile page.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {addresses.map((address) => (
                          <label
                            key={address.address_id}
                            className={`flex items-start space-x-3 border rounded-xl px-4 py-3 cursor-pointer transition ${
                              selectedAddressId === address.address_id
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 hover:border-green-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={address.address_id}
                              checked={selectedAddressId === address.address_id}
                              onChange={() => setSelectedAddressId(address.address_id)}
                              className="mt-1 text-green-600 focus:ring-green-500"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{address.city}</p>
                              <p className="text-sm text-gray-600">{address.detail}</p>
                              <p className="text-xs text-gray-500">{address.country}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {checkoutError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{checkoutError}</p>
                  </div>
                )}

                {!user && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">🔒 Please login to proceed with checkout</p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={orderSubmitting || !user}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {orderSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>{user ? 'Place Order' : 'Login to Checkout'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
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

