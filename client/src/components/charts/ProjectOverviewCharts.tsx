"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid } from 'recharts';
import { LayoutDashboard, PieChart as PieIcon, BarChart3, ArrowUpRight } from 'lucide-react';

interface ProjectOverviewChartsProps {
  issueTypeCounts: { [type: string]: number };
  tasksStatusCounts?: { [status: string]: number };
}

const ProjectOverviewCharts: React.FC<ProjectOverviewChartsProps> = ({
  issueTypeCounts,
  tasksStatusCounts = {}
}) => {
  const issueTypeData = Object.keys(issueTypeCounts).map(type => ({
    name: type,
    count: issueTypeCounts[type]
  }));

  const taskStatusData = Object.keys(tasksStatusCounts).map(status => ({
    name: status,
    value: tasksStatusCounts[status]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#0ea5e9'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{payload[0].payload.name}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
            <p className="text-sm font-bold text-white">{payload[0].value} {payload[0].value === 1 ? 'Unit' : 'Units'}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="text-indigo-500" size={20} />
          Analytics Intelligence
        </h3>
        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Issue Type Distribution */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-indigo-500" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Segment Distribution</h4>
          </div>

          <div className="h-[250px] w-full">
            {issueTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issueTypeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 800, fill: '#71717a' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#71717a' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6366f1', opacity: 0.05 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {issueTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Zero Data Points Detected
              </div>
            )}
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PieIcon size={14} className="text-emerald-500" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Operational Status</h4>
          </div>

          <div className="h-[250px] w-full">
            {taskStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {taskStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Matrix Unpopulated
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverviewCharts;


