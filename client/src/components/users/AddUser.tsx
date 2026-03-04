"use client";

import { useEffect, useState, useRef } from "react";
import { RoleData } from "@/types/role";
import { fetchAllRoles } from "@/services/roleApi";
import { registerUser, fetchUserById, updateUser } from "@/services/userApi";
import { toast } from "react-toastify";
import { Search, X, User, Mail, Shield, Copy, Check, Fingerprint, Loader2, Key, Activity, Zap, ShieldCheck } from "lucide-react";
import { CreateUserDto, UpdateUserDto, AddUserProps } from "@/types/user";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const AddUser = ({ id, onClose, onCreate, onUpdate }: AddUserProps) => {
  const isEdit = Boolean(id);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });

  const [existingUserData, setExistingUserData] = useState<UpdateUserDto | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const allRoles = await fetchAllRoles();
        if (!isMounted) return;
        setRoles(allRoles);

        if (id) {
          const user = await fetchUserById(id);
          if (!isMounted) return;
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email || "",
            roles: user.roles || [],
          });
          setExistingUserData(user);
        }
      } catch {
        if (isMounted) toast.error("Data synchronization error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (roleName: string) => {
    setFormData((prev) => {
      const updatedRoles = prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName];
      return { ...prev, roles: updatedRoles };
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Credential copied to buffer");
    } catch {
      toast.error("Copy operation failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { firstName, lastName, email, roles } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || roles.length === 0) {
      toast.error("All authentication fields are mandatory");
      setSubmitting(false);
      return;
    }

    try {
      if (isEdit && id && existingUserData) {
        const updatePayload: UpdateUserDto = {
          firstName,
          lastName,
          email,
          roles,
          displayName: `${firstName} ${lastName}`,
          timeZone: existingUserData.timeZone || "UTC",
          isActive: existingUserData.isActive ?? true,
          location: existingUserData.location || "",
        };

        await updateUser(id, updatePayload);
        toast.success("Profile recalibrated successfully");
        onUpdate?.();
        onClose();
      } else {
        const createdUser = await registerUser(formData);
        if (createdUser.generatedPassword) {
          setGeneratedPassword(createdUser.generatedPassword);
        } else {
          toast.success("Onboarding protocol complete");
          onCreate?.({ username: `${firstName} ${lastName}`, email, role: roles.join(", ") });
          onClose();
        }
        setFormData({ firstName: "", lastName: "", email: "", roles: [] });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Protocol failure");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Syncing identity matrix...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeInUp">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Given Identity</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Victor"
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all dark:text-white dark:placeholder:text-zinc-600 shadow-inner"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Surname</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Stone"
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all dark:text-white dark:placeholder:text-zinc-600 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Primary Synch Endpoint</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEdit}
              placeholder="operative@terminal.io"
              className="w-full pl-12 pr-6 py-3.5 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all dark:text-white dark:placeholder:text-zinc-600 disabled:opacity-50 shadow-inner"
            />
          </div>
        </div>

        {/* Roles Selection */}
        <div className="space-y-2 relative" ref={dropdownRef}>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Access Credentials</label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full pl-4 pr-6 py-3.5 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm text-left flex items-center justify-between group transition-all hover:bg-white dark:hover:bg-zinc-800 shadow-inner"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <ShieldCheck size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <span className={formData.roles.length ? "text-gray-900 dark:text-white font-black" : "text-gray-400 font-bold"}>
                {formData.roles.length ? formData.roles.join(", ") : "Map security clearances..."}
              </span>
            </div>
            <X size={14} className={`text-gray-400 transform transition-transform duration-300 ${dropdownOpen ? 'rotate-90' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 w-full mt-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl rounded-3xl overflow-hidden animate-scaleIn origin-top">
              <div className="p-4 border-b border-gray-50 dark:border-zinc-800">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500" size={14} />
                  <input
                    type="text"
                    placeholder="Filter profiles..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-gray-900 dark:text-white shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                {filteredRoles.length ? filteredRoles.map(role => (
                  <button
                    key={role.roleId}
                    type="button"
                    onClick={() => handleRoleChange(role.name)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black transition-all group ${formData.roles.includes(role.name)
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Zap size={12} className={formData.roles.includes(role.name) ? "text-white" : "text-indigo-500"} />
                      {role.name}
                    </span>
                    {formData.roles.includes(role.name) && <Badge variant="indigo" className="bg-white/20 border-white/20 text-white">ACTIVE</Badge>}
                  </button>
                )) : <div className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">No clusters located.</div>}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all"
          >
            Abort
          </button>
          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="flex-1 rounded-2xl"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : isEdit ? "Synchronize" : "Onboard Operative"}
          </Button>
        </div>
      </form>

      {/* Access Key Overlay */}
      {generatedPassword && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl max-w-md w-full p-10 border border-white/10 dark:border-zinc-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 text-indigo-500/5 rotate-12 transition-transform group-hover:scale-110">
              <Fingerprint size={200} />
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto mb-8 shadow-inner">
                <Key size={36} />
              </div>
              <h2 className="text-2xl font-black mb-3 dark:text-white text-gray-900 tracking-tighter uppercase italic">Registry Key Forge</h2>
              <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
                Initial authentication hook generated. Provide this token to the operative for subsystem access.
              </p>

              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-700 mb-10 font-mono text-2xl font-black flex items-center justify-between group/key shadow-inner">
                <span className="text-indigo-600 dark:text-indigo-400 tracking-widest">{generatedPassword}</span>
                <button
                  onClick={() => copyToClipboard(generatedPassword)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-all text-zinc-400 hover:text-indigo-500 shadow-sm"
                >
                  {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                </button>
              </div>

              <button
                onClick={() => {
                  setGeneratedPassword(null);
                  toast.success("Protocol cycle complete");
                  onCreate?.({ username: `${formData.firstName} ${formData.lastName}`, email: formData.email, role: formData.roles.join(", ") });
                  onClose();
                }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                Seal & Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;


