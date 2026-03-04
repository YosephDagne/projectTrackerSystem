// src/components/Menu/MenuContainer.tsx
"use client";

import { useMenu } from "@/components/Menu/hooks/useMenu";
import { MenuRenderer } from "./MenuRenderer";
import { MenuItem } from "@/types/menuTypes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MenuList from "@/components/Menu/MenuList";

interface MenuContainerProps {
  initialData?: MenuItem[];
  isCollapsed?: boolean;
}

export const MenuContainer = ({
  initialData,
  isCollapsed = false,
}: MenuContainerProps) => {
  const router = useRouter();
  const { menuData, loading, error, isActive, expandedItems, toggleExpand } =
    useMenu(initialData);
  const [activeContent, setActiveContent] = useState<React.ReactNode>(null);
  const handleItemClick = (item: MenuItem) => {
    if (item.url && item.url !== '#') {
      router.push(item.url);
      setActiveContent(null);
      return;
    }

    
    const content = item.content ?? 'default';
    switch(content) {
      case 'list':
        setActiveContent(<MenuList />); 
        break;
      case 'form':
        setActiveContent(
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Generic Form</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This is a placeholder for a generic form. The Add/Edit menu form
              now opens in a separate modal overlay.
            </p>
          </div>
        );
        break;
      default:
        setActiveContent(
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select an item from the menu to view content
            </p>
          </div>
        );
        break;
    }
  };

  if (loading) return <LoadingSpinner className="my-8 text-green-500" />;
  if (error) return <ErrorMessage message="Failed to load menu" retry={() => window.location.reload()} />;

  return (
    <div className="flex h-full">
      {/* Navigation Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} overflow-y-auto transition-all duration-300`}>
        <MenuRenderer
          items={menuData}
          isActive={isActive}
          expandedItems={expandedItems}
          onToggleExpand={toggleExpand}
          onItemClick={handleItemClick}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        {activeContent || (
          <div className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isCollapsed ? 'Expand menu to continue' : 'Select a menu item'}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500 dark:border-white" />
  </div>
);

const ErrorMessage = ({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) => (
  <div className="text-center text-red-600 dark:text-red-400 my-4">
    <p>{message}</p>
    {retry && (
      <button
        onClick={retry}
        className="mt-2 text-sm text-blue-600 hover:underline dark:text-white"
      >
        Retry
      </button>
    )}
  </div>
);


