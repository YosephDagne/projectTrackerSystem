"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { fetchRoleById, createRole, updateRole } from "@/services/roleApi";
import { fetchAllPermissions } from "@/services/privilegeApi";
import {
  RoleData,
  RolePayload,
  CreateRoleProps,
  RoleUpdatePayload,
} from "@/types/role";
import { Permission } from "@/types/privilege";
import { Loader2, Search, X, ShieldAlert, FileText, Check, ChevronDown } from "lucide-react";


const CreateRole: React.FC<CreateRoleProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEdit = Boolean(id);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const data = await fetchAllPermissions();
        setPermissions(data as Permission[]);
      } catch {
        toast.error("Privilege sync failure");
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
  }, []);

  useEffect(() => {
    if (isEdit && id && permissions.length) {
      loadRole(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id, permissions]);

  const loadRole = async (roleId: string) => {
    setLoading(true);
    try {
      const role: RoleData = await fetchRoleById(roleId);
      setRoleName(role.name);
      setDescription(role.description || "");
      const permIds = Array.isArray(role.permissions)
        ? (role.permissions
          .map((permName: string) => {
            const found = permissions.find(
              (p) => p.permissionName === permName
            );
            return found?.id;
          })
          .filter(Boolean) as string[])
        : [];
      setSelectedPermissions(permIds);
    } catch {
      toast.error("Profile retrieval error");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return toast.error("Profile name is mandatory");
    if (selectedPermissions.length === 0)
      return toast.error("Assign at least one operational hook");

    setSubmitting(true);
    try {
      if (isEdit && id) {
        const updatePayload: RoleUpdatePayload = {
          name: roleName.trim(),
          description: description.trim(),
          permissionsToAdd: selectedPermissions,
        };
        await updateRole(id, updatePayload);
        toast.success("Security profile updated");
        await onUpdate?.(updatePayload);
      } else {
        const createPayload: RolePayload = {
          name: roleName.trim(),
          description: description.trim(),
          permissionIds: selectedPermissions,
        };
        await createRole(createPayload);
        toast.success("Security profile forged");
        await onCreate?.(createPayload);
      }
      onClose();
    } catch {
      toast.error("Protocol persistence failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPermissions = permissions.filter((perm) =>
    perm.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 dark:border-zinc-800 transition-all p-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {isEdit ? "Modify Profile" : "Forge Profile"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Define scope and operational permissions.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Profile...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Role Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Profile Designation</label>
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. System Architect"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Operational Scope</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Define administrative boundaries..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Permissions Dropdown */}
          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hook Assignments</label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm text-left flex items-center justify-between group transition-all"
            >
              <div className="overflow-hidden flex items-center gap-2">
                <span className={selectedPermissions.length ? "text-gray-900 dark:text-white font-bold truncate" : "text-gray-400"}>
                  {selectedPermissions.length
                    ? permissions
                      .filter((perm) => selectedPermissions.includes(perm.id))
                      .map((perm) => perm.permissionName)
                      .join(", ")
                    : "Select operational hooks..."}
                </span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden animate-fadeIn">
                <div className="p-3 border-b border-gray-50 dark:border-zinc-800">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filter hooks..."
                      className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((perm) => (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => togglePermission(perm.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedPermissions.includes(perm.id) ? 'bg-indigo-500/10 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                          }`}
                      >
                        {perm.permissionName}
                        {selectedPermissions.includes(perm.id) && <Check size={14} />}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-400 italic">No matching hooks discovered.</div>
                  )}
                </div>
              </div>
            )}
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
              disabled={submitting}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : isEdit ? "Sync Profile" : "Forge Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateRole;


