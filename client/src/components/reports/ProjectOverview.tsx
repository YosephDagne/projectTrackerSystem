"use client";

import { ProjectDetailDto, OverallProjectStatus, MilestoneStatus } from '@/types/projectDetail';
import { getProjectDetails } from '@/services/projectDetailApi';
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    CheckCircle2,
    AlertTriangle,
    Layers,
    User,
    FileText,
    Target,
    Loader2,
    ArrowLeft,
    ShieldCheck,
    Cpu,
    Zap,
    Flag,
    Activity,
    Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjectOverallReportProps {
    projectId: string;
}

const ProjectOverallReport: React.FC<ProjectOverallReportProps> = ({ projectId }) => {
    const router = useRouter();
    const [report, setReport] = useState<ProjectDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getProjectDetails(projectId);
                if (data) {
                    setReport(data);
                } else {
                    setError("Project matrix not located for this UID.");
                }
            } catch (err: any) {
                setError(err.message || "Protocol bridge failure for report sync.");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) loadReport();
    }, [projectId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Overall Status Matrix...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center p-12 bg-rose-500/5 border border-rose-500/20 rounded-[2rem] text-rose-500 animate-scaleIn">
            <AlertTriangle size={48} className="mb-4" />
            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Sync Interrupted</h3>
            <p className="text-sm font-bold opacity-80">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all"
            >
                Retry Protocol
            </button>
        </div>
    );

    if (!report) return null;

    const completionPercentage = report.progress.totalTasks > 0 ? (report.progress.completedTasks / report.progress.totalTasks) * 100 : 0;
    // Note: Story points might not be directly in progress object if backend is different, but checking IProject it only has totalTasks/completedTasks.
    // However, the frontend type ProjectDetailDto was updated by me previously to have progress: { totalTasks, completedTasks, onTrackPercentage }.
    // Let's assume onTrackPercentage might represent SP for now or just generic progress.
    const spPercentage = report.progress.onTrackPercentage || 0;

    const getStatusConfig = (status: OverallProjectStatus) => {
        switch (status) {
            case OverallProjectStatus.Active: return { label: "Operational", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
            case OverallProjectStatus.OnHold: return { label: "Paused State", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
            case OverallProjectStatus.Completed: return { label: "Archived Complete", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
            case OverallProjectStatus.Cancelled: return { label: "Terminated", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
            case OverallProjectStatus.Archived: return { label: "Legacy Registry", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20" };
            default: return { label: "Registry State", color: "text-gray-400", bg: "bg-zinc-800", border: "border-zinc-700" };
        }
    };

    const status = getStatusConfig(report.overallProjectStatus);

    return (
        <div className="space-y-10 animate-fadeIn text-inter">
            {/* Context Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-500 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                        <ArrowLeft size={16} />
                    </div>
                    Return to Cluster
                </button>

                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        Real-time Sync Active
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        Node UUID: <span className="text-indigo-500">{report.id}</span>
                    </div>
                </div>
            </div>

            {/* Premium Header Card */}
            <div className="relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-indigo-500/5 group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:scale-110" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${status.bg} ${status.color} ${status.border}`}>
                                {status.label}
                            </span>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950/50 rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-800/50">
                                <Cpu size={12} className="text-indigo-500" />
                                Registry Key: {report.key}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white mb-4 italic leading-tight">
                                {report.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-xs text-white font-black overflow-hidden shadow-lg shadow-indigo-500/20">
                                        {report.lead ? report.lead.charAt(0) : '?'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Cluster Lead</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-zinc-200 mt-1">{report.lead || 'Unassigned'}</p>
                                    </div>
                                </div>

                                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-zinc-800 shadow-inner">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Operation Window</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-zinc-200 mt-1">
                                            {report.projectStartDate ? new Date(report.projectStartDate).toLocaleDateString() : 'TBD'} — {report.targetEndDate ? new Date(report.targetEndDate).toLocaleDateString() : 'TBD'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-end gap-2">
                        <div className="p-8 bg-zinc-950/20 rounded-[2rem] border border-zinc-800/50 backdrop-blur-sm text-center lg:text-right min-w-[240px] shadow-inner">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Integrity Alignment</p>
                            <div className="flex items-center justify-center lg:justify-end gap-4">
                                <div className={`w-4 h-4 rounded-full relative ${report.health.level === 'Good' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' :
                                        report.health.level === 'Fair' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' :
                                            'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                                    }`}>
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                                </div>
                                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">{report.health.level}</span>
                            </div>
                            <p className="mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-60 truncate">
                                Score Index: {report.health.score}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Primary Capacity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MetricBox
                    icon={CheckCircle2}
                    label="Operational Nodes"
                    value={`${report.progress.completedTasks} / ${report.progress.totalTasks}`}
                    percent={completionPercentage}
                    variant="indigo"
                />
                <MetricBox
                    icon={Layers}
                    label="Saturation Profile"
                    value={`${report.progress.completedTasks} NODES`}
                    percent={spPercentage}
                    variant="emerald"
                />
                <MetricBox
                    icon={ShieldCheck}
                    label="System Guard"
                    value={report.risks ? report.risks.length.toString() : "0"}
                    isWarning={report.risks && report.risks.length > 3}
                    subtitle="Tracked Anomalies"
                    variant="rose"
                />
            </div>

            {/* Second Tier Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Executive Protocol */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
                        <div className="absolute top-0 right-0 p-10 text-indigo-500/5 group-hover:scale-110 transition-transform">
                            <FileText size={160} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-10 text-indigo-500">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shadow-inner">
                                    <FileText size={24} />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">Executive Directives</h2>
                            </div>
                            <div className="p-8 bg-zinc-50 dark:bg-zinc-950/20 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 shadow-inner">
                                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-lg font-medium italic pr-12">
                                    {report.executiveSummary || "System awaiting high-level mission directives. Tactical oversight required."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Matrix (Milestones) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3 text-indigo-500">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shadow-inner">
                                    <Zap size={24} />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">Timeline Matrix</h2>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                Milestone Propagation
                            </div>
                        </div>

                        {report.milestones && report.milestones.length > 0 ? (
                            <div className="space-y-4">
                                {report.milestones.map((milestone, idx) => (
                                    <div key={idx} className="group p-6 bg-zinc-50 dark:bg-zinc-950/20 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-zinc-100 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-inner">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm transition-all group-hover:scale-110 ${milestone.status === MilestoneStatus.Completed ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-gray-100 dark:bg-zinc-800 text-zinc-400 border border-gray-200 dark:border-zinc-700'
                                                }`}>
                                                <span className="text-[10px] opacity-60">ID</span>
                                                <span className="text-xl -mt-1">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight italic">{milestone.name}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        Execute: {new Date(milestone.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${milestone.status === MilestoneStatus.Completed ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                                milestone.status === MilestoneStatus.Delayed ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
                                            } border`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${milestone.status === MilestoneStatus.Completed ? 'bg-indigo-500' :
                                                    milestone.status === MilestoneStatus.Delayed ? 'bg-rose-500' : 'bg-zinc-400'
                                                }`} />
                                            {milestone.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-950/20">
                                <Activity className="text-zinc-200 dark:text-zinc-800 mb-6 drop-shadow-sm" size={64} />
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Zero Temporal Nodes Recorded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Risk Cluster */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 blur-[80px] -mr-20 -mt-20 rounded-full group-hover:scale-150 transition-transform duration-1000" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
                                    <AlertTriangle size={24} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white italic">Anomaly Cluster</h2>
                            </div>

                            {report.risks && report.risks.length > 0 ? (
                                <div className="space-y-5">
                                    {report.risks.map((risk, idx) => (
                                        <div key={idx} className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl group/risk hover:bg-rose-500/10 transition-all shadow-inner">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">{risk.impact} IMPACT</span>
                                                </div>
                                                <Badge variant="warning" className="text-[8px] tracking-[0.2em]">{risk.likelihood}</Badge>
                                            </div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-zinc-300 leading-relaxed pr-2 italic">{risk.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center flex flex-col items-center justify-center space-y-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 shadow-inner">
                                    <ShieldCheck size={48} className="text-emerald-500" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Integrity Verified: No Anomalies</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Strategic Intelligence Panel */}
                    <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-zinc-950/50">
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-60" />
                        <div className="absolute -bottom-10 -right-10 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Target size={240} />
                        </div>

                        <div className="relative z-10 space-y-12">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <Flag size={16} className="text-indigo-400" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Strategic Matrix</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="group/item">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-4 group-hover/item:text-indigo-400 transition-colors">Cluster Principal</p>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700 shadow-inner group-hover/item:border-indigo-500/30 transition-all">
                                                <User size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-xl tracking-tight italic uppercase">{report.owner?.name || 'INITIALIZING...'}</p>
                                                <p className="text-[10px] text-indigo-500 font-bold tracking-widest truncate max-w-[180px]">{report.owner?.contactInfo || 'PENDING SYNC'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-5 bg-zinc-800/40 rounded-3xl border border-zinc-700/50 shadow-inner backdrop-blur-sm">
                                            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mb-2">Origin</p>
                                            <p className="font-black text-sm tracking-tight">{report.projectStartDate ? new Date(report.projectStartDate).toLocaleDateString() : 'TBD'}</p>
                                        </div>
                                        <div className="p-5 bg-zinc-800/40 rounded-3xl border border-zinc-700/50 shadow-inner backdrop-blur-sm">
                                            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black mb-2">Horizon</p>
                                            <p className="font-black text-sm tracking-tight">{report.targetEndDate ? new Date(report.targetEndDate).toLocaleDateString() : 'TBD'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-4 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group/btn">
                                Generate Strategic Audit
                                <Zap size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, variant, className }: any) => {
    const variants: any = {
        warning: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${variants[variant] || variants.indigo} ${className}`}>
            {children}
        </span>
    );
};

const MetricBox = ({ icon: Icon, label, value, percent, isWarning, variant, subtitle }: any) => {
    const colorMap: any = {
        indigo: "indigo",
        emerald: "emerald",
        rose: "rose",
        amber: "amber"
    };
    const c = colorMap[variant] || "zinc";

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 group">
            <div className="flex items-center justify-between mb-10">
                <div className={`w-16 h-16 rounded-2xl bg-${c}-500/10 text-${c}-500 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner`}>
                    <Icon size={32} />
                </div>
                {percent !== undefined && (
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Saturation</p>
                        <span className={`text-3xl font-black text-${c}-500 tracking-tighter italic`}>{percent.toFixed(0)}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className={`text-4xl font-black tracking-tighter italic ${isWarning ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                        {value}
                    </p>
                    {subtitle && <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{subtitle}</span>}
                </div>
            </div>

            {percent !== undefined && (
                <div className="mt-10 w-full h-2 bg-gray-50 dark:bg-zinc-950 rounded-full overflow-hidden shadow-inner">
                    <div
                        className={`h-full bg-${c}-500 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_10px_rgba(var(--tw-color-${c}-500),0.3)]`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            )}
        </div>
    );
};

export default ProjectOverallReport;


