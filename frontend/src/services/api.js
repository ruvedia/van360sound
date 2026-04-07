import axios from 'axios';

const ENV_URL = import.meta.env.VITE_API_URL;
// Limpiamos la URL de barras finales si las hay para evitar dobles barras //api
const cleanBaseUrl = ENV_URL ? ENV_URL.replace(/\/+$/, '') : '';
export const API_BASE_URL = cleanBaseUrl ? `${cleanBaseUrl}/api` : '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const categoryService = {
    getAll: () => api.get('/categories/'),
    getBySlug: (slug) => api.get(`/categories/${slug}/`),
};

export const headphoneService = {
    getAll: (params) => api.get('/headphones/', { params }),
    getBySlug: (slug) => api.get(`/headphones/${slug}/`),
    getByCategory: (categorySlug) => api.get('/headphones/', { params: { category: categorySlug } }),
    getFeatured: () => api.get('/headphones/', { params: { featured: true } }),
    search: (query) => api.get('/headphones/search/', { params: { q: query } }),
};

export const articleService = {
    getAll: (params) => api.get('/articles/', { params }),
    getBySlug: (slug) => api.get(`/articles/${slug}/`),
    getByType: (type) => api.get('/articles/', { params: { type } }),
    search: (query, type = null) => {
        const params = { search: query };
        if (type) params.type = type;
        return api.get('/articles/', { params });
    },
};

export const contactService = {
    send: (data) => api.post('/contact/', data),
};

export const commentService = {
    getByCategory: (categorySlug) => api.get('/comments/', { params: { category: categorySlug } }),
    getByArticle: (articleSlug) => api.get('/comments/', { params: { article: articleSlug } }),
    create: (data) => api.post('/comments/', data),
};

export const shopService = {
    getProducts: () => api.get('/products/'),
    createOrder: (data) => api.post('/orders/', data),
};

export const bookingService = {
    create: (data) => api.post('/bookings/', data),
};


export default api;
