// components/Menu/hooks/useMenu.ts
'use client';
import { useMenuData } from './useMenuData';
import { useMenuInteraction } from './useMenuInteraction';
import { MenuItem } from '@/types/menuTypes';
export const useMenu = (initialData?: MenuItem[]) => {
  const { menuData, loading, error } = useMenuData(initialData);
  const { isActive, expandedItems, toggleExpand } = useMenuInteraction();

 // console.log('useMenu state:', { menuData, loading, error });

  return {
    menuData,
    loading,
    error,
    isActive,
    expandedItems,
    toggleExpand
  };
};


