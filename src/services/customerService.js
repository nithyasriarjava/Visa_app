import api from './api';

export const getAllCustomers = () => api.get('/customers');

export const getCustomerByEmail = (email) =>
  api.get(`/h1b_customer/by_login_email/${email}`, { timeout: 10000 });

export const createCustomer = (data) =>
  api.post('/h1b_customer/create', data, { timeout: 30000 });

export const updateCustomer = (id, data) =>
  api.put(`/update_customer_by_id/${id}`, data, { timeout: 30000 });

export const softDeleteCustomer = (id) =>
  api.patch(`/soft_delete_customer_via_id/${id}`, {});

export const sendReminder = (userId, type) =>
  api.post('/send-reminder', { userId, type });
