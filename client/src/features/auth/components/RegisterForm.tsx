import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock } from "lucide-react";
import { registerSchema, type RegisterFormData } from "../../../shared/schemas/auth";
import { useRegister } from "../hooks/useRegister";
import toast from "react-hot-toast";

interface RegisterFormProps {
  role: "candidate" | "employer";
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const { register: registerUser, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({ ...data, role });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? ((err as { data: { message?: string } }).data?.message ?? "Registration failed")
          : "Registration failed";
      toast.error(message);
    }
  };

  const inputClasses =
    "w-full pl-8 pr-4 py-3 bg-white border border-outline-variant rounded-lg text-base focus:outline-none focus:border-secondary transition-colors";

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <label className="text-on-surface text-sm font-medium tracking-wide block" htmlFor="name">
          Full Name
        </label>
        <div className="relative soft-glow rounded-lg">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant transition-colors" size={20} />
          <input
            {...register("name")}
            className={inputClasses}
            id="name"
            placeholder="Jane Doe"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-error">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-on-surface text-sm font-medium tracking-wide block" htmlFor="email">
          Email Address
        </label>
        <div className="relative soft-glow rounded-lg">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant transition-colors" size={20} />
          <input
            {...register("email")}
            className={inputClasses}
            id="email"
            placeholder="jane@example.com"
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
        <div className="relative soft-glow rounded-lg">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant transition-colors" size={20} />
          <input
            {...register("password")}
            className={inputClasses}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        {errors.password ? (
          <p className="text-xs text-error">{errors.password.message}</p>
        ) : (
          <p className="text-xs text-on-surface-variant">Must be at least 8 characters with one number.</p>
        )}
      </div>

      <button
        className="w-full bg-secondary text-on-secondary py-4 rounded-lg text-sm font-medium tracking-wide font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-md mt-3 disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
