import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useCreateJobMutation } from "../api/jobApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import RichEditor from "../components/RichEditor";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createJob, { isLoading }] = useCreateJobMutation();
  const { register, handleSubmit, control, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: { type: "FULL_TIME" },
  });

  const onSubmit = async (data: JobFormData) => {
    if (!user?.companyId) {
      toast.error("You need to create a company first");
      return;
    }
    try {
      await createJob({
        ...data,
        companyId: user.companyId,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
        skills: data.skills ? data.skills.split(",").map((s: string) => s.trim()) : [],
      }).unwrap();
      toast.success("Job created successfully");
      navigate("/my-jobs");
    } catch {
      toast.error("Failed to create job");
    }
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg text-base focus:outline-none focus:border-secondary transition-colors";

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">Job Title *</label>
          <input {...register("title")} className={inputClasses} placeholder="Senior Frontend Developer" />
          {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">Description *</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichEditor
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">Location</label>
            <input {...register("location")} className={inputClasses} placeholder="Remote / New York, NY" />
          </div>
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">Type</label>
            <select {...register("type")} className={inputClasses}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">Min Salary</label>
            <input {...register("salaryMin")} className={inputClasses} type="number" placeholder="80000" />
          </div>
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">Max Salary</label>
            <input {...register("salaryMax")} className={inputClasses} type="number" placeholder="120000" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">Skills (comma separated)</label>
          <input {...register("skills")} className={inputClasses} placeholder="React, TypeScript, Node.js" />
        </div>
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">Experience Required</label>
          <input {...register("experience")} className={inputClasses} placeholder="3-5 years" />
        </div>
        <button type="submit" disabled={isLoading} className="bg-secondary text-on-secondary py-3 px-6 rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60">
          {isLoading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
