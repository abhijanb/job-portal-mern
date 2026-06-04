import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormData } from "../../../shared/schemas/auth";
import { useLogin } from "../hooks/useLogin";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { login, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      const apiError = err as FetchBaseQueryError | SerializedError;
      const message = "data" in apiError
        ? ((apiError.data as { message?: string })?.message ?? "Invalid credentials")
        : "Invalid credentials";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <p className="text-sm text-error text-center bg-error-container/20 py-2 px-3 rounded-lg">{errors.root.message}</p>
      )}

      <div className="space-y-1">
        <label className="text-on-surface text-sm font-medium tracking-wide block" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors" size={20} />
          <input
            {...register("email")}
            className="w-full h-12 pl-12 pr-4 bg-surface border border-outline-variant rounded-lg text-base outline-none focus:border-secondary transition-colors"
            id="email"
            placeholder="alex@company.com"
            type="email"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-on-surface text-sm font-medium tracking-wide block" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors" size={20} />
          <input
            {...register("password")}
            className="w-full h-12 pl-12 pr-12 bg-surface border border-outline-variant rounded-lg text-base outline-none focus:border-secondary transition-colors"
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-error">{errors.password.message}</p>
        )}
      </div>

      <button
        className="w-full h-12 bg-secondary text-on-secondary rounded-lg text-sm font-bold tracking-wide hover:bg-secondary-container transition-all active:scale-[0.98] shadow-sm disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
