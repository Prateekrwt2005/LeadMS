import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token");

    // Do not refresh authentication requests
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const {
      refreshToken,
      updateAccessToken,
      logout,
    } = useAuthStore.getState();

    // No refresh token means the session is actually unavailable
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {
          refreshToken,
        }
      );

      const { accessToken } = response.data;

      if (!accessToken) {
        throw new Error("No access token returned from refresh endpoint.");
      }

      updateAccessToken(accessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      // Retry the original request
      return api(originalRequest);

    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      // Only logout when the refresh token is actually invalid/expired.
      if (
        refreshError.response?.status === 401 ||
        refreshError.response?.status === 403
      ) {
        logout();
      }

      // For server errors such as 500, don't immediately logout.
      return Promise.reject(refreshError);
    }
  }
);

export default api;