import { Router } from "express";
import { getUserReposWithBranchesController } from "../controllers/repos/repos.controller";

const router = Router();

router.get("/:username", getUserReposWithBranchesController);

export default router;
