export interface Permission {
  id: string;
  permissionName: string;
  description?: string;
  action: string;
  createdAt?: string;
}

export interface PermissionApiResponse {
  success: boolean;
  data: Permission[];
}
export interface SinglePermissionApiResponse {
  success: boolean;
  data: Permission;
}

export interface PrivilegePayload {
  permissionName: string;
  description?: string;
  action: string;
}

export interface CreatePermissionRequest {
  permissionName: string;
  description?: string;
  action: string;
}

export interface AddPrivilegeProps {
  id?: string;
  onClose: () => void;
  onCreate?: (data: PrivilegePayload) => void;
  onUpdate?: (data: PrivilegePayload) => void;
}


