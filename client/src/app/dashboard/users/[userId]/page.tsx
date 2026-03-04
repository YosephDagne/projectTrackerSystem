"use client";

import React, { useEffect, useState, use } from "react";
import { toast } from "react-toastify";
import { ProjectCompletionReports } from "@/types/userProject";
import { UserProjectReport } from "@/types/userReport";
import {
  FetchProjectById,
  fetchUserProjectReport,
} from "@/services/userReportApi";
import ProjectReportTable from "@/components/usertable/ProjectReportTable";
import UserProjectReportComponent from "@/components/usertable/UserProjectReportComponent";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function UserDetailComponent({ params }: PageProps) {
  const { userId } = use(params);

  const [project, setProject] = useState<ProjectCompletionReports | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<UserProjectReport | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        setError("User ID is missing.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const userData = await FetchProjectById(userId);
        setProject(userData);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        toast.error("Failed to load user details.");
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleShowMore = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setProjectLoading(true);
    try {
      if (!userId) {
        toast.error("User ID not available to fetch project details.");
        setProjectLoading(false);
        return;
      }
      const projectReport = await fetchUserProjectReport(userId, projectId);
      setSelectedProject(projectReport);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
      toast.error("Failed to load project details.");
    } finally {
      setProjectLoading(false);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedProjectId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800 dark:text-white">
        <p className="text-gray-600 dark:text-gray-300">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 dark:bg-gray-800 dark:text-red-400">
        <div>
          <p>Error: {error}</p>
          <p>User ID: {userId}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800 dark:text-white">
        <p className="text-gray-600 dark:text-gray-300">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl w-full mt-2">
      {selectedProject && selectedProjectId ? (
        <div className="mb-2">
          <button
            onClick={handleBackToProjects}
            className="text-xl font-medium text-blue-600 hover:underline flex items-center mt-[-5px] ml-[-30px]"
          >
            ← Back to Projects
          </button>
          <UserProjectReportComponent
            userId={userId}
            projectId={selectedProjectId}
            data={selectedProject}
            loading={projectLoading}
          />
        </div>
      ) : (
        <div className="">
          <h2 className="text-2xl sm:text-3xl mb-5 font-bold text-left mt-10">
            Assigned Projects Overview
          </h2>
          <div className="mt-4">
            <ProjectReportTable
              data={project}
              currentUserId={userId}
              onShowMore={handleShowMore}
            />
          </div>
        </div>
      )}
    </div>
  );
}