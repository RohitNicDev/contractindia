// src/services/api.js

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.BASE_URL;

if (!API_URL) {
  console.warn(
    "VITE_API_URL is not set. Add it to a root .env.development or .env.production file."
  );
}

console.log("API Base URL:", API_URL);
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: "text/plain",
    "Content-Type": "application/json",
  },
});

// ======================================
// Refresh Token Variables
// ======================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// ======================================
// Request Interceptor
// ======================================

api.interceptors.request.use(
  (config) => {
    // Network Check
    if (!navigator.onLine) {
      return Promise.reject(
        new Error("No internet connection")
      );
    }

    // Start Time
    config.metadata = {
      startTime: new Date(),
    };

    // Access Token
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant
    const tenantId = localStorage.getItem("tenantId");

    if (tenantId) {
      config.headers["X-Tenant-Id"] = tenantId;
    }

    // Language
    config.headers["Accept-Language"] =
      localStorage.getItem("language") || "en";

    // Timezone
    config.headers["X-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Request ID
    config.headers["X-Request-Id"] =
      crypto.randomUUID();

    console.group(
      `🚀 ${config.method?.toUpperCase()} ${config.url}`
    );

    console.log("Request:", config);

    console.groupEnd();

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================
// Response Interceptor
// ======================================

api.interceptors.response.use(
  (response) => {
    const duration =
      new Date() -
      response.config.metadata.startTime;

    console.group(
      `✅ ${response.config.url}`
    );

    console.log("Duration:", duration, "ms");
    console.log("Response:", response);

    console.groupEnd();

    // Normalize Response
    return response.data;
  },

  async (error) => {
    const originalRequest = error.config;

    // ======================================
    // Refresh Token Flow
    // ======================================

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(
          (resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          }
        )
          .then((token) => {
            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return api(originalRequest);
          })
          .catch((err) =>
            Promise.reject(err)
          );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const newToken =
          response.data.accessToken;

        localStorage.setItem(
          "accessToken",
          newToken
        );

        api.defaults.headers.common.Authorization =
          `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.clear();

        // window.location.href = "/login";

        return Promise.reject(
          refreshError
        );
      } finally {
        isRefreshing = false;
      }
    }

    // ======================================
    // Global Error Handling
    // ======================================

    switch (error.response?.status) {
      case 400:
        console.error("Bad Request");
        break;

      case 403:
        console.error("Forbidden");

        // window.location.href =
        //   "/forbidden";

        break;

      case 404:
        console.error("Not Found");
        break;

      case 500:
        console.error(
          "Internal Server Error"
        );
        break;

      case 503:
        // window.location.href =
        //   "/maintenance";
        break;

      default:
        console.error(
          error.response?.data?.message ||
          error.message
        );
    }

    return Promise.reject({
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message,
      errors:
        error.response?.data?.errors ||
        [],
    });
  }
);

export default api;