// Single menu response type
export interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  requiredPrivilege: string;
  parentId: number | null;
  order: number | null;
  isActive: boolean;
  parent: MenuItem | null;
  children: MenuItem[];
  content?: 'list' | 'form' | 'default';
}

export interface MenuByIdResponse {
  success: boolean;
  data: MenuItem;
}

// All menus response type
export interface MenuItemSummary {
  id: number;
  name: string;
  url: string;
  icon: string;
  order: number | null;
  parentId: number | null;
  children: MenuItemSummary[];
  requiredPermission: string;
}

export interface AllMenusResponse {
  success: boolean;
  data: MenuItemSummary[];
}
export interface UpdateMenuItemPayload {
  name: string;
  url: string;
  icon: string;
  requiredPrivilege: string;
  parentId: number | null;
  order: number | null;
}

export interface CreateMenuItem {
  name: string;
  url: string;
  icon: string;
  requiredPrivilege: string;
  parentId: number | null;
  order: number | null;
}


