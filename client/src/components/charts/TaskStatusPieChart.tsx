// src/components/charts/TaskStatusPieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClipboardList } from 'lucide-react';
import Card from '@/components/ProjectsDetails/Card';

interface TaskStatusPieChartProps {
  tasksStatusCounts?: { [status: string]: number }; 
}

const TaskStatusPieChart: React.FC<TaskStatusPieChartProps> = ({ tasksStatusCounts = {} }) => { 
  const data = Object.keys(tasksStatusCounts).map(status => ({
    name: status,
    value: tasksStatusCounts[status]
  }));

  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#6B7280', '#60A5FA'];

  return (
    <Card title="Task Status Breakdown" icon={ClipboardList}>
      {Object.keys(tasksStatusCounts).length > 0 ? ( 
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No task status data available.
        </div>
      )}
    </Card>
  );
};

export default TaskStatusPieChart;


