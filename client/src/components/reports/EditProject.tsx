"use client";

import { OverallProjectStatus, ProjectDetailDto } from "@/types/projectDetail";
import { getProjectDetails, updateProjectStrategicDetails, } from "@/services/projectDetailApi";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import RiskList from "@/components/risk/RisksList";
import MilestonesList from "@/components/milestone/MilestonesList";
import { Terminal, Shield, User, Mail, Calendar, FileText, Save, Loader2, ArrowLeft, Cpu, Activity, Target, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface ProjectStrategicEditFormProps {
  projectId: string;
  onSaveSuccess?: () => void;
}

const ProjectStrategicEditForm: React.FC<ProjectStrategicEditFormProps> = ({
  projectId,
  onSaveSuccess,
}) => {
  const router = useRouter();
  const [projectData, setProjectData] = useState<ProjectDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [overallProjectStatus, setOverallProjectStatus] =
    useState<OverallProjectStatus>(OverallProjectStatus.Active);
  const [executiveSummary, setExecutiveSummary] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerContactInfo, setOwnerContactInfo] = useState<string>("");
  const [projectStartDate, setProjectStartDate] = useState<string>("");
  const [targetEndDate, setTargetEndDate] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [lead, setLead] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectDetails(projectId);
        if (data) {
          setProjectData(data);
          setOverallProjectStatus(data.overallProjectStatus);
          setExecutiveSummary(data.executiveSummary || "");
          setOwnerName(data.owner?.name || "");
          setOwnerContactInfo(data.owner?.contactInfo || "");
          setProjectStartDate(data.projectStartDate?.split("T")[0] || "");
          setTargetEndDate(data.targetEndDate?.split("T")[0] || "");
          setName(data.name);
          setDescription(data.description);
          setLead(data.lead);
        } else {
          setError("Project details not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectDetails();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const updateData = {
        name,
        description,
        leadName: lead,
        overallStatus: overallProjectStatus,
        executiveSummary,
        ownerName: ownerName || null,
        ownerContact: ownerContactInfo || null,
        projectStartDate: projectStartDate
          ? new Date(projectStartDate).toISOString()
          : null,
        targetEndDate: targetEndDate
          ? new Date(targetEndDate).toISOString()
          : null,
      };

      await updateProjectStrategicDetails(projectId, updateData);
      toast.success("Strategic directives synchronized.");
      onSaveSuccess?.();
    } catch (err: any) {
      toast.error(`Error saving details: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
      <Loader2 className="w-14 h-14 animate-spin text-indigo-500 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Loading strategic matrix...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn font-inter">
      {/* Premium Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-indigo-500 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
            <ArrowLeft size={20} />
          </div>
          Return to Registry
        </button>

        <div className="flex items-center gap-4 px-6 py-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
          <Shield size={16} className="text-indigo-500" />
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Strategic Authorization Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[3rem] p-12 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 text-indigo-500/5 rotate-12 transition-transform group-hover:scale-110 duration-1000">
              <Cpu size={240} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner border border-indigo-500/10">
                  <Target size={36} />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-tight">Strategic Configuration</h1>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mt-2">{name} ({projectData?.key})</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-10">
                {/* Meta Attributes (Read Only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50 shadow-inner">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Jira Global Lead</label>
                    <div className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-sm font-black text-zinc-700 dark:text-zinc-300 shadow-sm italic uppercase">
                      <User size={16} className="text-indigo-400" />
                      {lead || "INITIALIZING..."}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Archive Identity</label>
                    <div className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-sm font-black text-indigo-500 shadow-sm tracking-widest">
                      <Terminal size={16} />
                      {projectData?.key}
                    </div>
                  </div>
                </div>

                {/* Editable Section */}
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Lifecycle Status Protocol</label>
                      <div className="relative group/select">
                        <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/select:text-indigo-500 transition-colors" size={20} />
                        <select
                          className="w-full pl-14 pr-10 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all dark:text-white appearance-none cursor-pointer shadow-sm"
                          value={overallProjectStatus}
                          onChange={(e) => setOverallProjectStatus(e.target.value as OverallProjectStatus)}
                          disabled={isSaving}
                        >
                          {Object.values(OverallProjectStatus).map((value) => (
                            <option key={value} value={value} className="bg-zinc-900">
                              {value.replace(/([A-Z])/g, " $1").trim()}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover/select:text-indigo-500 transition-all">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Cluster Principal</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          disabled={isSaving}
                          placeholder="OPERATIVE IDENTITY"
                          className="w-full pl-14 pr-8 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] text-sm font-black focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all dark:text-white uppercase placeholder:text-zinc-700 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Principal Synch Protocol</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                          type="text"
                          value={ownerContactInfo}
                          onChange={(e) => setOwnerContactInfo(e.target.value)}
                          disabled={isSaving}
                          placeholder="BIO-SIGNAL / COMMS"
                          className="w-full pl-14 pr-8 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] text-sm font-black focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all dark:text-white uppercase placeholder:text-zinc-700 shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Origin (T-0)</label>
                        <input
                          type="date"
                          value={projectStartDate}
                          onChange={(e) => setProjectStartDate(e.target.value)}
                          disabled={isSaving}
                          className="w-full px-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] text-xs font-black focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all dark:text-white shadow-sm"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Horizon (End)</label>
                        <input
                          type="date"
                          value={targetEndDate}
                          onChange={(e) => setTargetEndDate(e.target.value)}
                          disabled={isSaving}
                          className="w-full px-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] text-xs font-black focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all dark:text-white shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Executive Directive (Brief)</label>
                    <div className="relative group">
                      <FileText className="absolute left-6 top-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                      <textarea
                        value={executiveSummary}
                        onChange={(e) => setExecutiveSummary(e.target.value)}
                        rows={6}
                        disabled={isSaving}
                        className="w-full pl-16 pr-8 py-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] text-base font-medium leading-relaxed focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all dark:text-white placeholder:text-zinc-600 shadow-sm shadow-inner"
                        placeholder="Define high-level mission directives, orbital achievements, and current sector anomalies..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      variant="primary"
                      className="px-12 py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 text-xs tracking-[0.3em] font-black uppercase h-auto"
                    >
                      {isSaving ? <Loader2 size={20} className="animate-spin mr-3" /> : <Save size={20} className="mr-3" />}
                      {isSaving ? "SYNCHRONIZING..." : "COMMIT DIRECTIVES"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[3rem] p-12 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-14 h-14 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10 shadow-inner">
                <Zap size={28} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Temporal Matrix</h2>
            </div>
            {projectData && (
              <MilestonesList
                projectId={projectId}
                milestones={projectData.milestones}
                onMilestoneChanged={() => getProjectDetails(projectId).then(setProjectData)}
              />
            )}
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[3rem] p-10 shadow-sm transition-all hover:shadow-xl hover:shadow-rose-500/5 group">
            <div className="flex items-center gap-5 mb-10 text-rose-500">
              <div className="w-14 h-14 rounded-[1.5rem] bg-rose-500/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Activity size={28} />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">Anomaly Registry</h2>
            </div>
            {projectData && (
              <RiskList
                projectId={projectId}
                risks={projectData.risks}
                onRiskChanged={() => getProjectDetails(projectId).then(setProjectData)}
              />
            )}
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/40">
            <div className="absolute -bottom-16 -right-16 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Shield size={240} />
            </div>
            <div className="relative z-10 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-200">System Integrity Hub</h3>
              <p className="text-xl font-black italic leading-tight">Ensure all strategic nodes are synchronized daily to maintain accurate foresight in the terminal registry.</p>
              <div className="pt-6">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">
                  <Target size={16} />
                  Operational Readiness
                </div>
                <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full w-4/5 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

const ChevronDown = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default ProjectStrategicEditForm;


