import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useGetJobQuery, useUpdateJobMutation } from "../api/jobApi";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading: jobLoading } = useGetJobQuery(id ?? "", {
    skip: !id,
  });
  const [updateJob, { isLoading }] = useUpdateJobMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: { type: "FULL_TIME" },
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        location: job.location ?? "",
        type: job.type as JobFormData["type"],
        salaryMin: job.salaryMin?.toString() ?? "",
        salaryMax: job.salaryMax?.toString() ?? "",
        skills: (job.skills ?? []).join(", "),
        experience: job.experience ?? "",
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    if (!id) return;
    try {
      await updateJob({
        id,
        data: {
          title: data.title,
          description: data.description,
          location: data.location || null,
          type: data.type,
          salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
          salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
          skills: data.skills
            ? data.skills.split(",").map((s) => s.trim())
            : [],
          experience: data.experience || null,
        },
      }).unwrap();
      toast.success("Job updated successfully");
      navigate("/my-jobs");
    } catch {
      toast.error("Failed to update job");
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg text-base focus:outline-none focus:border-secondary transition-colors";

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Job</h1>
      <form
        onSubmit={handleSubmit(onSubmit, () =>
          toast.error("Please fix the form errors."),
        )}
        className="space-y-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6"
      >
        {Object.keys(errors).length > 0 && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-4 text-sm">
            <p className="font-semibold mb-1">
              Please fix the following validation errors:
            </p>
            <ul className="list-disc pl-5 space-y-0.5">
              {Object.entries(errors).map(([key, err]) => (
                <li key={key}>
                  <strong>{key}:</strong> {err?.message || "Invalid value"}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">
            Job Title *
          </label>
          <input
            {...register("title")}
            className={inputClasses}
            placeholder="Senior Frontend Developer"
          />
          {errors.title && (
            <p className="text-xs text-error mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">
            Description *
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.description && (
            <p className="text-xs text-error mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">
              Location
            </label>
            <input
              {...register("location")}
              className={inputClasses}
              placeholder="Remote / New York, NY"
            />
          </div>
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">
              Type
            </label>
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
            <label className="text-sm font-medium tracking-wide block mb-1">
              Min Salary
            </label>
            <input
              {...register("salaryMin")}
              className={inputClasses}
              type="number"
              placeholder="80000"
            />
          </div>
          <div>
            <label className="text-sm font-medium tracking-wide block mb-1">
              Max Salary
            </label>
            <input
              {...register("salaryMax")}
              className={inputClasses}
              type="number"
              placeholder="120000"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">
            Skills (comma separated)
          </label>
          <input
            {...register("skills")}
            className={inputClasses}
            placeholder="React, TypeScript, Node.js"
          />
        </div>
        <div>
          <label className="text-sm font-medium tracking-wide block mb-1">
            Experience Required
          </label>
          <input
            {...register("experience")}
            className={inputClasses}
            placeholder="3-5 years"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-secondary text-on-secondary py-3 px-6 rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
