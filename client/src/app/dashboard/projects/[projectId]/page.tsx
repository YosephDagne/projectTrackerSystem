'use client';

import ProjectStrategicEditForm from '@/components/reports/EditProject';
import * as React from 'react';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { projectId } = React.use(params); // <-- Correct usage

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectStrategicEditForm projectId={projectId} />
    </div>
  );
}
