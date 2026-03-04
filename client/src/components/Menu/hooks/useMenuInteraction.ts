'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const useMenuInteraction = () => {
  const pathname = usePathname();
  // Assuming MenuItem.id is 'number', so expandedItems should store numbers
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // FIX 1: Change 'path?: string' to 'path: string | null | undefined'
  const isActive = (path: string | null | undefined) => {
    // If path is null or undefined, it cannot be active by URL comparison
    if (!path) return false;

    // Normalize paths to remove trailing slashes for consistent comparison,
    // but preserve '/' for the root path.
    const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const normalizedItemPath = path === '/' ? '/' : path.replace(/\/$/, '');

    // Check if current pathname starts with the item's path.
    // The condition `(normalizedItemPath !== '/' || normalizedPathname === '/')`
    // prevents a root path menu item from being active for ALL sub-pages.
    // It will only be active if the current pathname IS exactly '/'.
    return normalizedPathname.startsWith(normalizedItemPath) &&
           (normalizedItemPath !== '/' || normalizedPathname === '/');
  };

  // FIX 2: Change 'id: string' to 'id: number' to match MenuItem.id
  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return { isActive, expandedItems, toggleExpand };
};


