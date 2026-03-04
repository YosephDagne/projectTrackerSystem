import React, { useEffect, useState } from "react";
import BreakdownCard from "./BreakdownCard";
import MetricCard from "./MetricsCard";
import { TasksTable } from "../sprint/TaskTable";
import { UserProjectReport, TaskStatus } from "../../types/userReport";
import { TaskInSprint } from "@/types/sprint";
import { fetchUserProjectReport } from "@/services/userReportApi";
import { Search, Filter } from "lucide-react";

interface UserProjectReportProps {
  data: UserProjectReport;
  loading: boolean;
  userId: string;
  projectId: string;
}

const UserProjectReportComponent: React.FC<UserProjectReportProps> = ({
  userId,
  projectId,
}) => {
  const [reportData, setReportData] = useState<UserProjectReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedTasks, setDisplayedTasks] = useState<TaskInSprint[]>([]);

  useEffect(() => {
    const getReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserProjectReport(userId, projectId);
        setReportData(data);
        setDisplayedTasks(data.userTasksInProject || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch report.");
      } finally {
        setLoading(false);
      }
    };
    getReport();
  }, [userId, projectId]);

  useEffect(() => {
    if (!reportData?.userTasksInProject) return;

    const trimmedSearch = searchTerm.trim().toLowerCase();
    const filtered = reportData.userTasksInProject.filter((task) => {
      const matchesStatus =
        filterStatus === "All" || task.status === filterStatus;
      const matchesSearch =
        !trimmedSearch ||
        task.title?.toLowerCase().includes(trimmedSearch) ||
        task.key?.toLowerCase().includes(trimmedSearch) ||
        task.description?.toLowerCase().includes(trimmedSearch);
      return matchesStatus && matchesSearch;
    });

    setDisplayedTasks(filtered);
  }, [searchTerm, filterStatus, reportData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Loading report data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Error: {error}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Please ensure the backend is available and the user/project ID is
            valid.
          </p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          No report data available.
        </p>
      </div>
    );
  }

  const {
    userName,
    projectName,
    totalTasksAssigned,
    completedTasks,
    totalStoryPointsAssigned,
    completedStoryPoints,
    overdueTasks,
    activeBlockers,
    taskCompletionPercentage,
    storyPointCompletionPercentage,
    taskStatusCounts,
    issueTypeCounts,
    priorityCounts,
    sprintsInvolvedIn,
  } = reportData;

  const statusOptions = [
    { value: "All", label: "All Statuses" },
    ...Object.values(TaskStatus).map((status) => ({
      value: status,
      label: status.replace(/([A-Z])/g, " $1").trim(),
    })),
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 text-center ml-[-30px]">
      <header className="text-center mb-10 ml-[-400px] mt-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center ml-80">
          {userName}'s Report for {projectName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center ml-80 mt-3">
          Detailed performance breakdown and task summary
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="Total Tasks Assigned"
          value={totalTasksAssigned}
          color="blue"
        />
        <MetricCard
          title="Completed Tasks"
          value={completedTasks}
          percentage={taskCompletionPercentage}
          color="green"
        />
        <MetricCard
          title="Total Story Points"
          value={totalStoryPointsAssigned}
          color="purple"
        />
        <MetricCard
          title="Completed Story Points"
          value={completedStoryPoints}
          percentage={storyPointCompletionPercentage}
          color="teal"
        />
        <MetricCard title="Overdue Tasks" value={overdueTasks} color="red" />
        <MetricCard
          title="Active Blockers"
          value={activeBlockers}
          color="orange"
        />
      </section>

      {sprintsInvolvedIn?.length > 0 && (
        <section className="bg-white dark:bg-gray-800 shadow-sm p-4 rounded-lg mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            Sprints Involved In
          </h2>
          <div className="flex flex-wrap gap-2">
            {sprintsInvolvedIn.map((sprint) => (
              <span
                key={sprint.id}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sprint.state === "active"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : sprint.state === "closed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                }`}
              >
                {sprint.name} ({sprint.state})
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <BreakdownCard
          title="Task Status Breakdown"
          counts={taskStatusCounts}
        />
        <BreakdownCard title="Issue Type Breakdown" counts={issueTypeCounts} />
        <BreakdownCard title="Priority Breakdown" counts={priorityCounts} />
      </section>

      {/* Search & Filter Section */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by Key, Title, or Description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="relative w-full lg:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none w-full pl-10 pr-8 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
              ▼
            </div>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("All");
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition w-full lg:w-auto"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Task Table Section */}
      <section >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Filtered Tasks ({displayedTasks.length})
        </h2>
        <div className="">
          {displayedTasks.length > 0 ? (
            <div className="min-w-full">
              <TasksTable tasks={displayedTasks} />
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              No tasks match your search or filter criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserProjectReportComponent;


