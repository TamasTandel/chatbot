// frontend/src/services/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

// Helper function to handle responses
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    // Handle non-JSON responses if necessary, or assume error if JSON was expected
    // For now, if not JSON, we'll just get text.
    // This might happen for certain errors or unexpected server responses.
    data = { msg: await response.text() }; // Or some default error structure
  }

  if (!response.ok) {
    // Use the message from the JSON response if available, otherwise use a default
    const error = (data && data.msg) || (data && data.message) || response.statusText || `Request failed with status ${response.status}`;
    // Include full data for more context if available
    return Promise.reject({ error, status: response.status, data });
  }
  return data;
};

// Authentication API calls
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const fetchUserProfile = async (token) => {
  if (!token) {
    return Promise.reject({ error: "No token provided", status: 401 });
  }
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};


// Example of a generic GET request with auth (can be expanded)
export const authedGet = async (endpoint, token) => {
  if (!token) {
    return Promise.reject({ error: "No token provided for authenticated request", status: 401 });
  }
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
}

// Example of a generic POST request with auth (can be expanded)
export const authedPost = async (endpoint, data, token) => {
    if (!token) {
      return Promise.reject({ error: "No token provided for authenticated request", status: 401 });
    }
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }


// Add other API functions for products, orders, etc. here later

// Product API calls
export const getProducts = async (page = 1, perPage = 10, category = '', searchTerm = '') => {
  let queryParams = `?page=${page}&per_page=${perPage}`;
  if (category) {
    queryParams += `&category=${encodeURIComponent(category)}`;
  }
  if (searchTerm) {
    queryParams += `&search=${encodeURIComponent(searchTerm)}`;
  }
  const response = await fetch(`${API_BASE_URL}/products${queryParams}`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const getProductByPrdId = async (prdId) => {
  const response = await fetch(`${API_BASE_URL}/products/${prdId}`, {
    method: 'GET',
  });
  return handleResponse(response);
};

// Category API calls
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/products/categories`, { // Note: categories are under /products/categories
    method: 'GET',
  });
  return handleResponse(response);
};

export const getCategoryById = async (categoryId) => {
  const response = await fetch(`${API_BASE_URL}/products/categories/${categoryId}`, {
    method: 'GET',
  });
  return handleResponse(response);
};

// TODO: Add functions for creating, updating, deleting products/categories (admin)
// export const createProduct = async (productData, token) => { ... }
