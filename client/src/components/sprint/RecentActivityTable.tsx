"use client";

import React from "react";
import { Activity, Clock, User, Zap, Hash } from "lucide-react";
import { formatDateTime } from "@/services/sprintApi";
import { RecentActivity } from "@/types/sprint";

interface RecentActivityTableProps {
  recentActivities: RecentActivity[];
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  recentActivities,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-zinc-950/50 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <th className="px-6 py-5">Event Timestamp</th>
              <th className="px-6 py-5">Node Reference</th>
              <th className="px-6 py-5">Protocol Mutation</th>
              <th className="px-6 py-5">Originator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {recentActivities.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic font-bold">
                  No recent activity traces discovered in this sector.
                </td>
              </tr>
            ) : (
              recentActivities.map((activity, index) => (
                <tr key={index} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400">
                      <Clock size={12} className="text-indigo-400" />
                      {formatDateTime(activity.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 w-fit">
                      <Hash size={12} className="text-indigo-500" />
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{activity.taskKey}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-md">
                    <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 line-clamp-1 group-hover:line-clamp-none transition-all">
                      {activity.description}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-black text-gray-700 dark:text-zinc-300">
                        {activity.changedBy ?? "SYSTEM"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;


