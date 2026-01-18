import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
};

export const contactService = {
    send: (data) => api.post('/contact/', data),
};

export const commentService = {
    getByCategory: (categorySlug) => api.get('/comments/', { params: { category: categorySlug } }),
    create: (data) => api.post('/comments/', data),
};

export default api;
