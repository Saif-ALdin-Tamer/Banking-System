import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { register: registerField, handleSubmit, formState: { isSubmitting, errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data) => {
    try {
      setApiError("");
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0eef6] flex items-center justify-center p-6 w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <LogIn size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">Welcome back</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your Bank account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-7">
          {apiError && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-500 rounded-lg text-sm text-center font-medium border border-rose-100">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <div className="flex items-center gap-3 bg-[#f0eef6] px-4 py-3.5 rounded-xl focus-within:ring-2 focus-within:ring-violet-300 focus-within:bg-white transition-all">
                <Mail className="text-violet-400" size={18} />
                <input {...registerField("email", { required: "Email is required" })} type="email" placeholder="Enter your email"
                  className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" />
              </div>
              {errors.email && <span className="text-rose-500 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="flex items-center gap-3 bg-[#f0eef6] px-4 py-3.5 rounded-xl focus-within:ring-2 focus-within:ring-violet-300 focus-within:bg-white transition-all">
                <Lock className="text-violet-400" size={18} />
                <input {...registerField("password", { required: "Password is required" })} type="password" placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium tracking-widest" />
              </div>
              {errors.password && <span className="text-rose-500 text-xs mt-1 block">{errors.password.message}</span>}
            </div>

            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={isSubmitting}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Sign In"}
            </motion.button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Don't have an account? </span>
          <Link to="/register" className="text-slate-800 font-semibold hover:underline">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
