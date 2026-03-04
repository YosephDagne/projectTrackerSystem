"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  FolderKanban,
  CircleSlash,
  ArrowUpDown,
  ExternalLink,
  Edit2,
  Terminal,
  Cpu,
  ShieldCheck,
  Activity,
  Plus,
  ArrowRight,
  Loader2
} from "lucide-react";
import { fetchProjects, ProjectDto, ProjectFilterDto } from "@/services/Jira";
import PaginationFooter from "@/components/layout/PaginationFooter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const Progress = ({ completed, total, variant = "indigo" }: { completed: number; total: number; variant?: string }) => {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
        <span>{percent}% SATURATION</span>
        <span className="text-zinc-500">{completed} / {total} NODES</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden shadow-inner">
        <div
          className={`bg-indigo-500 h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_10px_rgba(99,102,241,0.2)]`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const ProjectTable = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectFilterDto>({
    pageNumber: 1,
    pageSize: 10,
    SortBy: 'Name',
    SortDescending: false,
  });
  const [totalCount, setTotalCount] = useState(0);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilter = {
        ...filter,
        SearchTerm: searchTerm || undefined
      };
      const { items, totalCount } = await fetchProjects(apiFilter);
      setProjects(items);
      setTotalCount(totalCount);
    } catch (err) {
      setError("Failed to load clusters.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handlePageChange = useCallback((page: number) => {
    setFilter(prev => ({ ...prev, pageNumber: page }));
  }, []);

  const handleRowsPerPageChange = useCallback((pageSize: number) => {
    setFilter(prev => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  const toggleSort = (column: string) => {
    setFilter(prev => ({
      ...prev,
      SortBy: column,
      SortDescending: prev.SortBy === column ? !prev.SortDescending : false,
      pageNumber: 1
    }));
  };

  const getHealthColor = (level: string) => {
    switch (level) {
      case 'Good': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
      case 'Fair': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'Poor': return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
      case 'Critical': return 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.6)]';
      default: return 'bg-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.5)]';
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn font-inter">
      {/* Premium Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-500 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl shadow-inner">
              <Terminal size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Project Infrastructure</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white italic leading-tight">CLUSTERS <span className="text-indigo-500">REGISTRY</span></h1>
          <p className="text-gray-500 dark:text-zinc-500 text-sm font-medium pr-10">Synchronizing high-level project nodes and operational health metrics across terminal sectors.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Query cluster identity..."
              className="pl-12 pr-10 py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-full md:w-80 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            onClick={() => router.push("/dashboard/projects/new")}
            variant="primary"
            className="px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20"
          >
            <Plus size={18} className="mr-2" /> Initialize Cluster
          </Button>
        </div>
      </div>

      {/* Cluster Table Board */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[3rem] shadow-2xl shadow-indigo-500/5 overflow-hidden flex flex-col transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                <th
                  className="px-10 py-8 cursor-pointer hover:text-indigo-500 transition-colors"
                  onClick={() => toggleSort('Name')}
                >
                  <div className="flex items-center gap-3">
                    Cluster Identity {filter.SortBy === 'Name' && <ArrowUpDown size={12} className={filter.SortDescending ? 'rotate-180' : ''} />}
                  </div>
                </th>
                <th className="px-8 py-8">Lead / Principal</th>
                <th className="px-8 py-8">Operational State</th>
                <th className="px-8 py-8 text-center">Integrity</th>
                <th className="px-8 py-8">Saturation Profile</th>
                <th className="px-10 py-8 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-40 text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Scanning cluster frequencies...</p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-40 text-center">
                    <div className="max-w-xs mx-auto space-y-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mx-auto shadow-inner">
                        <CircleSlash className="h-10 w-10 text-zinc-300 dark:text-zinc-800" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Registry null or filtered clusters yielded zero results.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.Id}
                    className="group hover:bg-indigo-50/10 dark:hover:bg-indigo-500/5 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/dashboard/overview/${project.Id}`)}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-all duration-500 shadow-inner">
                          <span className="text-[8px] font-black mb-0.5 opacity-50 uppercase">Node</span>
                          <span className="text-base font-black tracking-tighter">{project.Key}</span>
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white tracking-tight text-lg leading-none group-hover:text-indigo-500 transition-colors italic uppercase">
                            {project.Name}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3 flex items-center gap-2 leading-none">
                            <Activity size={12} className="text-indigo-500" />
                            Horizon: {project.TargetEndDate ? new Date(project.TargetEndDate).toLocaleDateString() : 'INITIALIZING'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="space-y-2">
                        <p className="text-sm font-black text-gray-800 dark:text-zinc-200 italic uppercase">{project.Lead}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2 opacity-70">
                          <Cpu size={12} className="text-indigo-500" />
                          {project.ProjectOwner?.Name || 'IDENT-PENDING'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <Badge variant={project.Status === "Active" ? "success" : project.Status === "Completed" ? "indigo" : "warning"} dot className="uppercase tracking-[0.2em] font-black py-1.5 px-4 rounded-xl">
                        {project.Status || "Operational"}
                      </Badge>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex justify-center">
                        <div className={`w-4 h-4 rounded-full relative transition-all duration-500 group-hover:scale-125 ${getHealthColor(project.Health.Level)} border-2 border-white dark:border-zinc-900`}
                          title={`${project.Health.Level}: ${project.Health.Reason}`}
                        >
                          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 min-w-[280px]">
                      <Progress completed={project.Progress.CompletedTasks} total={project.Progress.TotalTasks} />
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/overview/${project.Id}`) }}
                          className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-indigo-500 bg-white dark:bg-zinc-800 hover:bg-indigo-500/10 rounded-2xl transition-all border border-gray-100 dark:border-zinc-800 hover:border-indigo-500/30 shadow-sm"
                          title="Synch Detailed Matrix"
                        >
                          <ArrowRight size={20} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/projects/edit/${project.Id}`) }}
                          className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-emerald-500 bg-white dark:bg-zinc-800 hover:bg-emerald-500/10 rounded-2xl transition-all border border-gray-100 dark:border-zinc-800 hover:border-emerald-500/30 shadow-sm"
                          title="Patch Cluster"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
          <PaginationFooter
            currentPage={filter.pageNumber ?? 1}
            rowsPerPage={filter.pageSize ?? 10}
            totalItems={totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export { ProjectTable };


