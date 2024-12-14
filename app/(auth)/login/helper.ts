import { API_ROUTES, BASE_URL } from "@/config/routes";
import axios, { Axios, AxiosError } from "axios";

export const loginRequest = async (email: string, password: string) => {
  try {
    const localAxios = axios.create({
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await localAxios.post(BASE_URL + API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });
    
    return response.data;
 

  } catch(e) {
    let error = e as AxiosError<string>;
    
    throw new Error(error.response?.data);
  }
};
