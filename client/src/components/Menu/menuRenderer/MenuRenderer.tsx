"use client";

import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { MenuItem } from "@/types/menuTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

interface MenuRendererProps {
  items: MenuItem[];
  isActive: (path: string | null | undefined) => boolean;
  expandedItems: Set<number>;
  onToggleExpand: (id: number) => void;
  onItemClick: (item: MenuItem) => void;
  isCollapsed?: boolean;
  level?: number;
}

const getFontAwesomeIcon = (name: string | undefined | null) => {
  if (!name) return null;
  const pascalName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const iconKey = `fa${pascalName}`;
  return (Icons as any)[iconKey] || null;
};

export const MenuRenderer = ({
  items,
  isActive,
  expandedItems,
  onToggleExpand,
  onItemClick,
  isCollapsed = false,
  level = 0,
}: MenuRendererProps) => {
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <ul className={`space-y-1.5 ${level > 0 ? "mt-1.5 ml-2 pl-4 border-l border-gray-100 dark:border-zinc-900" : ""}`}>
      {sortedItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = hasChildren && expandedItems.has(item.id);
        const active = isActive(item.url);
        const icon = getFontAwesomeIcon(item.icon?.toLowerCase());

        return (
          <li key={item.id} className="relative">
            <div className={`flex items-center group ${isCollapsed ? 'justify-center' : ''}`}>
              <div
                onClick={() => onItemClick(item)}
                className={`flex items-center flex-1 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 relative
                  ${active
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black shadow-sm"
                    : "text-gray-500 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white"
                  }
                  ${isCollapsed ? "w-12 h-12 justify-center px-0" : ""}
                `}
              >
                {/* Active Indicator Line */}
                {active && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
                )}

                <div className={`${isCollapsed ? "m-0" : "mr-3"} flex items-center justify-center w-5 min-w-[20px] transition-transform group-hover:scale-110`}>
                  {icon ? (
                    <FontAwesomeIcon icon={icon} className="text-[14px]" />
                  ) : (
                    <Circle size={level > 0 ? 6 : 14} className={level > 0 ? 'fill-current' : ''} />
                  )}
                </div>

                {!isCollapsed && (
                  <span className="text-xs uppercase tracking-widest truncate">{item.name}</span>
                )}
              </div>

              {hasChildren && !isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(item.id);
                  }}
                  className={`ml-1 w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isExpanded ? 'bg-indigo-500/10 text-indigo-500' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900'
                    }`}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
            </div>

            {hasChildren && isExpanded && item.children && !isCollapsed && (
              <div className="animate-fadeIn">
                <MenuRenderer
                  items={item.children}
                  isActive={isActive}
                  expandedItems={expandedItems}
                  onToggleExpand={onToggleExpand}
                  onItemClick={onItemClick}
                  isCollapsed={isCollapsed}
                  level={level + 1}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};


