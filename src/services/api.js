const API_BASE_URL = "http://localhost:4000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await handleResponse(response);
  // Handle both array and object with categories property
  return Array.isArray(data) ? data : (data.categories || []);
};

export const getCategoryById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`);
  const data = await handleResponse(response);
  return data.category || data;
};

export const createCategory = async (categoryData, token) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  return handleResponse(response);
};

export const updateCategory = async (id, categoryData, token) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  return handleResponse(response);
};

export const deleteCategory = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Products API
export const getProducts = async (token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/products`, { headers });
  const data = await handleResponse(response);
  // Handle both array and object with products property
  return Array.isArray(data) ? data : (data.products || []);
};

export const getProductById = async (id, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/products/${id}`, { headers });
  const data = await handleResponse(response);
  return data.product || data;
};

export const createProduct = async (productData, token) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return handleResponse(response);
};

export const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return handleResponse(response);
};

export const deleteProduct = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Services API
export const getAllServices = async (token) => {
  const response = await fetch(`${API_BASE_URL}/services/all`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.services || []);
};

export const getAvailableServices = async (token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/services/available`, { headers });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.services || []);
};

export const getServiceById = async (id, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/services/${id}`, { headers });
  const data = await handleResponse(response);
  return data.service || data;
};

export const createService = async (serviceData, token) => {
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  return handleResponse(response);
};

export const updateService = async (id, serviceData, token) => {
  const response = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  return handleResponse(response);
};

export const deleteService = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Orders API
export const getAllOrders = async (token) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.orders || []);
};

export const getOrderSummary = async (token) => {
  const response = await fetch(`${API_BASE_URL}/orders/summary`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return data.report || data;
};

export const createOrder = async (orderData, token) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return handleResponse(response);
};

export const getOrdersByCustomer = async (customerId, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.orders || []);
};

export const getOrderById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return data.order || data;
};

export const getOrderDetail = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/detail`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return data.orderDetail || data;
};

export const updateOrderStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
};

export const deleteOrder = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Payments API
export const getAllPayments = async (token) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.payments || []);
};

export const createPayment = async (paymentData, token) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });
  return handleResponse(response);
};

export const getPaymentsByOrder = async (orderId, token) => {
  const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.payments || []);
};

export const updatePaymentStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE_URL}/payments/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
};

export const deletePayment = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Feedback API
export const getAllFeedback = async (token) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.feedback || []);
};

export const createFeedback = async (feedbackData, token) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(feedbackData)
  });
  return handleResponse(response);
};

export const getFeedbackByCustomer = async (customerId, token) => {
  const response = await fetch(`${API_BASE_URL}/feedback/customer/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.feedback || []);
};

export const getFeedbackForOrder = async (orderId, token) => {
  const response = await fetch(`${API_BASE_URL}/feedback/order/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.feedback || []);
};

export const deleteFeedback = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Export all as default object for easier imports
export default {
  // Categories
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Products
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Services
  getAllServices,
  getAvailableServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  
  // Orders
  getAllOrders,
  getOrderSummary,
  createOrder,
  getOrdersByCustomer,
  getOrderById,
  getOrderDetail,
  updateOrderStatus,
  deleteOrder,
  
  // Payments
  getAllPayments,
  createPayment,
  getPaymentsByOrder,
  updatePaymentStatus,
  deletePayment,
  
  // Feedback
  getAllFeedback,
  createFeedback,
  getFeedbackByCustomer,
  getFeedbackForOrder,
  deleteFeedback
};