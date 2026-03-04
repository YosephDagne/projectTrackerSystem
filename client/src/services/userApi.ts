import axios from "axios";
import {
  UserData,
  CreateUserDto,
  UpdateUserDto,
  RegisterUserResponse,
  UserFilterDto,
  PagedList,
  UserResponse,
} from "@/types/user";

interface WrappedResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000";

export const getUsers = async (
  filter: UserFilterDto
): Promise<PagedList<UserData>> => {
  try {
    const response = await axios.get<WrappedResponse<UserData[]>>(`${API_BASE}/api/users`, {
      params: filter,
    });

    const usersArray = response.data.success ? response.data.data : [];

    const pageNumber = filter.PageNumber ?? 1;
    const pageSize = filter.PageSize ?? usersArray.length;

    return {
      items: usersArray,
      totalCount: usersArray.length,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(usersArray.length / pageSize),
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber * pageSize < usersArray.length,
    };
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return {
      items: [],
      totalCount: 0,
      pageNumber: filter.PageNumber ?? 1,
      pageSize: filter.PageSize ?? 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
};

export const fetchUserById = async (id: string): Promise<UserData> => {
  try {
    const response = await axios.get<WrappedResponse<UserData>>(`${API_BASE}/api/users/${id}`);
    if (!response.data.success) throw new Error(response.data.message || "Failed to fetch user");
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const registerUser = async (
  userData: CreateUserDto
): Promise<RegisterUserResponse> => {
  try {
    const response = await axios.post<WrappedResponse<RegisterUserResponse>>(
      `${API_BASE}/api/users/local`,
      userData
    );
    if (!response.data.success) throw new Error(response.data.message || "Failed to register user");
    return response.data.data;
  } catch (error) {
    console.error("❌ Error registering user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: UpdateUserDto
): Promise<UserData | null> => {
  try {
    const response = await axios.put<WrappedResponse<UserData>>(`${API_BASE}/api/users/${id}`, userData);
    if (!response.data.success) throw new Error(response.data.message || "Failed to update user");
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.delete<WrappedResponse<any>>(`${API_BASE}/api/users/${id}`);
    return response.data.success;
  } catch (error) {
    console.error(`❌ Error deleting user with ID ${id}:`, error);
    throw error;
  }
};


