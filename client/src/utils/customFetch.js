import axios from "axios";
import { toast } from "react-toastify";

const customFetch = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Response interceptor
customFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only handle 401 errors for authenticated requests that aren't auth-related
    if (error.response?.status === 401 &&
        localStorage.getItem("isAuthenticated") === "true" &&
        !error.config.url.includes('/auth/') &&
        // Don't show session expired for optional endpoints
        !error.config.url.includes('/articles/')) {

      // Clear user data from localStorage on authentication error
      await customFetch.delete("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      toast.error("Session expired, please log in again");

      // Force reload the page to reset app state, but only if user was on a protected page
      setTimeout(() => {
        window.location.href = "/auth/sign-in";
      }, 800);
    }
    return Promise.reject(error);
  }
);

export default customFetch;
