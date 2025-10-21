import { create } from 'zustand';
import api from '../api/client';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  async login(credentials) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      set({ user: data.user, token: data.token, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Unable to login', loading: false });
      throw error;
    }
  },
  async register(payload) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', payload);
      set({ user: data.user, token: data.token, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Unable to register', loading: false });
      throw error;
    }
  },
  async loadProfile() {
    try {
      const { data } = await api.get('/profiles/me');
      set({ user: data });
    } catch (error) {
      console.error(error);
    }
  },
  async logout() {
    await api.post('/auth/logout');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
