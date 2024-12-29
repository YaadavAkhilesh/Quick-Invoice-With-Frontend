import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (userData) => api.post('/auth/register', userData)

// Customer APIs
export const getCustomers = () => api.get('/customers')
export const createCustomer = (data) => api.post('/customers', data)
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data)
export const deleteCustomer = (id) => api.delete(`/customers/${id}`)

// Invoice APIs
export const getInvoices = () => api.get('/invoices')
export const createInvoice = (data) => api.post('/invoices', data)
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data)
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`)
export const sendInvoice = (id, email) => api.post(`/invoices/${id}/send`, { email })

// Payment APIs
export const getPayments = () => api.get('/payments')
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data)

// Template APIs
export const getTemplates = () => api.get('/templates')
export const createTemplate = (data) => api.post('/templates', data)
export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data)
export const deleteTemplate = (id) => api.delete(`/templates/${id}`)

export default api