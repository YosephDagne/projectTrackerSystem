import { RoleData } from "./role";

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  source: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  accountId: string;
  avatarUrl: string;
  timeZone: string;
  location: string;
  roles: string[];
}

export interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserFilterDto {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  Source ?: string; 
  IsActive?: boolean;
  Role?: string;
  SortBy?: string;
  SortDescending?: boolean;
}

export interface UserResponse {
  success: boolean;
  data: UserData;
}

export interface UserForm {
  username: string;
  email?: string;
  password?: string;
  role: string;
}

export interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface RegisterUserResponse extends UserData {
  generatedPassword: string;
}

export type UpdateUserDto = {
  firstName: string;
  lastName: string;
  displayName: string;
  isActive: boolean;
  email: string;
  roles: string[];
  timeZone: string;
  location: string;
};



export interface AddUserProps {
  id?: string;
  onClose: () => void;
  onCreate: (data: UserForm) => void;
  onUpdate: () => void;
  roles?: RoleData[];
}


