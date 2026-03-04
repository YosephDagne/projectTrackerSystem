// src/components/charts/IssueTypeBarChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import Card from '@/components/ProjectsDetails/Card';

interface IssueTypeBarChartProps {
  issueTypeCounts: { [type: string]: number };
}

const IssueTypeBarChart: React.FC<IssueTypeBarChartProps> = ({ issueTypeCounts }) => {
  const data = Object.keys(issueTypeCounts).map(type => ({
    name: type,
    count: issueTypeCounts[type]
  }));

  return (
    <Card title="Issue Type Distribution" icon={Activity}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4B5563" className="rounded-lg" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueTypeBarChart;


