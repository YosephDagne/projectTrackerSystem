'use client';

import ProjectDetail from '@/components/ProjectsDetails';
import * as React from 'react';

interface PageProps {
  params: Promise<{ projectKey: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { projectKey } = React.use(params); // <-- Correct usage

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectDetail projectKey={projectKey} />
    </div>
  );
}
