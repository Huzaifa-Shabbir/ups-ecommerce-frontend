import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Star,
  MessageCircle,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import {
  getOrdersByCustomer,
  getOrderById,
  getFeedbackByCustomer,
  getFeedbackForOrder,
  createFeedback,
  deleteFeedback,
  getProductById
} from '../../services/api';
import TopBar from '../../components/Layout/TopBar';
import Modal from '../../components/Modal/Modal';
import ProductDetailModal from '../../components/Modal/ProductDetailModal';

const Orders = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [orders, setOrders] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackForms, setFeedbackForms] = useState({});
  const [feedbackSubmitting, setFeedbackSubmitting] = useState({});
  const [feedbackDeleting, setFeedbackDeleting] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [enrichedProducts, setEnrichedProducts] = useState({});

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, feedbackRes] = await Promise.all([
          getOrdersByCustomer(user.user_id, accessToken),
          getFeedbackByCustomer(user.user_id, accessToken)
        ]);

        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes.orders || []);
        const feedbackData = Array.isArray(feedbackRes) ? feedbackRes : (feedbackRes.feedback || []);

        // Sort orders by date (newest first)
        const sortedOrders = ordersData.sort((a, b) => {
          const dateA = new Date(a.created_at || a.order_date || a.date || 0);
          const dateB = new Date(b.created_at || b.order_date || b.date || 0);
          return dateB - dateA; // Descending order (newest first)
        });

        setOrders(sortedOrders);
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

    let currentOrder = orders.find((o) => o.order_id === orderId);
    
    try {
      const orderDetail = await getOrderById(orderId, accessToken);
      if (orderDetail?.order) {
        setOrders((prev) =>
          prev.map((order) => (order.order_id === orderId ? { ...order, ...orderDetail.order } : order))
        );
        currentOrder = { ...currentOrder, ...orderDetail.order };
      }
    } catch (err) {
      console.warn('Failed to refresh order details', err);
    }

    if (currentOrder?.items) {
      const itemsToEnrich = [];
      currentOrder.items.forEach((item, idx) => {
        const norm = normalizeProductFromItem(item);
        if (!norm.name || norm.name.startsWith('Product ') || !norm.imgSrc) {
          if (norm.id) {
            itemsToEnrich.push({ item, idx, productId: norm.id });
          }
        }
      });

      if (itemsToEnrich.length > 0) {
        const enrichmentPromises = itemsToEnrich.map(async ({ item, idx, productId }) => {
          try {
            const resp = await getProductById(productId, accessToken);
            const product = resp?.product || resp || null;
            if (product) {
              return {
                orderId,
                itemIdx: idx,
                enrichedData: {
                  id: product.product_id || product.id,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  description: product.description,
                  category: product.category,
                  Quantity: product.Quantity ?? product.quantity ?? product.stock ?? 0
                }
              };
            }
          } catch (err) {
            console.warn(`Failed to fetch product ${productId} for order item`, err);
          }
          return null;
        });

        const enrichedResults = await Promise.all(enrichmentPromises);
        const enrichedMap = {};
        enrichedResults.forEach((result) => {
          if (result) {
            const key = `${result.orderId}-${result.itemIdx}`;
            enrichedMap[key] = result.enrichedData;
          }
        });
        setEnrichedProducts((prev) => ({ ...prev, ...enrichedMap }));
      }
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
      showError('Please provide both rating and feedback');
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
      showSuccess('Feedback submitted successfully!');
    } catch (err) {
      console.error('Failed to submit feedback', err);
      showError(err.message || 'Failed to submit feedback');
    } finally {
      setFeedbackSubmitting((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDeleteFeedback = async (feedbackId, orderId = null) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    setFeedbackDeleting((prev) => ({ ...prev, [feedbackId]: true }));
    setError(null);
    try {
      await deleteFeedback(feedbackId, accessToken);
      
      if (orderId) {
        const feedbackRes = await getFeedbackForOrder(orderId, accessToken);
        const feedbackData = Array.isArray(feedbackRes) ? feedbackRes : (feedbackRes.feedback || []);
        setFeedbackByOrder((prev) => ({ ...prev, [orderId]: feedbackData }));
      }
      
      const customerFeedbackRes = await getFeedbackByCustomer(user.user_id, accessToken);
      const customerFeedbackData = Array.isArray(customerFeedbackRes)
        ? customerFeedbackRes
        : (customerFeedbackRes.feedback || []);
      setCustomerFeedback(customerFeedbackData);
      showSuccess('Feedback deleted successfully');
    } catch (err) {
      console.error('Failed to delete feedback', err);
      showError(err.message || 'Failed to delete feedback');
    } finally {
      setFeedbackDeleting((prev) => ({ ...prev, [feedbackId]: false }));
    }
  };

  const normalizeProductFromItem = (item) => {
    const embedded = item.product || item.product_data || item.productDetails || {};
    const id = embedded.product_id || embedded.id || item.product_id || item.productId || null;
    const name = embedded.name || item.name || item.product_name || `Product ${id || ''}`.trim();
    const imgSrc = embedded.image || embedded.img || item.image || item.product_image || null;
    const unitPrice = (embedded.price ?? item.price ?? item.unit_price ?? 0);
    const qty = item.quantity ?? item.qty ?? item.order_quantity ?? item.qty_order ?? 1;
    const stock = (embedded.Quantity ?? embedded.quantity ?? embedded.stock ?? item.Quantity ?? 0);
    const description = embedded.description || item.description || '';
    const category = embedded.category || item.category || null;
    return { id, name, imgSrc, unitPrice, qty, stock, description, category, raw: embedded };
  };

  const openProductFromItem = async (item) => {
    const norm = normalizeProductFromItem(item);

    if (norm.raw && (norm.raw.name || norm.raw.id || norm.raw.product_id)) {
      setSelectedProduct({
        id: norm.id,
        name: norm.name,
        image: norm.imgSrc,
        price: norm.unitPrice,
        description: norm.description,
        category: norm.category,
        Quantity: norm.stock
      });
      setIsProductModalOpen(true);
      return;
    }

    if (norm.id) {
      try {
        const resp = await getProductById(norm.id, accessToken);
        const product = resp?.product || resp || null;
        if (product) {
          setSelectedProduct({
            id: product.product_id || product.id,
            name: product.name || norm.name,
            image: product.image || norm.imgSrc,
            price: product.price ?? norm.unitPrice,
            description: product.description || norm.description,
            category: product.category || norm.category,
            Quantity: product.Quantity ?? product.quantity ?? product.stock ?? norm.stock
          });
          setIsProductModalOpen(true);
          return;
        }
      } catch (err) {
        console.warn('getProductById failed', err);
      }
    }

    setSelectedProduct({
      id: norm.id,
      name: norm.name,
      image: norm.imgSrc,
      price: norm.unitPrice,
      description: norm.description,
      category: norm.category,
      Quantity: norm.stock
    });
    setIsProductModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <TopBar brandVariant="dashboard" />
        <div className="flex flex-col justify-center items-center text-center py-24 px-6">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-full mb-6">
            <Package className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
          <p className="text-gray-600 mb-6">Access your order history and leave feedback.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition transform hover:scale-105"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <TopBar brandVariant="dashboard" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Order History</h1>
              <p className="text-green-50 text-lg">Track your orders and share your feedback</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-green-100">
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{customerFeedback.length} {customerFeedback.length === 1 ? 'Feedback' : 'Feedback Entries'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        ) : (
          <>
            {/* Orders Section */}
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="w-6 h-6" />
                      <h2 className="text-2xl font-bold">My Orders</h2>
                    </div>
                    <span className="text-green-100 text-sm">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
                  </div>
                </div>

                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition transform hover:scale-105"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const isExpanded = expandedOrderId === order.order_id;
                        return (
                          <div
                            key={order.order_id}
                            className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition"
                          >
                            {/* Order Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                      <Package className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Order #{order.order_id}</p>
                                      <h3 className="text-xl font-bold text-gray-900">
                                        {formatDate(order.order_date || order.order?.order_date)}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 mt-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                      {order.status?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                    <div className="flex items-center space-x-1 text-gray-700">
                                      
                                      <span className="font-bold text-lg">Rs. {order.total_amount?.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleOrderDetails(order.order_id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                                >
                                  <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Order Details */}
                            {isExpanded && (
                              <div className="p-6 space-y-6 bg-white border-t border-gray-200">
                                {/* Delivery Address */}
                                {order.delivery_address && (
                                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <MapPin className="w-5 h-5 text-blue-600" />
                                      <h4 className="font-semibold text-gray-900">Delivery Address</h4>
                                    </div>
                                    <p className="text-gray-700">{order.delivery_address?.detail}</p>
                                    <p className="text-gray-600 text-sm">
                                      {order.delivery_address?.city}, {order.delivery_address?.country}
                                    </p>
                                  </div>
                                )}

                                {/* Order Items */}
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span>Order Items ({(order.items || []).length})</span>
                                  </h4>
                                  <div className="space-y-3">
                                    {(order.items || []).map((item, idx) => {
                                      const p = normalizeProductFromItem(item);
                                      const enrichedKey = `${order.order_id}-${idx}`;
                                      const enriched = enrichedProducts[enrichedKey];
                                      
                                      const displayName = enriched?.name || p.name;
                                      const displayImg = enriched?.image || p.imgSrc;
                                      const displayCategory = enriched?.category || (typeof item.category === 'object' ? item.category?.name : (item.category || p.category || ''));
                                      const displayDescription = enriched?.description || item.description || p.description;
                                      const displayStock = enriched?.Quantity ?? p.stock;
                                      
                                      return (
                                        <button
                                          key={`${item.order_item_id || idx}-${p.id || displayName}`}
                                          onClick={(e) => { e.preventDefault(); openProductFromItem(item); }}
                                          className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition text-left group"
                                        >
                                          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                            {displayImg ? (
                                              <img
                                                src={displayImg}
                                                alt={displayName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                                onError={(e) => {
                                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200&background=27ae60&color=fff&bold=true`;
                                                }}
                                              />
                                            ) : (
                                              <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200&background=27ae60&color=fff&bold=true`}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                              />
                                            )}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                              <div className="min-w-0 flex-1">
                                                {displayCategory && (
                                                  <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded mb-2">
                                                    {typeof displayCategory === 'object' ? displayCategory?.name : displayCategory}
                                                  </span>
                                                )}
                                                <h5 className="text-lg font-bold text-gray-900 mb-1">{displayName}</h5>
                                                {displayDescription && (
                                                  <p className="text-sm text-gray-600 line-clamp-2">{displayDescription}</p>
                                                )}
                                                <div className="flex items-center space-x-4 mt-2">
                                                  <span className="text-sm text-gray-500">
                                                    Quantity: <span className="font-semibold text-gray-900">{p.qty}</span>
                                                  </span>
                                                  <span className={`text-xs px-2 py-1 rounded ${displayStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {displayStock > 0 ? `${displayStock} in stock` : 'Out of stock'}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-sm text-gray-500">Unit Price</p>
                                                <p className="text-lg font-semibold text-gray-700">Rs. {p.unitPrice.toLocaleString()}</p>
                                                <p className="text-sm text-gray-500 mt-1">Total</p>
                                                <p className="text-xl font-bold text-green-600">Rs. {(p.unitPrice * p.qty).toFixed(2)}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Feedback Section */}
                                {order.status === 'completed' && (
                                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                    <div className="flex items-center space-x-2 mb-4">
                                      <MessageCircle className="w-5 h-5 text-gray-700" />
                                      <h4 className="text-lg font-semibold text-gray-900">Feedback</h4>
                                    </div>

                                    {(feedbackByOrder[order.order_id] || []).length > 0 ? (
                                      <div className="space-y-3 mb-4">
                                        {feedbackByOrder[order.order_id].map((fb) => (
                                          <div key={fb.feedback_id} className="p-4 bg-white rounded-xl border border-gray-200 relative">
                                            <div className="flex items-start justify-between mb-2 pr-10">
                                              <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1">
                                                  {Array.from({ length: 5 }).map((_, idx) => (
                                                    <Star
                                                      key={idx}
                                                      className={`w-4 h-4 ${idx < fb.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                                                    />
                                                  ))}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                  {new Date(fb.created_at).toLocaleDateString()}
                                                </span>
                                              </div>
                                            </div>
                                            <button
                                              onClick={() => handleDeleteFeedback(fb.feedback_id, order.order_id)}
                                              disabled={feedbackDeleting[fb.feedback_id]}
                                              className="absolute top-3 right-3 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                              title="Delete feedback"
                                            >
                                              {feedbackDeleting[fb.feedback_id] ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                              ) : (
                                                <Trash2 className="w-4 h-4" />
                                              )}
                                            </button>
                                            <p className="text-gray-700 pr-10">{fb.feedback_message}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 mb-4">No feedback yet for this order.</p>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                        <div className="flex items-center space-x-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() => handleFeedbackChange(order.order_id, 'rating', star)}
                                              className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                              <Star
                                                className={`w-8 h-8 ${
                                                  star <= (feedbackForms[order.order_id]?.rating || 0)
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'text-gray-300 hover:text-yellow-400'
                                                } transition`}
                                              />
                                            </button>
                                          ))}
                                          {feedbackForms[order.order_id]?.rating && (
                                            <span className="ml-2 text-sm text-gray-600">
                                              {feedbackForms[order.order_id].rating === 5 ? 'Excellent' :
                                               feedbackForms[order.order_id].rating === 4 ? 'Very Good' :
                                               feedbackForms[order.order_id].rating === 3 ? 'Good' :
                                               feedbackForms[order.order_id].rating === 2 ? 'Fair' : 'Poor'}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <textarea
                                        rows="2"
                                        placeholder="Share your experience with this order..."
                                        value={feedbackForms[order.order_id]?.feedback_message || ''}
                                        onChange={(e) =>
                                          handleFeedbackChange(order.order_id, 'feedback_message', e.target.value)
                                        }
                                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white"
                                      ></textarea>
                                    </div>
                                    <button
                                      onClick={() => handleFeedbackSubmit(order.order_id)}
                                      disabled={feedbackSubmitting[order.order_id]}
                                      className="mt-4 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-60 flex items-center justify-center space-x-2"
                                    >
                                      {feedbackSubmitting[order.order_id] ? (
                                        <>
                                          <Loader2 className="w-5 h-5 animate-spin" />
                                          <span>Submitting...</span>
                                        </>
                                      ) : (
                                        <>
                                          <MessageCircle className="w-5 h-5" />
                                          <span>Submit Feedback</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Feedback History Section */}
            <section>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Star className="w-6 h-6" />
                      <h2 className="text-2xl font-bold">Your Feedback</h2>
                    </div>
                    <span className="text-green-100 text-sm">{customerFeedback.length} {customerFeedback.length === 1 ? 'entry' : 'entries'}</span>
                  </div>
                </div>

                <div className="p-6">
                  {customerFeedback.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-lg font-semibold">You haven't shared any feedback yet.</p>
                      <p className="text-gray-500 text-sm mt-2">Complete an order and share your experience!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {customerFeedback.map((fb) => (
                        <div key={fb.feedback_id} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-green-300 transition relative">
                          <button
                            onClick={() => handleDeleteFeedback(fb.feedback_id)}
                            disabled={feedbackDeleting[fb.feedback_id]}
                            className="absolute top-3 right-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 z-10"
                            title="Delete feedback"
                          >
                            {feedbackDeleting[fb.feedback_id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pr-12">
                            <span className="font-semibold">Order #{fb.order_no}</span>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 mb-3">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-5 h-5 ${idx < fb.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-semibold text-gray-700">{fb.rating}/5</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pr-12">{fb.feedback_message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => { setIsProductModalOpen(false); setSelectedProduct(null); }}>
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => { setIsProductModalOpen(false); setSelectedProduct(null); }}
          onAddToCart={() => {
            setIsProductModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Orders;
