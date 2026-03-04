"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Edit2, Loader2, Plus, X, Search, ShieldAlert, Key, MoreHorizontal, Terminal, Shield, Workflow, Archive, Zap } from "lucide-react";
import { RoleData } from "@/types/role";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/services/roleApi";
import CreateRole from "./CreateRole";
import PaginationFooter from "@/components/layout/PaginationFooter";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const RoleList = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Security module synch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = useCallback(() => {
    if (!searchQuery) return roles;
    const query = searchQuery.toLowerCase();
    return roles.filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query))
    );
  }, [roles, searchQuery]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRole(deleteId);
      toast.success("Security profile liquidated");
      loadRoles();
    } catch (error) {
      toast.error("Liquidation protocol failed");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = filteredRoles();
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRoles = filtered.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Shield size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Clearance Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white italic">SECURITY <span className="text-indigo-500">PROFILES</span></h1>
          <p className="text-gray-500 dark:text-zinc-500 text-sm font-medium">Configure administrative boundaries and high-level node access protocols.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search profiles..."
              className="pl-12 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-full md:w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
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
            <Plus size={18} className="mr-2" /> Define Profile
          </Button>
        </div>
      </div>

      {/* Grid Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-500 mx-auto" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Intercepting security layers...</p>
          </div>
        ) : paginatedRoles.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
            <Archive size={48} className="mx-auto text-zinc-300 dark:text-zinc-800 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Zero security profiles detected in sector.</p>
          </div>
        ) : (
          paginatedRoles.map((role) => (
            <div key={role.roleId} className="group relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              {/* Geometric bg pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shadow-inner group-hover:scale-110 transition-transform">
                    <ShieldAlert size={28} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      onClick={() => { setEditingId(role.roleId); setModalOpen(true); }}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-zinc-800 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteId(role.roleId)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight uppercase italic">{role.name}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-500 line-clamp-2 mb-8 leading-relaxed">
                  {role.description || "No tactical description initialized for this specific profile cluster."}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key size={12} className="text-indigo-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Permissions</span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-500">{role.permissions?.length || 0} TOTAL</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(role.permissions || []).slice(0, 3).map((p, i) => (
                      <Badge key={i} variant="indigo" dot>
                        {p}
                      </Badge>
                    ))}
                    {(role.permissions?.length || 0) > 3 && (
                      <div className="px-2 py-1 rounded-lg bg-zinc-950/10 dark:bg-zinc-950/40 text-[9px] font-black text-zinc-500 border border-transparent">
                        +{role.permissions!.length - 3} MORE
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Workflow size={12} className="text-zinc-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      SYNCH: {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'INITIAL'}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Nav */}
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
        <PaginationFooter
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalItems={filtered.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      {/* Profile Engineering Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/10 dark:border-zinc-800 relative">
            <div className="absolute top-0 right-0 p-10 text-indigo-500/5 rotate-12 transition-transform hover:scale-110">
              <ShieldAlert size={200} />
            </div>

            <div className="relative z-10 p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                    {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                      {editingId ? "Re-engineer Profile" : "Define Prototype"}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-500">
                      Map administrative nodes and lifecycle permissions.
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
                <CreateRole
                  id={editingId}
                  onClose={() => { setModalOpen(false); setEditingId(undefined); }}
                  onUpdate={() => { loadRoles(); setModalOpen(false); }}
                  onCreate={() => { loadRoles(); setModalOpen(false); }}
                  success={false}
                  data={[]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Profile Termination */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-scaleIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-white/10 dark:border-zinc-800 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner">
              <ShieldAlert size={36} />
            </div>
            <h2 className="text-2xl font-black mb-3 dark:text-white tracking-tight uppercase italic">Confirm Deletion</h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
              This profile cluster will be liquidated from the security matrix. Associated operatives may lose access immediately.
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

export default RoleList;


