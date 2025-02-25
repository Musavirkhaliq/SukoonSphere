import axios from "axios";
import { toast } from "react-toastify";

const customFetch = axios.create({ 
  baseURL: "/api/v1",
  withCredentials: true 
});

// Response interceptor
/**
 * Response interceptor to handle expired sessions.
 * If a 400 (Bad Request) error is received from the server, it means the session has expired.
 * In this case, we clear the user data from localStorage and force a reload of the page
 * to reset the app state.
 * Note that this interceptor catches all 400 errors from the server, not just authentication
 * errors. So, it's not the most robust solution, but it should cover most cases.
 */
customFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear user data from localStorage on authentication error
      await customFetch.delete("/auth/logout");
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      toast.error('Session expired. logging out...');
      // Force reload the page to reset app state
     setTimeout(() => {
       window.location.href = '/auth/sign-in';
     }, 1500);
    }
    return Promise.reject(error);
  }
);


export default customFetch;
