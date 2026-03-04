import {
  Permission,
  PermissionApiResponse,
  SinglePermissionApiResponse,
  CreatePermissionRequest,
} from "@/types/privilege";
import axios from "axios";

const PERMISSION_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000";

// Fetch all permissions
export const fetchAllPermissions = async (): Promise<Permission[]> => {
  const { data } = await axios.get<PermissionApiResponse>(
    `${PERMISSION_API_URL}/api/rbac/permissions`
  );

  if (!data.success) {
    throw new Error("Failed to fetch permissions");
  }

  return data.data;
};

// Get permission by ID
export const getPermissionById = async (id: string): Promise<Permission> => {
  const { data } = await axios.get<SinglePermissionApiResponse>(
    `${PERMISSION_API_URL}/api/rbac/permissions/${id}`
  );

  if (!data.success) {
    throw new Error("Failed to fetch permission by ID");
  }

  return data.data;
};

// Create a new permission
export const createPermission = async (
  permission: CreatePermissionRequest
): Promise<Permission> => {
  const { data } = await axios.post<SinglePermissionApiResponse>(
    `${PERMISSION_API_URL}/api/rbac/permissions`,
    permission
  );

  return data.data;
};

// Update an existing permission
export const updatePermission = async (
  id: string,
  permission: Partial<Permission>
): Promise<Permission> => {
  const { data } = await axios.put<SinglePermissionApiResponse>(
    `${PERMISSION_API_URL}/api/rbac/permissions/${id}`,
    permission
  );

  if (!data.success) {
    throw new Error("Failed to update permission");
  }

  return data.data;
};

// Delete a permission
export const deletePermission = async (id: string): Promise<void> => {
  const { data } = await axios.delete<SinglePermissionApiResponse>(
    `${PERMISSION_API_URL}/api/rbac/permissions/${id}`
  );

  if (!data.success) {
    throw new Error("Failed to delete permission");
  }
};


