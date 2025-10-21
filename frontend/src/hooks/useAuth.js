import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { user, token, loading, error, login, logout, register, loadProfile } = useAuthStore();
  return { user, token, loading, error, login, logout, register, loadProfile };
};

export default useAuth;
