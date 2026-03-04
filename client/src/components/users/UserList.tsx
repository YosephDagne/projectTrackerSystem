"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Pencil, Plus, Search, X, Shield, User, MoreVertical, Terminal, Fingerprint, Database, Filter, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

import { UserData, UserFilterDto } from "@/types/user";
import { RoleData } from "@/types/role";
import { getUsers, deleteUser } from "@/services/userApi";
import { fetchAllRoles } from "@/services/roleApi";
import AddUser from "./AddUser";
import PaginationFooter from "@/components/layout/PaginationFooter";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const [filter, setFilter] = useState<UserFilterDto>({
    PageNumber: 1,
    PageSize: 10,
    SortBy: "Name",
    SortDescending: false,
  });
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilter = {
        ...filter,
        SearchTerm: searchTerm || undefined,
        Role: roleFilter || undefined,
        Source: sourceFilter || undefined,
      };

      const [usersResult, rolesResponse] = await Promise.all([
        getUsers(apiFilter),
        fetchAllRoles(),
      ]);

      const { items = [], totalCount = 0 } = usersResult || {};
      setUsers(items);
      setTotalCount(totalCount);
      setRoles(rolesResponse || []);
    } catch (error) {
      toast.error("Failed to fetch directory data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, roleFilter, sourceFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleRowsPerPageChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, PageSize: pageSize, PageNumber: 1 }));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast.success("Personnel record expunged");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete personnel record");
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Terminal size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Personnel Matrix</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white italic">OPERATIVE <span className="text-indigo-500">DIRECTORY</span></h1>
          <p className="text-gray-500 dark:text-zinc-500 text-sm font-medium">Manage registry identities and security clearance protocols.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Filter by metadata..."
              className="pl-12 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-full md:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" size={16} />
            <select
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl pl-12 pr-8 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Clearances</option>
              {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          <Button
            onClick={() => { setEditingId(undefined); setModalOpen(true); }}
            variant="primary"
            className="rounded-2xl shadow-xl shadow-indigo-600/20"
          >
            <Plus size={18} className="mr-2" /> Onboard New
          </Button>
        </div>
      </div>

      {/* Main Terminal Cluster Board */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 overflow-hidden flex flex-col transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-zinc-950/50 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-8 py-6">Unique Identity</th>
                <th className="px-8 py-6">Security Context</th>
                <th className="px-8 py-6">Origin Protocol</th>
                <th className="px-8 py-6">Lifecycle Node</th>
                <th className="px-8 py-6 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-indigo-500 mx-auto" />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing personnel matrix...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <Database className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-800" />
                      <p className="text-sm font-bold text-zinc-500">Registry null or filtered results yielded zero matches.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                            {(u.displayName || u.firstName || "?").charAt(0).toUpperCase()}
                          </div>
                          {u.isActive && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white tracking-tight text-base leading-none">
                            {u.displayName || `${u.firstName} ${u.lastName}`}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-1.5">
                            <Fingerprint size={10} className="text-indigo-500" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {u.roles?.length ? u.roles.map((r, i) => (
                          <Badge key={i} variant="indigo" dot className="border-indigo-500/10">
                            {r}
                          </Badge>
                        )) : <span className="text-zinc-300 dark:text-zinc-800 text-xs font-black">— NULL</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 w-fit">
                        <Shield size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600 dark:text-gray-400">
                          {u.source}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant={u.isActive ? "success" : "destructive"} dot>
                        {u.isActive ? "Active Cluster" : "Offline"}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button
                          onClick={() => { setEditingId(u.id); setModalOpen(true); }}
                          disabled={u.source === "Jira"}
                          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-emerald-500/20"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(u.id)}
                          disabled={u.source === "Jira"}
                          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-rose-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
          <PaginationFooter
            currentPage={filter.PageNumber ?? 1}
            rowsPerPage={filter.PageSize ?? 10}
            totalItems={totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </div>

      {/* Premium Onboarding Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/10 dark:border-zinc-800 relative">
            <div className="absolute top-0 right-0 p-8 text-indigo-500/5 rotate-12">
              <Fingerprint size={200} />
            </div>

            <div className="p-10 relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
                    {editingId ? <Pencil size={28} /> : <Plus size={28} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                      {editingId ? "Modify Metadata" : "Onboard Prototype"}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-500">
                      Synchronize security clearance and credential clusters.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="animate-fadeInUp">
                <AddUser
                  id={editingId}
                  onClose={() => setModalOpen(false)}
                  onCreate={() => { fetchData(); setModalOpen(false); }}
                  onUpdate={() => { fetchData(); setModalOpen(false); }}
                  roles={roles}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-scaleIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-white/10 dark:border-zinc-800 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner shadow-rose-500/5">
              <Trash2 size={36} />
            </div>
            <h2 className="text-2xl font-black mb-3 dark:text-white tracking-tight uppercase italic">Confirm Expunge</h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
              This identity node will be permanently removed from the terminal registry. This action is <span className="text-rose-500 font-black">irreversible</span>.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
              >
                Abort
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-600/20 transition-all active:scale-95"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;


