import axios from 'axios';
import { useGlobalStore } from '../global/store'; 
import { API_ROUTES, BASE_URL } from './routes';
import { TRefreshResponse } from '@/global/types';



let isRefreshing = false;
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
});


export const GetRefreshToken = async () => {

    try {
        const localAxios = axios.create({
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })

        const response = await localAxios.post<TRefreshResponse>(BASE_URL + API_ROUTES.AUTH.REFRESH)

        const data = response.data

        isRefreshing = false

        return data.accessToken ?? ""
    } catch {
        // Removes the current token and user details

        useGlobalStore.getState().setToken("")

    }

    isRefreshing = false

}


axiosInstance.interceptors.request.use(
  async (config) => {
    const { token } = useGlobalStore.getState();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

    if (error.response.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;

      try {
        const newToken = await GetRefreshToken() ?? "";

        useGlobalStore.getState().setToken(newToken); // Update the token in the store
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        // Handle token refresh failure (e.g., redirect to login)
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;