import { Request, Response, NextFunction } from "express";
import { CandidateService } from "./candidate.service";
import { nepaliCandidates, defaultAdmin } from "./candidate.seed";

const createCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CandidateService.createCandidate(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      order: req.query.order as "asc" | "desc",
      status: req.query.status as string,
    };
    const result = await CandidateService.getAllCandidates(options);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CandidateService.getCandidateById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CandidateService.updateCandidate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CandidateService.deleteCandidate(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    res.status(200).json({ success: true, message: "Candidate deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const seedCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CandidateService.seedDefaultAdmin(defaultAdmin);
    const result = await CandidateService.bulkCreateCandidates(nepaliCandidates);
    res.status(201).json({ success: true, message: "Admin and 20 Nepali candidates seeded successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const CandidateController = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  seedCandidates,
};
