"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { NextPage } from "next";
import {
  LayoutDashboard,
  List,
  Users,
  Activity,
  PieChart,
  ClipboardList,
  Gauge,
  BarChart2,
  Search,
  ChevronDown,
  Filter,
  ArrowLeft,
  Calendar,
  Layers,
  Zap,
  Terminal,
  Cpu,
  ShieldCheck,
  Target,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  SprintReport,
  ProjectSprintOverviewResponse,
  SprintReportDetail,
} from "@/types/sprint";

import { fetchApi, fetchSprint } from "@/services/sprintApi";
import LoadingSpinner from "@/components/ProjectsDetails/LoadingSpinner";
import ErrorAlert from "@/components/ProjectsDetails/ErrorAlert";
import ProjectOverviewCharts from "@/components/charts/ProjectOverviewCharts";
import SprintSummaryCard from "@/components/sprint/SprintSummaryCard";
import SprintMetricsCard from "@/components/sprint/SprintMetricsCard";
import TeamWorkloadTable from "@/components/sprint/TeamWorkloadTable";
import RecentActivityTable from "@/components/sprint/RecentActivityTable";
import { TasksTable } from "../sprint/TaskTable";
import PriorityBreakdownCard from "@/components/sprint/PriorityBreakdownChart";

interface ProjectDetailProps {
  projectKey: string;
}

const ProjectDetail: NextPage<ProjectDetailProps> = ({ projectKey }) => {
  const router = useRouter();
  const [sprintReport, setSprintReport] = useState<SprintReportDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("");
  const [availableSprints, setAvailableSprints] = useState<SprintReport[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectOverviewData: ProjectSprintOverviewResponse = await fetchApi(projectKey);
        setProjectName(projectOverviewData.projectName);
        if (projectOverviewData.sprints?.length > 0) {
          setAvailableSprints(projectOverviewData.sprints);
          const selected =
            projectOverviewData.sprints.find((s) => s.state === "active") ||
            projectOverviewData.sprints.find((s) => s.state === "closed") ||
            projectOverviewData.sprints[0];
          if (selected) {
            setSelectedSprintId(selected.id);
          } else {
            setError(`No active or legacy sprints discovered for ${projectKey}`);
          }
        } else {
          setError(`Zero-sprint environment detected for project: ${projectKey}`);
        }
      } catch (err: any) {
        setError(err.message || "Protocol bridge failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectKey]);

  useEffect(() => {
    const fetchSelectedSprintDetails = async () => {
      if (!selectedSprintId) return;
      setLoading(true);
      try {
        const sprintDetail = await fetchSprint(selectedSprintId);
        setSprintReport({
          ...sprintDetail,
          taskStatusCounts: sprintDetail.taskStatusCounts || {},
          issueTypeCounts: sprintDetail.issueTypeCounts || {},
          developerWorkloads: sprintDetail.developerWorkloads || [],
          recentActivities: sprintDetail.recentActivities || [],
        });
        setSelectedDeveloper("");
      } catch (err: any) {
        setError(err.message || "Failed to sync sprint matrix.");
        setSprintReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedSprintDetails();
  }, [selectedSprintId]);

  const navItems = [
    { id: "sprint-summary-section", title: "Summary", icon: ClipboardList },
    { id: "sprint-metrics-section", title: "Metrics", icon: Gauge },
    { id: "priority-breakdown-section", title: "Priorities", icon: BarChart2 },
    { id: "project-charts-section", title: "Analytics", icon: PieChart },
    { id: "tasks-table-section", title: "Tasks", icon: List },
    { id: "team-workload-section", title: "Workload", icon: Users },
    { id: "recent-activity-section", title: "Activity", icon: Activity },
  ];

  const developerOptions = useMemo(() => {
    if (!sprintReport?.developerWorkloads) return [];
    const uniqueDevelopers = Array.from(
      new Set(sprintReport.developerWorkloads.map((dev) => dev.assigneeName))
    );
    return uniqueDevelopers.map((name) => ({ label: name, value: name }));
  }, [sprintReport?.developerWorkloads]);

  const filteredTasksByDeveloper = useMemo(() => {
    if (!sprintReport?.tasksInSprint) return [];
    if (!selectedDeveloper) return sprintReport.tasksInSprint;
    return sprintReport.tasksInSprint.filter(
      (task) => task.assigneeName?.toLowerCase() === selectedDeveloper.toLowerCase()
    );
  }, [sprintReport?.tasksInSprint, selectedDeveloper]);

  const filteredData = useMemo(() => {
    const priorityCounts: { [key: string]: number } = {};
    const issueTypeCounts: { [key: string]: number } = {};
    const taskStatusCounts: { [key: string]: number } = {};

    filteredTasksByDeveloper.forEach((task) => {
      priorityCounts[task.priority || "N/A"] = (priorityCounts[task.priority || "N/A"] || 0) + 1;
      issueTypeCounts[task.issueType || "N/A"] = (issueTypeCounts[task.issueType || "N/A"] || 0) + 1;
      taskStatusCounts[task.status || "N/A"] = (taskStatusCounts[task.status || "N/A"] || 0) + 1;
    });

    return { priorityCounts, issueTypeCounts, taskStatusCounts };
  }, [filteredTasksByDeveloper]);

  const filteredWorkloads = useMemo(() => {
    if (!sprintReport?.developerWorkloads) return [];
    if (!selectedDeveloper) return sprintReport.developerWorkloads;
    return sprintReport.developerWorkloads.filter(
      (dev) => dev.assigneeName.toLowerCase() === selectedDeveloper.toLowerCase()
    );
  }, [sprintReport?.developerWorkloads, selectedDeveloper]);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Premium Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-500 transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-sm">
            <ArrowLeft size={16} />
          </div>
          Return to Hub
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync: Active
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
            <Clock size={12} />
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Hero Cluster Card */}
      <div className="relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-indigo-500/5 group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -mr-40 -mt-40 rounded-full transition-all duration-1000 group-hover:scale-110" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-start gap-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 transform group-hover:rotate-3 transition-transform">
              <Layers size={40} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-500">
                <Terminal size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Cluster</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white italic uppercase leading-none">
                {projectName || projectKey}
              </h1>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <Cpu size={14} className="text-indigo-400" />
                  ID: <span className="text-zinc-700 dark:text-zinc-200">{projectKey}</span>
                </div>
                <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Status: <span className="text-emerald-500">Node Sync Complete</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 dark:bg-zinc-950/30 p-2 rounded-[2rem] border border-gray-100 dark:border-zinc-800/50 backdrop-blur-sm">
            {/* Sprint Sync Control */}
            {availableSprints.length > 0 && (
              <div className="relative group/select">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none group-hover/select:scale-110 transition-transform">
                  <Zap size={16} />
                </div>
                <select
                  value={selectedSprintId || ""}
                  onChange={(e) => setSelectedSprintId(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all dark:text-white appearance-none cursor-pointer shadow-sm"
                >
                  {availableSprints.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} [{s.state.toUpperCase()}]</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            )}

            {/* Principal Filter */}
            {sprintReport?.developerWorkloads && (
              <div className="relative group/select">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Target size={16} />
                </div>
                <select
                  value={selectedDeveloper}
                  onChange={(e) => setSelectedDeveloper(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all dark:text-white appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">Global Observer</option>
                  {developerOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tactical Navigation Rail */}
      <div className="sticky top-4 z-40 flex flex-wrap gap-3 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl shadow-zinc-950/20 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all whitespace-nowrap active:scale-95 group"
          >
            <item.icon size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            {item.title}
          </Link>
        ))}
      </div>

      {/* Cluster Data Stream */}
      <main className="relative min-h-[600px]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
            <div className="w-14 h-14 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Intercepting Data Packets...</p>
          </div>
        )}

        {error && <ErrorAlert message={error} />}

        {!loading && !error && sprintReport && (
          <div className="space-y-16 animate-fadeIn">
            {/* Tier 1: Core Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div id="sprint-summary-section" className="scroll-mt-40 transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6 ml-2">
                  <ClipboardList className="text-indigo-500" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Executive Summary</h2>
                </div>
                <SprintSummaryCard report={sprintReport} />
              </div>
              <div id="sprint-metrics-section" className="scroll-mt-40 transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6 ml-2">
                  <Gauge className="text-emerald-500" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Saturation Metrics</h2>
                </div>
                <SprintMetricsCard report={sprintReport} />
              </div>
            </div>

            {/* Tier 2: Distribution Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div id="priority-breakdown-section" className="scroll-mt-40 transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6 ml-2">
                  <BarChart2 className="text-rose-500" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Criticality Breakdown</h2>
                </div>
                <PriorityBreakdownCard priorityCounts={filteredData.priorityCounts} />
              </div>
              <div id="project-charts-section" className="scroll-mt-40 transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6 ml-2">
                  <PieChart className="text-amber-500" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Node Archetypes</h2>
                </div>
                <ProjectOverviewCharts
                  issueTypeCounts={filteredData.issueTypeCounts}
                  tasksStatusCounts={filteredData.taskStatusCounts}
                />
              </div>
            </div>

            {/* Tier 3: Operation Manifest */}
            <div id="tasks-table-section" className="scroll-mt-40">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shadow-inner">
                    <List size={24} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Operation Manifest</h2>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Listing all active and historical operational nodes</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Total Identified: {filteredTasksByDeveloper.length}
                </div>
              </div>
              <TasksTable tasks={filteredTasksByDeveloper} />
            </div>

            {/* Tier 4: Velocity Allocation */}
            <div id="team-workload-section" className="scroll-mt-40">
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 border border-purple-500/10 shadow-inner">
                  <Users size={24} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Velocity Allocation</h2>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Resource distribution across operative clusters</p>
                </div>
              </div>
              <TeamWorkloadTable developerWorkloads={filteredWorkloads} />
            </div>

            {/* Tier 5: Operational Logs */}
            <div id="recent-activity-section" className="scroll-mt-40">
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10 shadow-inner">
                  <Activity size={24} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Operational Logs</h2>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Real-time mutation stream and entry history</p>
                </div>
              </div>
              <RecentActivityTable recentActivities={sprintReport.recentActivities} />
            </div>
          </div>
        )}
      </main>

      {/* Decorative footer element */}
      <div className="pt-20 pb-10 flex items-center justify-center gap-8 opacity-20">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-500" />
        <Terminal size={24} className="text-zinc-500" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-500" />
      </div>
    </div>
  );
};

export default ProjectDetail;


