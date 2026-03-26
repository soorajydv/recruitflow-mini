import Candidate, { ICandidate } from "./candidate.model";
import User from "../auth/user.model";

export interface IQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

const createCandidate = async (data: Partial<ICandidate>) => {
  return await Candidate.create(data);
};

const getAllCandidates = async (options: IQueryOptions) => {
  const { page = 1, limit = 10, search, sortBy = "createdAt", order = "desc", status } = options;

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const candidates = await Candidate.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Candidate.countDocuments(query);

  return {
    candidates,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCandidateById = async (id: string) => {
  return await Candidate.findById(id);
};

const updateCandidate = async (id: string, data: Partial<ICandidate>) => {
  return await Candidate.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteCandidate = async (id: string) => {
  return await Candidate.findByIdAndDelete(id);
};

const bulkCreateCandidates = async (data: any[]) => {
  return await Candidate.insertMany(data);
};

const seedDefaultAdmin = async (adminData: any) => {
  const existing = await User.findOne({ email: adminData.email });
  if (!existing) {
    return await User.create(adminData);
  }
  return existing;
};

export const CandidateService = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  bulkCreateCandidates,
  seedDefaultAdmin,
};
