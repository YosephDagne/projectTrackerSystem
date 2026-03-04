import { UserData } from "./user";
export interface FormState {
  email: string;
  password: string;
}

// Payload for login requests
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  userId: string;
  requiresPasswordChange: any;
  message: string;
  token: string;
}
export interface ChangePasswordPayload {
  userId: string;
  email?: string;
  currentPassword?: string;
  newPassword: string;
  confirmNewPassword: string;
  isFirstLoginChange: boolean;
}


