"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Sigma, ArrowRight } from "lucide-react";

interface PriorityBreakdownChartProps {
  priorityCounts: {
    [key: string]: number;
  };
}

const PriorityBreakdownChart: React.FC<PriorityBreakdownChartProps> = ({ priorityCounts }) => {
  const priorityOrder = ['Highest', 'High', 'Medium', 'Low', 'Lowest', 'None', 'N/A'];

  const data = priorityOrder
    .map(orderKey => ({
      name: orderKey,
      count: priorityCounts[orderKey] || 0
    }))
    .filter(item => item.count > 0);

  const COLORS: { [key: string]: string } = {
    'Highest': '#f43f5e',
    'High': '#f59e0b',
    'Medium': '#6366f1',
    'Low': '#10b981',
    'Lowest': '#3b82f6',
    'None': '#71717a',
    'N/A': '#52525b'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[label] }} />
            <p className="text-sm font-bold text-white">{payload[0].value} Tasks</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Sigma className="text-indigo-500" size={20} />
          Urgency Distribution
        </h3>
        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          Relative Priority <ArrowRight size={12} />
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            layout="vertical"
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" opacity={0.1} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#71717a', letterSpacing: '0.05em' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6366f1', opacity: 0.05 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#e4e4e7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityBreakdownChart; 


