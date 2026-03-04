'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  CheckSquare,
  Users,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { fetchProjects, ProjectDto } from '@/services/Jira';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsDataLoading(true);
        const result = await fetchProjects({ pageSize: 10 });
        setProjects(result.items);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        toast.error("Network Error: Could not connect to the server. Please ensure the backend is running.");
      } finally {
        setIsDataLoading(false);
      }
    };
    if (user) loadDashboardData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: projects.length, color: 'text-indigo-500', icon: Briefcase, bg: 'bg-indigo-500/10' },
    { label: 'Critical Projects', value: projects.filter(p => p.Health.Level === 'Critical').length, color: 'text-rose-500', icon: AlertCircle, bg: 'bg-rose-500/10' },
    { label: 'Active Blockers', value: 0, color: 'text-amber-500', icon: Clock, bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.email}</span>. Here's your project status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" />
            <span className="text-sm font-medium">System Healthy</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className={`text-4xl font-bold ${stat.color} tracking-tight`}>
                {isDataLoading ? '...' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects Table/List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Projects</h3>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="flex-1 min-h-[400px]">
            {isDataLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="p-4 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                  <Briefcase size={40} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                  No projects found. Use the Jira API provided to fetch your projects.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Health</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {projects.map((project) => (
                      <tr
                        key={project.Id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/dashboard/projects/${project.Id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                              {project.Key}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{project.Name}</p>
                              <p className="text-xs text-gray-400">{project.Lead}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.Health.Level === 'Good' ? 'bg-emerald-500' :
                              project.Health.Level === 'Fair' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                            <span className="text-xs font-medium uppercase tracking-tight">
                              {project.Health.Reason || project.Health.Level}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full max-w-[100px] h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                              style={{ width: `${(project.Progress.CompletedTasks / project.Progress.TotalTasks) * 100 || 0}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {project.Progress.CompletedTasks}/{project.Progress.TotalTasks} Tasks
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${project.Status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-gray-500/10 text-gray-400'
                            }`}>
                            {project.Status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2">Upgrade to Pro</h4>
              <p className="text-indigo-100 text-sm mb-4">Get unlimited projects and advanced analytics for your team.</p>
              <button className="w-full py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: 'Create Project', icon: Briefcase },
                { label: 'View Reports', icon: TrendingUp },
                { label: 'Invite Team', icon: Users },
                { label: 'My Tasks', icon: CheckSquare },
              ].map((link, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm group"
                >
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <link.icon size={18} />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <TrendingUp size={12} className="rotate-45" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


