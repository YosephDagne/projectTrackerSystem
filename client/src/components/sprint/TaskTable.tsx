"use client";

import React, { useState, useMemo } from "react";
import { TaskInSprint } from "@/types/sprint";
import {
  Book,
  Bug,
  CheckCircle,
  KanbanSquare,
  ListFilter,
  User,
  Clock,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { formatDate } from "@/services/sprintApi";
import PaginationFooter from "@/components/layout/PaginationFooter";

interface TasksTableProps {
  tasks: TaskInSprint[];
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const totalTasks = tasks.length;

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return tasks.slice(startIndex, startIndex + rowsPerPage);
  }, [tasks, currentPage, rowsPerPage]);

  const getIssueTypeIcon = (issueType: string | null) => {
    switch (issueType?.toLowerCase()) {
      case "story": return <Book size={14} className="text-emerald-500" />;
      case "bug": return <Bug size={14} className="text-rose-500" />;
      case "task": return <CheckCircle size={14} className="text-indigo-500" />;
      case "epic": return <KanbanSquare size={14} className="text-purple-500" />;
      default: return <ListFilter size={14} className="text-gray-400" />;
    }
  };

  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "done": return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "in progress": return { color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
      case "blocked": return { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
      default: return { color: "text-gray-500", bg: "bg-gray-100 dark:bg-zinc-800", border: "border-gray-200 dark:border-zinc-700" };
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-zinc-950/50 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <th className="px-6 py-5">Task Identifier</th>
              <th className="px-6 py-5">Substantive Scope</th>
              <th className="px-6 py-5">Classification</th>
              <th className="px-6 py-5">Persistence State</th>
              <th className="px-6 py-5">Personnel</th>
              <th className="px-6 py-5">Deadline</th>
              <th className="px-6 py-5 text-right">Velocity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {paginatedTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">
                  No task nodes detected in this sector.
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task, index) => {
                const status = getStatusConfig(task.status);
                return (
                  <tr key={task.key || index} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-all font-inter">
                    <td className="px-6 py-5">
                      <span className="font-black text-indigo-600 dark:text-indigo-400 tracking-tighter hover:underline cursor-pointer">
                        {task.key}
                      </span>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 line-clamp-1 group-hover:line-clamp-none transition-all">
                        {task.title}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 w-fit">
                        {getIssueTypeIcon(task.issueType)}
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                          {task.issueType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.bg} ${status.color} ${status.border}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-black">
                          {task.assigneeName ? task.assigneeName.charAt(0) : <User size={12} />}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                          {task.assigneeName || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                        <Clock size={12} className="text-amber-500" />
                        {task.dueDate ? formatDate(task.dueDate) : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                        {task.storyPoints || 0}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50/30 dark:bg-zinc-950/30 border-t border-gray-100 dark:border-zinc-800">
        <PaginationFooter
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalItems={totalTasks}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>
    </div>
  );
};

export { TasksTable };


