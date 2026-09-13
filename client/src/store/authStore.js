import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('ym_user') || 'null'),
  token: localStorage.getItem('ym_token') || null,
  isLoading: false,
  error: null,

  isAuthenticated: () => !!get().token,

  async register(payload) {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('ym_token', data.token);
      localStorage.setItem('ym_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  async login(email, password) {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ym_token', data.token);
      localStorage.setItem('ym_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore network errors on logout */
    }
    localStorage.removeItem('ym_token');
    localStorage.removeItem('ym_user');
    set({ user: null, token: null });
  },

  async updateProfile(payload) {
    const { data } = await api.put('/auth/profile', payload);
    localStorage.setItem('ym_user', JSON.stringify(data.user));
    set({ user: data.user });
    return data.user;
  },

  setUser(user) {
    localStorage.setItem('ym_user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
