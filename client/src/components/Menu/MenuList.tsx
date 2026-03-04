"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus, Search, X, Layout, Lock, ListOrdered, Share2 } from "lucide-react";
import { MenuItemSummary } from "@/types/menuTypes";
import { deleteMenuItem, fetchAllMenus } from "@/services/menuApi";
import PaginationFooter from "@/components/layout/PaginationFooter";
import AddMenu from "./AddMenu";

const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<MenuItemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [menuIdToDelete, setMenuIdToDelete] = useState<number | null>(null);

  const loadMenus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllMenus();
      setMenus(data);
    } catch (error) {
      toast.error("Navigation matrix sync failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const filtered = menus.filter((menu) => {
    const query = searchTerm.toLowerCase();
    const parentName = menu.parentId ? (menus.find(m => m.id === menu.parentId)?.name || "") : "None";
    return [menu.name, menu.requiredPermission, parentName]
      .filter(Boolean)
      .some((val) => val?.toLowerCase().includes(query));
  });

  const handleEdit = (id: number) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    await loadMenus();
    setModalOpen(false);
    setEditingId(undefined);
  };

  const handleDeleteConfirmed = async () => {
    if (menuIdToDelete === null) return;
    setConfirmDialogOpen(false);
    setDeletingId(menuIdToDelete);

    try {
      await deleteMenuItem(menuIdToDelete);
      toast.success("Navigation node expunged");
      await loadMenus();
    } catch (error) {
      toast.error("Failed to expunge navigation node");
    } finally {
      setDeletingId(null);
      setMenuIdToDelete(null);
    }
  };

  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return null;
    const parent = menus.find((m) => m.id === parentId);
    return parent?.name || "Unknown Meta-Node";
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMenus = filtered.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Interface Mapping</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 italic">Architect application vertical navigation and structural hierarchy.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Query hierarchy..."
              className="pl-10 pr-10 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => { setEditingId(undefined); setModalOpen(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Node
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-950/50 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                <th className="px-6 py-4">Structural Node</th>
                <th className="px-6 py-4">Access Logic</th>
                <th className="px-6 py-4">Sequence</th>
                <th className="px-6 py-4">Parent Hierarchy</th>
                <th className="px-6 py-4 text-right">Node Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedMenus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">
                    Navigation matrix is currently unpopulated.
                  </td>
                </tr>
              ) : (
                paginatedMenus.map((menu) => (
                  <tr key={menu.id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:rotate-12 transition-transform">
                          <Layout size={18} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{menu.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Lock size={12} className="text-gray-400" />
                        <span className={`${menu.requiredPermission ? 'text-emerald-500 font-bold' : 'text-gray-400 italic'} text-xs`}>
                          {menu.requiredPermission || "Public Core"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                        <ListOrdered size={14} className="text-indigo-500/50" />
                        {menu.order ?? "Dynamic"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {menu.parentId ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400">
                          <Share2 size={12} className="text-indigo-500" />
                          {getParentName(menu.parentId)}
                        </div>
                      ) : <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-zinc-700">Root Level</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(menu.id)}
                          disabled={deletingId === menu.id}
                          className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => { setMenuIdToDelete(menu.id); setConfirmDialogOpen(true); }}
                          disabled={deletingId === menu.id}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          {deletingId === menu.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30">
          <PaginationFooter
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
          />
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 dark:border-zinc-800">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      {editingId ? "Reconfigure Node" : "Anchor New Node"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">
                      Adjust vertical positioning and access credentials.
                    </p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <AddMenu id={editingId ?? 0} onClose={() => setModalOpen(false)} onCreate={handleSubmit} onUpdate={handleSubmit} />
            </div>
          </div>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-scaleIn">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-zinc-800 text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-black mb-2 dark:text-white">Expunge Node</h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed text-sm">
              Terminating this navigation node will impact child inheritance and UI accessibility. Proceed?
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setConfirmDialogOpen(false); setMenuIdToDelete(null); }} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-white rounded-2xl font-bold transition-all">
                Abort
              </button>
              <button onClick={handleDeleteConfirmed} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 transition-all">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;


