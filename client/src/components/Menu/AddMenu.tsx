"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, X, Layout, Globe, Lock, ListOrdered, Share2, Type } from "lucide-react";
import {
  fetchAllMenus,
  fetchMenuById,
  updateMenuItem,
  createMenuItem,
} from "@/services/menuApi";

interface AddMenuProps {
  id: number;
  onClose: () => void;
  onCreate: () => void;
  onUpdate: () => void;
}

interface MenuFormData {
  name: string;
  url: string;
  icon: string;
  requiredPrivilege: string;
  parentId: number | null;
  order: number | null;
}

const AddMenu: React.FC<AddMenuProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEditing = id !== 0;

  const emptyFormData: MenuFormData = {
    name: "",
    url: "",
    icon: "",
    requiredPrivilege: "",
    parentId: null,
    order: null,
  };

  const [formData, setFormData] = useState<MenuFormData>(emptyFormData);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOptions, setMenuOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const loadData = async () => {
      setLoadingInitialData(true);
      try {
        const allMenus = await fetchAllMenus();
        setMenuOptions(allMenus);

        if (isEditing) {
          const menu = await fetchMenuById(id);
          setFormData({
            name: menu.name || "",
            url: menu.url || "",
            icon: menu.icon || "",
            requiredPrivilege: menu.requiredPrivilege || "",
            parentId: typeof menu.parentId === "number" ? menu.parentId : null,
            order: typeof menu.order === "number" ? menu.order : null,
          });
        }
      } catch {
        toast.error("Data load failure");
        onClose();
      } finally {
        setLoadingInitialData(false);
      }
    };

    loadData();
  }, [id, isEditing, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "parentId" || name === "order"
        ? value === ""
          ? null
          : parseInt(value, 10)
        : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateMenuItem(id, formData);
        toast.success("Node reconfigured");
        onUpdate();
      } else {
        await createMenuItem(formData);
        toast.success("Node anchored");
        onCreate();
      }
      onClose();
    } catch {
      toast.error("Protocol persistence failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitialData) return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Archiving Matrix...</p>
    </div>
  );

  return (
    <div className="animate-fadeIn text-left">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Node Designation</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Analytics Hub"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Icon */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visual Hook (Lucide)</label>
            <div className="relative">
              <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. bar-chart-2"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Routing Path</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="url"
                type="text"
                value={formData.url}
                onChange={handleChange}
                placeholder="/dashboard/analytics"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Privilege */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Logic</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="requiredPrivilege"
                type="text"
                value={formData.requiredPrivilege}
                onChange={handleChange}
                placeholder="DATA_ANALYTICS"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Order */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sequence Priority</label>
            <div className="relative">
              <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="order"
                type="number"
                value={formData.order === null ? "" : formData.order}
                onChange={handleChange}
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Parent */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Parent Hierarchy</label>
            <div className="relative">
              <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="parentId"
                value={formData.parentId === null ? "" : formData.parentId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white appearance-none"
              >
                <option value="">Root Hierarchy</option>
                {menuOptions.filter(m => m.id !== id).map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-white rounded-2xl font-bold transition-all"
          >
            Abort
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : isEditing ? "Sync Node" : "Anchor Node"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenu;


