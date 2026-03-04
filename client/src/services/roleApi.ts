import axios from "axios";
import {
  RoleData,
  RoleApiResponse,
  RolePayload,
  RoleUpdatePayload,
} from "@/types/role";

const ROLE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000";

export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const response = await axios.get<RoleApiResponse>(`${ROLE_API_URL}/api/rbac/roles`);
  if (!response.data.success) throw new Error("Failed to fetch roles");
  return response.data.data ?? [];
};

export const createRole = async (payload: RolePayload): Promise<RoleData> => {
  const response = await axios.post(`${ROLE_API_URL}/api/rbac/roles`, payload);
  if (!response.data.success) throw new Error("Failed to create role");
  return response.data.data;
};

export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${ROLE_API_URL}/api/rbac/roles/${id}`);
  if (!response.data.success) throw new Error("Failed to fetch role");
  return response.data.data;
};
export const updateRole = async (
  id: string,
  data: RolePayload | RoleUpdatePayload
): Promise<RoleData> => {
  const response = await axios.put(`${ROLE_API_URL}/api/rbac/roles/${id}`, data);
  if (!response.data.success) throw new Error("Failed to update role");
  return response.data.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  const response = await axios.delete(`${ROLE_API_URL}/api/rbac/roles/${id}`);
  // Handle both success and isSuccess for consistency
  if (!response.data.success && !response.data.isSuccess) throw new Error("Failed to delete role");
};


