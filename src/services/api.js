const API_BASE_URL = "http://localhost:4000/api"; // your backend URL

// Categories
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

// Products (supports query params)
export const getProducts = async (token, query = "") => {
  const url = query
    ? `${API_BASE_URL}/products?${query}`
    : `${API_BASE_URL}/products`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

// Services (available only)
export const getAvailableServices = async (token) => {
  const response = await fetch(`${API_BASE_URL}/services/available`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }
  return response.json();
};
