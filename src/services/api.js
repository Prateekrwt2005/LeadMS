import axios from "axios";
import useAuthStore from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Keep only one refresh request running at a time
let refreshPromise = null;

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
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/reset-password");

    // Only attempt refresh for 401 responses
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const { refreshToken, updateTokens, logout } =
      useAuthStore.getState();

    // No refresh token = session is unavailable
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      // If another request is already refreshing,
      // wait for that same refresh request.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          })
          .then((response) => {
            const {
              accessToken,
              refreshToken: newRefreshToken,
            } = response.data;

            if (!accessToken) {
              throw new Error(
                "No access token returned from refresh endpoint."
              );
            }

            // IMPORTANT:
            // Save BOTH tokens because the backend can rotate
            // the refresh token.
            updateTokens(accessToken, newRefreshToken);

            return {
              accessToken,
              refreshToken: newRefreshToken,
            };
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const { accessToken } = await refreshPromise;

      // Retry original request with new access token
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      // Refresh token is invalid/expired/rejected
      if (
        refreshError.response?.status === 401 ||
        refreshError.response?.status === 403
      ) {
        logout();
      }

      // Do not immediately logout on server errors such as 500
      return Promise.reject(refreshError);
    }
  }
);

export default api;