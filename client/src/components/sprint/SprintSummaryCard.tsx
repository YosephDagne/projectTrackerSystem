"use client";

import React from "react";
import { Calendar, Goal, Zap, Flag, Activity } from "lucide-react";
import { formatDate } from "@/services/sprintApi";
import { SprintReportDetail } from "@/types/sprint";

interface SprintSummaryCardProps {
  report: SprintReportDetail;
}

const SprintSummaryCard: React.FC<SprintSummaryCardProps> = ({ report }) => {
  if (!report) return null;

  const {
    name,
    startDate,
    endDate,
    state,
    goal,
    storyPointCompletionPercentage = 0,
    taskCompletionPercentage = 0,
  } = report;

  const getStatusConfig = (s: string) => {
    switch (s?.toLowerCase()) {
      case "active": return { label: "Active Protocol", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "closed": return { label: "Legacy Archive", color: "text-gray-400", bg: "bg-gray-100 dark:bg-zinc-800", border: "border-gray-200 dark:border-zinc-700" };
      default: return { label: "Standby", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
    }
  };

  const status = getStatusConfig(state || "");

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="text-indigo-500" size={20} />
          {name || "Protocol Unknown"}
        </h3>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.bg} ${status.color} ${status.border}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-6">
        {/* Timeline */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Temporal Window</p>
            <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">
              {startDate ? formatDate(startDate) : "TBD"} — {endDate ? formatDate(endDate) : "TBD"}
            </p>
          </div>
        </div>

        {/* Goal */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
            <Flag size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Strategic Objective</p>
            <p className="text-sm font-bold text-gray-700 dark:text-zinc-300 italic">
              {goal || "No operational objective defined for this cycle."}
            </p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Story Point Velocity</span>
              <span className="text-indigo-500">{storyPointCompletionPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-1000"
                style={{ width: `${storyPointCompletionPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Task Saturation</span>
              <span className="text-emerald-500">{taskCompletionPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${taskCompletionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintSummaryCard;


