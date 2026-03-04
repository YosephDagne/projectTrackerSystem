"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus, Search, X, Hammer, ShieldCheck, Activity, Terminal, Database, Shield, Zap, Target } from "lucide-react";
import { Permission } from "@/types/privilege";
import { fetchAllPermissions, deletePermission } from "@/services/privilegeApi";
import AddPrivilege from "./AddPrivilege";
import PaginationFooter from "@/components/layout/PaginationFooter";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const PrivilegeList = () => {
  const [privileges, setPrivileges] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadPrivileges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllPermissions();
      setPrivileges(data);
    } catch (error) {
      toast.error("Privilege matrix sync failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrivileges();
  }, [loadPrivileges]);

  const filtered = privileges.filter(p => {
    const query = searchTerm.toLowerCase();
    return p.permissionName?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.action?.toLowerCase().includes(query);
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPrivileges = filtered.slice(startIndex, startIndex + rowsPerPage);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePermission(deleteId);
      toast.success("Privilege liquidated");
      loadPrivileges();
    } catch {
      toast.error("Operation failed");
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
            <Zap size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Hooks</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white italic">ACCESS <span className="text-indigo-500">TOKENS</span></h1>
          <p className="text-gray-500 dark:text-zinc-500 text-sm font-medium">Configure atomic-level permissions and system protocol hooks.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Query token matrix..."
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

          <Button
            onClick={() => { setEditingId(undefined); setModalOpen(true); }}
            variant="primary"
          >
            <Plus size={18} className="mr-2" /> Forge Token
          </Button>
        </div>
      </div>

      {/* Token Registry Board */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 overflow-hidden flex flex-col transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-zinc-950/50 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-8 py-6">Privilege Segment</th>
                <th className="px-8 py-6">System Protocol</th>
                <th className="px-8 py-6 text-center">Registration</th>
                <th className="px-8 py-6 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-indigo-500 mx-auto" />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing operational hooks...</p>
                  </td>
                </tr>
              ) : paginatedPrivileges.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <Database className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-800" />
                      <p className="text-sm font-bold text-zinc-500">Privilege registry empty or filters yielded no results.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPrivileges.map((p) => (
                  <tr key={p.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10">
                          <ShieldCheck size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-gray-900 dark:text-white tracking-tight uppercase text-sm">
                            {p.permissionName}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 line-clamp-1 max-w-sm italic">
                            {p.description || "Operational parameters not defined for this node."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="indigo" dot className="px-4 py-1.5 border-indigo-500/10 bg-indigo-500/5 shadow-inner">
                        {p.action}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-zinc-400">
                        <Activity size={12} className="text-indigo-500/50 rotate-90" />
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'INITIAL'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button
                          onClick={() => { setEditingId(p.id); setModalOpen(true); }}
                          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-500/20"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
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
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Premium Token Forge Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/10 dark:border-zinc-800 relative">
            <div className="absolute top-0 right-0 p-10 text-indigo-500/5 rotate-12 transition-transform hover:scale-110">
              <Target size={200} />
            </div>

            <div className="relative z-10 p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
                    {editingId ? <Pencil size={24} /> : <Hammer size={24} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                      {editingId ? "Modify Protocol" : "Forge Privilege"}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-500">
                      Synchronize system hooks with operational capabilities.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setModalOpen(false); setEditingId(undefined); }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="animate-fadeInUp">
                <AddPrivilege
                  id={editingId}
                  onClose={() => { setModalOpen(false); setEditingId(undefined); }}
                  onCreate={() => { loadPrivileges(); setModalOpen(false); }}
                  onUpdate={() => { loadPrivileges(); setModalOpen(false); }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Privilege Liquidate */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-scaleIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-white/10 dark:border-zinc-800 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner">
              <Shield size={36} className="text-rose-500" />
            </div>
            <h2 className="text-2xl font-black mb-3 dark:text-white tracking-tight uppercase italic">Liquidate Hook</h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
              De-registering this access node will immediately invalidate all security clusters that depend on it. System integrity may be affected.
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

export default PrivilegeList;


