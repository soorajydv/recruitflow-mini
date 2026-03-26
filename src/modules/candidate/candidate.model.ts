import mongoose, { Schema, Document } from "mongoose";

export enum CandidateStatus {
  Applied = "Applied",
  Interview = "Interview",
  Hired = "Hired",
  Rejected = "Rejected",
}

export interface ICandidate extends Document {
  name: string;
  email: string;
  position: string;
  status: CandidateStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    position: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(CandidateStatus),
      default: CandidateStatus.Applied,
    },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Index for search
CandidateSchema.index({ name: "text", email: "text" });

export default mongoose.models.Candidate || mongoose.model<ICandidate>("Candidate", CandidateSchema);
