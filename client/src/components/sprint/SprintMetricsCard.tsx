"use client";

import React from "react";
import {
  Gauge,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  Clock,
  Flame,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { SprintReportDetail } from "@/types/sprint";

interface SprintMetricsCardProps {
  report: SprintReportDetail;
}

const SprintMetricsCard: React.FC<SprintMetricsCardProps> = ({ report }) => {
  const metrics = [
    {
      label: "Velocity (SP)",
      value: `${report.completedStoryPoints || 0} / ${report.totalStoryPoints || 0}`,
      icon: <CheckCircle size={20} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Node Throughput",
      value: `${report.completedTasks || 0} / ${report.totalTasks || 0}`,
      icon: <ClipboardList size={20} />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Structural Blockers",
      value: report.activeBlockers || 0,
      icon: <AlertCircle size={20} />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Delayed Hooks",
      value: report.overdueTasks || 0,
      icon: <Clock size={20} />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Regression Anomalies",
      value: report.bugsCreatedThisSprint || 0,
      icon: <Flame size={20} />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Carry-over Load",
      value: report.tasksMovedFromPreviousSprint || 0,
      icon: <Activity size={20} />,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Gauge className="text-indigo-500" size={20} />
          Performance Matrix
        </h3>
        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="group p-4 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/30 transition-all flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {metric.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-tight">
              {metric.label}
            </p>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintMetricsCard;


