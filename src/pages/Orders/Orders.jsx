import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Star,
  PlusCircle,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getOrdersByCustomer,
  getOrderById,
  createAddress,
  getAddressesByCustomer,
  getFeedbackByCustomer,
  getFeedbackForOrder,
  createFeedback
} from '../../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addressForm, setAddressForm] = useState({ city: '', country: '', detail: '' });
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [feedbackForms, setFeedbackForms] = useState({});
  const [feedbackSubmitting, setFeedbackSubmitting] = useState({});

  useEffect(() => {
    if (!user || !accessToken) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, addressesRes, feedbackRes] = await Promise.all([
          getOrdersByCustomer(user.user_id, accessToken),
          getAddressesByCustomer(user.user_id, accessToken),
          getFeedbackByCustomer(user.user_id, accessToken)
        ]);

        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes.orders || []);
        const addressesData = Array.isArray(addressesRes) ? addressesRes : (addressesRes.addresses || []);
        const feedbackData = Array.isArray(feedbackRes) ? feedbackRes : (feedbackRes.feedback || []);

        setOrders(ordersData);
        setAddresses(addressesData);
        setCustomerFeedback(feedbackData);
      } catch (err) {
        console.error('Failed to load orders data', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, accessToken]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setAddressSubmitting(true);
    setError(null);
    try {
      await createAddress({ ...addressForm, user_id: user.user_id }, accessToken);
      const updatedAddresses = await getAddressesByCustomer(user.user_id, accessToken);
      const addressesData = Array.isArray(updatedAddresses) ? updatedAddresses : (updatedAddresses.addresses || []);
      setAddresses(addressesData);
      setAddressForm({ city: '', country: '', detail: '' });
    } catch (err) {
      console.error('Failed to create address', err);
      setError(err.message || 'Failed to create address');
    } finally {
      setAddressSubmitting(false);
    }
  };

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!feedbackByOrder[orderId]) {
      try {
        const feedbackRes = await getFeedbackForOrder(orderId, accessToken);
        const feedbackData = Array.isArray(feedbackRes) ? feedbackRes : (feedbackRes.feedback || []);
        setFeedbackByOrder((prev) => ({ ...prev, [orderId]: feedbackData }));
      } catch (err) {
        console.warn('Failed to fetch feedback for order', orderId, err);
      }
    }

    // Optionally refresh order details
    try {
      const orderDetail = await getOrderById(orderId, accessToken);
      if (orderDetail?.order) {
        setOrders((prev) =>
          prev.map((order) => (order.order_id === orderId ? { ...order, ...orderDetail.order } : order))
        );
      }
    } catch (err) {
      console.warn('Failed to refresh order details', err);
    }
  };

  const handleFeedbackChange = (orderId, field, value) => {
    setFeedbackForms((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const handleFeedbackSubmit = async (orderId) => {
    if (!user) return;
    const form = feedbackForms[orderId];
    if (!form?.rating || !form?.feedback_message) {
      alert('Please provide both rating and feedback');
      return;
    }

    setFeedbackSubmitting((prev) => ({ ...prev, [orderId]: true }));
    setError(null);
    try {
      await createFeedback(
        {
          customer_id: user.user_id,
          order_no: orderId,
          rating: Number(form.rating),
          feedback_message: form.feedback_message
        },
        accessToken
      );
      const feedbackRes = await getFeedbackForOrder(orderId, accessToken);
      const feedbackData = Array.isArray(feedbackRes) ? feedbackRes : (feedbackRes.feedback || []);
      setFeedbackByOrder((prev) => ({ ...prev, [orderId]: feedbackData }));
      setFeedbackForms((prev) => ({ ...prev, [orderId]: { rating: '', feedback_message: '' } }));
      const customerFeedbackRes = await getFeedbackByCustomer(user.user_id, accessToken);
      const customerFeedbackData = Array.isArray(customerFeedbackRes)
        ? customerFeedbackRes
        : (customerFeedbackRes.feedback || []);
      setCustomerFeedback(customerFeedbackData);
    } catch (err) {
      console.error('Failed to submit feedback', err);
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setFeedbackSubmitting((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6 text-center">
        <Package className="w-16 h-16 text-green-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
        <p className="text-gray-600 mb-6">Access your order history, manage addresses, and leave feedback.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Orders & Addresses</h1>
            <p className="text-gray-600">Manage everything related to your purchases in one place.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-semibold text-green-600 border border-green-200 rounded-lg hover:bg-green-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your data...</p>
          </div>
        ) : (
          <>
            {/* Addresses Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <span>Delivery Addresses</span>
                </h2>
                <span className="text-sm text-gray-500">{addresses.length} saved</span>
              </div>
              {addresses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.address_id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-1">{addr.city}</h3>
                      <p className="text-sm text-gray-600">{addr.detail}</p>
                      <p className="text-sm text-gray-500">{addr.country}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No addresses saved yet. Add one below.</p>
              )}

              <form className="mt-6 grid md:grid-cols-3 gap-4" onSubmit={handleAddressSubmit}>
                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, country: e.target.value }))}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Street / House Detail"
                  value={addressForm.detail}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, detail: e.target.value }))}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={addressSubmitting}
                  className="md:col-span-3 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
                >
                  {addressSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>Save Address</span>
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Orders Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Package className="w-6 h-6 text-green-600" />
                  <span>Order History</span>
                </h2>
                <span className="text-sm text-gray-500">{orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-2">No orders yet.</p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2 text-sm font-semibold text-green-600 border border-green-200 rounded-lg hover:bg-green-50"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.order_id} className="border border-gray-200 rounded-xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order #{order.order_id}</p>
                          <h3 className="text-xl font-bold text-gray-900">
                            {new Date(order.order_date || order.order?.order_date || Date.now()).toLocaleString()}
                          </h3>
                          <div className="mt-2 flex items-center space-x-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-gray-600 font-semibold">₹{order.total_amount?.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="font-semibold text-gray-900">Deliver to</p>
                          <p>{order.delivery_address?.detail}</p>
                          <p>
                            {order.delivery_address?.city}, {order.delivery_address?.country}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleOrderDetails(order.order_id)}
                          className="text-sm font-semibold text-green-600 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50 self-start"
                        >
                          {expandedOrderId === order.order_id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>

                      {expandedOrderId === order.order_id && (
                        <div className="mt-6 space-y-6 border-t border-dashed border-gray-200 pt-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span>Items</span>
                            </h4>
                            <div className="space-y-3">
                              {(order.items || []).map((item, idx) => (
                                <div
                                  key={`${item.order_item_id || idx}-${item.product_id}`}
                                  className="flex justify-between text-sm text-gray-700"
                                >
                                  <span>
                                    Product #{item.product_id} • Qty: {item.quantity}
                                  </span>
                                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.status === 'completed' && (
                            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-gray-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Feedback</h4>
                              </div>

                              {(feedbackByOrder[order.order_id] || []).length > 0 ? (
                                <div className="space-y-3">
                                  {feedbackByOrder[order.order_id].map((fb) => (
                                    <div key={fb.feedback_id} className="p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>
                                          <Star className="inline w-4 h-4 text-yellow-500" /> {fb.rating}/5
                                        </span>
                                        <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-gray-700 mt-1">{fb.feedback_message}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No feedback yet for this order.</p>
                              )}

                              <div className="grid md:grid-cols-2 gap-4">
                                <select
                                  value={feedbackForms[order.order_id]?.rating || ''}
                                  onChange={(e) =>
                                    handleFeedbackChange(order.order_id, 'rating', e.target.value)
                                  }
                                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                  <option value="">Select rating</option>
                                  {[5, 4, 3, 2, 1].map((val) => (
                                    <option key={val} value={val}>
                                      {val} - {val === 5 ? 'Excellent' : val === 1 ? 'Poor' : ''}
                                    </option>
                                  ))}
                                </select>
                                <textarea
                                  rows="2"
                                  placeholder="Share your experience..."
                                  value={feedbackForms[order.order_id]?.feedback_message || ''}
                                  onChange={(e) =>
                                    handleFeedbackChange(order.order_id, 'feedback_message', e.target.value)
                                  }
                                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                ></textarea>
                              </div>
                              <button
                                onClick={() => handleFeedbackSubmit(order.order_id)}
                                disabled={feedbackSubmitting[order.order_id]}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
                              >
                                {feedbackSubmitting[order.order_id] ? 'Submitting...' : 'Submit Feedback'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Feedback History */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Star className="w-6 h-6 text-green-600" />
                  <span>Your Feedback</span>
                </h2>
                <span className="text-sm text-gray-500">{customerFeedback.length} entries</span>
              </div>

              {customerFeedback.length === 0 ? (
                <p className="text-gray-500">You haven't shared any feedback yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {customerFeedback.map((fb) => (
                    <div key={fb.feedback_id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>Order #{fb.order_no}</span>
                        <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${idx < fb.rating ? 'fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{fb.feedback_message}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;

