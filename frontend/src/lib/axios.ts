import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
let accessToken: string | null = null;

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};

export const getAccessToken = (): string | null => accessToken;

const isAuthEndpoint = (url?: string): boolean => {
  return Boolean(
    url?.includes('/auth/login') ||
      url?.includes('/auth/register') ||
      url?.includes('/auth/refresh')
  );
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);
      config.headers = headers;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const response = await refreshClient.post<{ token: string }>('/auth/refresh');
        setAccessToken(response.data.token);

        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set('Authorization', `Bearer ${response.data.token}`);
        originalRequest.headers = headers;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      return `Cannot reach the backend API at ${API_URL}. Start the backend server and try again.`;
    }

    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export default axiosInstance;
