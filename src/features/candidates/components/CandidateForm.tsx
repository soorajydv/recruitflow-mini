import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Candidate } from "../../../services/candidateApi";

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  status: z.enum(["Applied", "Interview", "Hired", "Rejected"]),
  notes: z.string().optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  initialData?: Candidate;
  onSubmit: (data: CandidateFormData) => void;
  isLoading?: boolean;
}

export const CandidateForm = ({ initialData, onSubmit, isLoading }: CandidateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      position: "",
      status: "Applied",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="e.g. John Doe"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email Address"
        placeholder="e.g. john@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Position"
        placeholder="e.g. Frontend Developer"
        {...register("position")}
        error={errors.position?.message}
      />
      <Select
        label="Status"
        options={[
          { label: "Applied", value: "Applied" },
          { label: "Interview", value: "Interview" },
          { label: "Hired", value: "Hired" },
          { label: "Rejected", value: "Rejected" },
        ]}
        {...register("status")}
        error={errors.status?.message}
      />
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
          rows={3}
          placeholder="Add internal notes..."
          {...register("notes")}
        ></textarea>
      </div>
      <div className="pt-2">
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {initialData ? "Update Candidate" : "Add Candidate"}
        </Button>
      </div>
    </form>
  );
};
