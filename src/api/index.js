const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(endpoint, method = 'GET', body = null, params = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`);

  if (method === 'GET' && Object.keys(params).length) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, v);
      }
    });
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') && {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url.toString(), options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error('Invalid JSON response:', text);
      throw new Error('API did not return JSON');
    }
  } catch (err) {
    console.error('API ERROR:', err);
    throw err;
  }
}

// ================= APIs =================

export const authApi = {
  signup:  (data) => request('auth/signup', 'POST', data),
  login:   (data) => request('auth/login',  'POST', data),
  getUser: ()     => request('auth/get_user', 'POST'),
};

export const heroApi = {
  getSlides: () => request('hero'),
};

export const categoriesApi = {
  getAll: () => request('categories'),
};

export const productsApi = {
  getAll:  (params = {}) => request('products', 'GET', null, params),
  getById: (id)          => request('products', 'GET', null, { id }),
};

export const cartApi = {
  getCart:    ()                         => request('cart', 'GET'),
  addItem:    (product_id, quantity = 1) => request('cart', 'POST',   { product_id, quantity }),
  updateItem: (cart_id, quantity)        => request('cart', 'PUT',    { cart_id, quantity }),
  removeItem: (cart_id)                  => request('cart', 'DELETE', { cart_id }),
};

export const checkoutApi = {
  placeOrder: (data) => request('checkout', 'POST', data),
};

export const ordersApi = {
  getAll:  ()   => request('orders', 'GET'),
  getById: (id) => request('orders', 'GET', null, { id }),
};
