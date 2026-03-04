import axios from "axios";
import {
  MenuItem,
  MenuByIdResponse,
  MenuItemSummary,
  AllMenusResponse,
  CreateMenuItem,
  UpdateMenuItemPayload,
} from "@/types/menuTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000";

/* Fetch all menu items */
export const fetchAllMenus = async (): Promise<MenuItemSummary[]> => {
  try {
    const response = await axios.get<AllMenusResponse>(
      `${API_BASE_URL}/api/menus/all`
    );
    const data = response.data.data;

    return Array.isArray(data) ? data : [data];
  } catch (error) {
    handleApiError(error, "fetch menus");
  }
};

/* Fetch a single menu item by ID */
export const fetchMenuById = async (id: number): Promise<MenuItem> => {
  try {
    const response = await axios.get<MenuByIdResponse>(
      `${API_BASE_URL}/api/menus/${id}`
    );
    const raw = response.data.data;

    return {
      ...raw,
      url: raw.url ?? "",
      icon: raw.icon ?? "",
      requiredPrivilege: raw.requiredPrivilege ?? "",
      order: raw.order ?? 0,
      parentId: raw.parentId,
      children: raw.children ?? [],
      parent: raw.parent ?? null,
      isActive: raw.isActive,
    };
  } catch (error) {
    handleApiError(error, `fetch menu item ${id}`);
  }
};

/* Create a new menu item */
export const createMenuItem = async (menu: CreateMenuItem): Promise<void> => {
  try {
    const payload = {
      name: menu.name,
      url: menu.url || null,
      icon: menu.icon || null,
      requiredPrivilege: menu.requiredPrivilege || null,
      parentId: menu.parentId ?? null,
      order: menu.order ?? 0,
    };

    await axios.post(`${API_BASE_URL}/api/menus`, payload);
  } catch (error) {
    handleApiError(error, "create menu");
  }
};

/* Update an existing menu item */
export const updateMenuItem = async (
  id: number,
  menu: UpdateMenuItemPayload
): Promise<void> => {
  try {
    const payload = {
      name: menu.name || null,
      url: menu.url || null,
      icon: menu.icon || null,
      requiredPrivilege: menu.requiredPrivilege || null,
      parentId: menu.parentId ?? null,
      order: menu.order ?? null,
    };

    await axios.put(`${API_BASE_URL}/api/menus/${id}`, payload);
  } catch (error) {
    handleApiError(error, `update menu ${id}`);
  }
};

/* Delete a menu item */
export const deleteMenuItem = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/menus/${id}`);
  } catch (error) {
    handleApiError(error, `delete menu ${id}`);
  }
};

/* Error handler */
function handleApiError(error: unknown, action: string): never {
  console.error(`Error during ${action}:`, error);
  throw new Error(
    axios.isAxiosError(error)
      ? error.response?.data?.message || `Failed to ${action}.`
      : `Failed to ${action}. An unexpected error occurred.`
  );
}


