import express, { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { CandidateController } from "./candidate.controller";
import { createCandidateSchema, updateCandidateSchema } from "./candidate.validation";

const router = express.Router();

const validate = (schema: ZodObject<any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors,
    });
  }
};

router.post("/", validate(createCandidateSchema), CandidateController.createCandidate);
router.post("/seed", CandidateController.seedCandidates);
router.get("/", CandidateController.getAllCandidates);
router.get("/:id", CandidateController.getCandidateById);
router.patch("/:id", validate(updateCandidateSchema), CandidateController.updateCandidate);
router.delete("/:id", CandidateController.deleteCandidate);

export default router;
