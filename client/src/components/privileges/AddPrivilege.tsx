"use client";

import React, { useState, useEffect } from "react";
import { PrivilegePayload, AddPrivilegeProps } from "@/types/privilege";
import {
  createPermission,
  updatePermission,
  getPermissionById,
} from "@/services/privilegeApi";
import { toast } from "react-toastify";
import { Loader2, X, ShieldCheck, FileText, Zap, Hammer } from "lucide-react";

const AddPrivilege: React.FC<AddPrivilegeProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<PrivilegePayload>({
    permissionName: "",
    description: "",
    action: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (id) {
      setFetching(true);
      getPermissionById(id)
        .then((data) => {
          setFormData({
            permissionName: data.permissionName || "",
            description: data.description || "",
            action: data.action || "",
          });
        })
        .catch(() => {
          toast.error("Privilege retrieval failed");
        })
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        const updated = await updatePermission(id, formData);
        toast.success("Privilege recalibrated");
        onUpdate?.(updated);
      } else {
        const created = await createPermission(formData);
        toast.success("Privilege forged");
        onCreate?.(created);
      }
      onClose();
    } catch {
      toast.error("Protocol failure");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Hooks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Privilege Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hook Identifier</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              name="permissionName"
              type="text"
              value={formData.permissionName}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="e.g. DATA_EXPORT_SERVICE"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white font-bold"
            />
          </div>
        </div>

        {/* Action */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Operation Category</label>
          <div className="relative">
            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              name="action"
              type="text"
              value={formData.action}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. EXECUTE, WRITE, BROADCAST"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Functional Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              placeholder="Define the granular impact of this hook..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            />
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
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : id ? "Recalibrate Hook" : "Forge Hook"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrivilege;


