import axios, { AxiosError } from "axios";
import {
  LoginRequest,
  LoginResponse,
  ChangePasswordPayload,
} from "@/types/login";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/Account/login`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Axios error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
// api/account.ts

export async function changePassword(payload: ChangePasswordPayload) {
  try {
    const response = await axios.post(
      `${API_URL}/api/Account/api/account/change-password`,
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update password.");
  }
}


