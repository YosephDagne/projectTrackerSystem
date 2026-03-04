"use client";

import React from "react";
import { ProjectCompletionReport } from "@/types/userProject";

interface ProjectReportTableProps {
  data: ProjectCompletionReport[];
  currentUserId: string;
  onShowMore: (projectId: string) => void;
}

const ProjectReportTable: React.FC<ProjectReportTableProps> = ({
  data,
  currentUserId,
  onShowMore,
}) => {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          <tr>
            {[
              "Project Name",
              "Key",
              "Total Tasks",
              "Completed Tasks",
              "Task Completion",
              "Total SP",
              "Completed SP",
              "SP Completion",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-200 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No projects found
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    No project data available for this user.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((project, index) => (
              <tr
                key={project.projectId}
                className={`${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } transition`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {project.projectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.projectKey}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.totalTasksAssigned}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.completedTasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col">
                    <span className="mb-1 text-gray-700 dark:text-gray-200 font-semibold">
                      {project.taskCompletionPercentage.toFixed(2)}%
                    </span>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${project.taskCompletionPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.totalStoryPointsAssigned}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.completedStoryPoints}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col">
                    <span className="mb-1 text-gray-700 dark:text-gray-200 font-semibold">
                      {project.storyPointCompletionPercentage.toFixed(2)}%
                    </span>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${project.storyPointCompletionPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button
                    onClick={() => onShowMore(project.projectId)}
                    className="px-3 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded transition-colors shadow-sm hover:shadow-md"
                  >
                    Show More
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectReportTable;


