const API_BASE_URL = "http://localhost:4000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, try to get text
      const text = await response.text().catch(() => '');
      errorData = { message: text || `API Error: ${response.status}` };
    }
    const errorMessage = errorData.message || errorData.error || `API Error: ${response.status}`;
    throw new Error(errorMessage);
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

export const getOrdersByCustomer = async (customerId, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`, {
    headers
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

// Addresses API
export const getAddressesByCustomer = async (userId, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/addresses/${userId}`, { headers });
  const data = await handleResponse(response);
  if (Array.isArray(data)) return data;
  return data.addresses || [];
};

export const createAddress = async (addressData, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(addressData)
  });
  return handleResponse(response);
};

export const updateAddress = async (addressId, addressData, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(addressData)
  });
  return handleResponse(response);
};

export const deleteAddress = async (addressId, token = null) => {
  const headers = {};
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
    method: 'DELETE',
    headers
  });
  return handleResponse(response);
};

export const deactivateAddress = async (addressId, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/addresses/deactivate/${addressId}`;
  console.log('Deactivating address:', { addressId, url, method: 'PATCH' });

  const response = await fetch(url, {
    method: 'PATCH',
    headers
  });
  return handleResponse(response);
};

// Favourites API
export const getFavouritesByUser = async (userId, token = null) => {
  const headers = {};
  // Only add Authorization header if token is provided and not empty
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/favourites/${userId}`, { headers });
  const data = await handleResponse(response);
  // API returns { favourites: [...] }, extract the array
  return Array.isArray(data) ? data : (data.favourites || []);
};

export const toggleFavourite = async (userId, productId, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  // Only add Authorization header if token is provided and not empty
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure productId is a number (API expects number, not string)
  // API expects: { "productId": 2 } (camelCase with capital I)
  const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : Number(productId);
  
  if (isNaN(productIdNum) || productIdNum <= 0) {
    throw new Error('Invalid product ID');
  }

  // Prepare request body exactly as API expects: { "productId": number }
  const requestBody = { productId: productIdNum };

  const response = await fetch(`${API_BASE_URL}/favourites/${userId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });
  
  return handleResponse(response);
};

// Slots API
export const getSlots = async (token = null) => {
  const headers = {};
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/slots`, { headers });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.slots || []);
};

// Service Requests API
export const createServiceRequest = async (requestData, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/service-requests`;
  console.log('Creating service request:', { url, requestData, hasToken: !!token });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestData)
  });

  console.log('Service request response:', { status: response.status, statusText: response.statusText });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('Service request error response:', errorText);
  }

  return handleResponse(response);
};

// Resources API
export const getResources = async (token = null) => {
  const headers = {};
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/resources/customers`, { headers });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data : (data.resources || []);
};

// Auth API - Change Password
export const changePassword = async (passwordData, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers,
    body: JSON.stringify(passwordData)
  });
  return handleResponse(response);
};

// Customer API
export const getCustomerById = async (userId, token = null) => {
  const headers = {};
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/customer/active/${userId}`, { headers });
  const data = await handleResponse(response);
  return data.customer || data;
};

export const updateCustomer = async (userId, customerData, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/customer/${userId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(customerData)
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
  deleteFeedback,
  
  // Addresses
  getAddressesByCustomer,
  createAddress,
  updateAddress,
  deleteAddress,
  deactivateAddress,
  
  // Favourites
  getFavouritesByUser,
  toggleFavourite,
  
  // Slots
  getSlots,
  
  // Service Requests
  createServiceRequest,
  
  // Resources
  getResources,
  
  // Auth
  changePassword,
  
  // Customer
  getCustomerById,
  updateCustomer
};