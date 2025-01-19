import { auth, signOut } from "@/auth";
import { TRefreshResponse } from "@/global/types";
import axios from "axios";
import { API_ROUTES, BASE_URL } from "./routes";

let isRefreshing = false;
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
});

const session = await auth();

export const GetRefreshToken = async () => {
  try {
    const localAxios = axios.create({});

    const response = await localAxios.post<TRefreshResponse>(
      BASE_URL + API_ROUTES.AUTH.REFRESH,
      { refreshToken: session?.user?.refreshToken }
    );

    const data = response.data;

    isRefreshing = false;

    return data;
  } catch {
    isRefreshing = false;
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = session?.user?.accessToken ?? "";

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;

      try {
        const newToken = (await GetRefreshToken()) ?? "";

        if (!newToken) {
          await signOut({ redirectTo: "/login" });
          return Promise.reject(error);
        }

        if (session) {
          session.user.accessToken = newToken.accessToken;
          session.user.refreshToken = newToken.refreshToken;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        // Handle token refresh failure (e.g., redirect to login)
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
