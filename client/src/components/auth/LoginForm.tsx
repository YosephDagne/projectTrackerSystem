"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "@/services/auth";
import { LoginRequest } from "@/types/login";
import {
    ShieldCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    Terminal,
    ChevronRight,
    Cpu,
    Fingerprint
} from "lucide-react";

interface Errors {
    email?: string;
    password?: string;
    general?: string;
}

const LoginForm = () => {
    const router = useRouter();
    const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isReturningUser, setIsReturningUser] = useState(false);

    useEffect(() => {
        const visitedBefore = sessionStorage.getItem("hasVisitedLogin");
        setIsReturningUser(!!visitedBefore);
        if (!visitedBefore) sessionStorage.setItem("hasVisitedLogin", "true");
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Errors = {};
        if (!form.email.trim()) newErrors.email = "Identity required.";
        if (!form.password.trim()) newErrors.password = "Access key required.";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await login(form);
            if (response.requiresPasswordChange) {
                router.push(`/change_password?userId=${response.userId}`);
            } else {
                localStorage.setItem("token", response.token);
                router.push("/dashboard");
            }
        } catch (err: any) {
            setErrors({ general: err.message || "Authentication aborted." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden font-inter">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Branding */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6"
                    >
                        <Terminal className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
                        PROJECT <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">TERMINAL</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em]">Secure Node Authentication</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900/50 backdrop-blur-3xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl -mr-16 -mt-16 rounded-full" />

                    <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                        <Fingerprint className="text-indigo-500" size={24} />
                        {isReturningUser ? "Welcome Back, Operative" : "Establish Identity"}
                    </h2>
                    <p className="text-zinc-400 text-sm font-medium mb-10">
                        {isReturningUser
                            ? "Re-initializing secure session parameters."
                            : "Authorize your credentials to access the terminal cluster."}
                    </p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <AnimatePresence>
                            {errors.general && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold"
                                >
                                    <ShieldCheck size={16} />
                                    {errors.general}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Universal Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="operative@terminal.io"
                                    className={`w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 outline-none transition-all ${errors.email ? 'border-rose-500/50' : ''}`}
                                />
                            </div>
                            {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                <label>Access Protocol</label>
                                {/* <button type="button" className="text-indigo-500 hover:text-indigo-400 transition-colors tracking-tighter">Recover Key?</button> */}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 outline-none transition-all ${errors.password ? 'border-rose-500/50' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group mt-4 h-14 overflow-hidden rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-indigo-600/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="relative flex items-center justify-center gap-3 text-white font-black text-sm uppercase tracking-widest">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Initialize Link
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer info */}
                    <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        <div className="flex items-center gap-2">
                            <Cpu size={12} className="text-indigo-500/50" />
                            Matrix v4.0.2
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500/50" />
                            Encrypted
                        </div>
                    </div>
                </div>

                {/* Global Footer Text */}
                <p className="mt-8 text-center text-zinc-600 text-xs font-bold leading-relaxed max-w-xs mx-auto">
                    Authorized personnel only. All access attempts are monitored and recorded by Protocol HQ.
                </p>
            </motion.div>
        </div>
    );
};

export default LoginForm;


