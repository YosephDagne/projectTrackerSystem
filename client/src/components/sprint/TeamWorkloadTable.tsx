"use client";

import React from "react";
import { Users, User, Zap, CheckCircle2, Layout } from "lucide-react";
import { DeveloperWorkload } from "@/types/sprint";

interface TeamWorkloadTableProps {
  developerWorkloads: DeveloperWorkload[];
}

const TeamWorkloadTable: React.FC<TeamWorkloadTableProps> = ({
  developerWorkloads,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-zinc-950/50 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <th className="px-6 py-5">Personnel Identifier</th>
              <th className="px-6 py-5">Assigned Velocity</th>
              <th className="px-6 py-5">Executed Velocity</th>
              <th className="px-6 py-5">Resource Utilization</th>
              <th className="px-6 py-5">Lifecycle Segments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {developerWorkloads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic font-bold">
                  No personnel workloads discovered in this sector.
                </td>
              </tr>
            ) : (
              developerWorkloads.map((dev, index) => {
                const completionPercentage = (dev.estimatedWork ?? 0) > 0
                  ? ((dev.completedWork ?? 0) / (dev.estimatedWork ?? 1)) * 100
                  : 0;

                return (
                  <tr key={index} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{dev.assigneeName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Operative</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-sm text-gray-700 dark:text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Layout size={14} className="text-indigo-400" />
                        {(dev.estimatedWork ?? 0).toFixed(1)} <span className="text-[10px] uppercase">SP</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-sm text-emerald-500">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        {(dev.completedWork ?? 0).toFixed(1)} <span className="text-[10px] uppercase">SP</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-gray-400">{completionPercentage.toFixed(0)}% Utilized</span>
                        </div>
                        <div className="w-32 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-1000"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(dev.taskStatusBreakdown).map((status) => (
                          <div
                            key={status}
                            className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center gap-1.5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400">
                              {status}: {dev.taskStatusBreakdown[status]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamWorkloadTable;


