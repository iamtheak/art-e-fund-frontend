import { API_ROUTES, BASE_URL } from "@/config/routes";
import axios, { AxiosError } from "axios";
import { TRegisterFormProps } from "./types";

export const registerRequest = async (data: TRegisterFormProps) => {
  try {
    const localAxios = axios.create({
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await localAxios.post(BASE_URL + API_ROUTES.AUTH.REGISTER, data);
    
    return response.data;

  } catch (e) {
    let error = e as AxiosError<string>;
    
    throw new Error(error.response?.data || 'Registration failed');
  }
};