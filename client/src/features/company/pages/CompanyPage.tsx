import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from "../api/companyApi";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { setCredentials } from "../../auth/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import {
  Building2,
  Globe,
  MapPin,
  FileText,
  Loader2,
  Save,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const companyId = user?.companyId ?? null;
  const [localId, setLocalId] = useState<string | null>(null);
  const effectiveId = companyId ?? localId;

  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
  } = useGetCompanyQuery(effectiveId!, { skip: !effectiveId });
  const [createCompany, { isLoading: creating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: updating }] = useUpdateCompanyMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        location: company.location || "",
      });
    }
  }, [company, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      if (effectiveId) {
        await updateCompany({ id: effectiveId, data }).unwrap();
        toast.success("Company updated successfully!");
      } else {
        const result = await createCompany(data).unwrap();
        setLocalId(result.id);
        if (user) {
          dispatch(setCredentials({ user: { ...user, companyId: result.id } }));
        }
        toast.success("Company created successfully!");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? ((err as { data: { message?: string } }).data?.message ??
            "Operation failed")
          : "Operation failed";
      toast.error(message);
    }
  };

  const input =
    "w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg text-base outline-none focus:border-secondary transition-colors";
  const label = "text-sm font-semibold text-on-surface-variant mb-1.5 block";

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <span className="bg-secondary/10 p-2.5 rounded-xl">
            <Building2 className="text-secondary" size={28} />
          </span>
          {effectiveId ? "My Company" : "Create Your Company"}
        </h1>
        <p className="text-base text-on-surface-variant mt-2 ml-2">
          {effectiveId
            ? "Update your company profile to attract top talent."
            : "Set up your company profile to start posting jobs."}
        </p>
      </div>

      {/* Error banner */}
      {companyError && (
        <div className="mb-6 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium">
          Failed to load company data. Please try again.
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
      >
        {/* Name */}
        <div>
          <label className={label}>
            <Building2 size={16} className="inline mr-1.5 -mt-0.5" />
            Company Name <span className="text-error">*</span>
          </label>
          <input
            {...register("name")}
            className={input}
            placeholder="e.g. Acme Inc."
          />
          {errors.name && (
            <p className="text-xs text-error mt-1 ml-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={label}>
            <FileText size={16} className="inline mr-1.5 -mt-0.5" />
            Description
          </label>
          <textarea
            {...register("description")}
            className={`${input} min-h-[100px] resize-y`}
            placeholder="Tell candidates what your company does, your mission, culture..."
          />
        </div>

        {/* Website + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={label}>
              <Globe size={16} className="inline mr-1.5 -mt-0.5" />
              Website
            </label>
            <input
              {...register("website")}
              className={input}
              placeholder="https://acme.com"
            />
            {errors.website && (
              <p className="text-xs text-error mt-1 ml-1">
                {errors.website.message}
              </p>
            )}
          </div>
          <div>
            <label className={label}>
              <MapPin size={16} className="inline mr-1.5 -mt-0.5" />
              Location
            </label>
            <input
              {...register("location")}
              className={input}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={creating || updating}
            className="flex items-center justify-center gap-2 bg-secondary text-on-secondary py-3 px-8 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(8,90,192,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {creating || updating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : effectiveId ? (
              <>
                <Save size={18} /> Update Company
              </>
            ) : (
              <>
                <Plus size={18} /> Create Company
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
