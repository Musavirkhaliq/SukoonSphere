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
    if (error.response?.status === 401) {
      // Clear user data from localStorage on authentication error
      await customFetch.delete("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      toast.error("Session expired, please log in again!!!!");
      // Force reload the page to reset app state
      setTimeout(() => {
        window.location.href = "/auth/sign-in";
      }, 800);
    }
    return Promise.reject(error);
  }
);

export default customFetch;
