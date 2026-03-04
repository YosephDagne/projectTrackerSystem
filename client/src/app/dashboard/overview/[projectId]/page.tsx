'use client';

import ProjectStrategicEditForm from '@/components/reports/EditProject';
import ProjectOverallReport from '@/components/reports/ProjectOverview';
import * as React from 'react';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { projectId } = React.use(params); // <-- Correct usage

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectOverallReport projectId={projectId} />
    </div>
  );
}
