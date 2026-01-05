import { Router } from "express";
import { getUserReposWithBranchesController } from "../controllers/repos/repos.controller";

const router = Router();

/**
 * @swagger
 * /repos/{username}:
 *   get:
 *     summary: Get user GitHub repositories with branches
 *     description: Returns all repositories for a given GitHub username along with branch names and last commit SHA.
 *     tags:
 *       - Repositories
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub username
 *       - in: query
 *         name: includeForks
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to include forked repositories
 *     responses:
 *       200:
 *         description: List of repositories with branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   repositoryName:
 *                     type: string
 *                   ownerLogin:
 *                     type: string
 *                   branches:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         lastCommitSha:
 *                           type: string
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Not found
 *       406:
 *         description: Not Acceptable (wrong Accept header)
 *       500:
 *         description: Internal server error
 */
router.get("/:username", getUserReposWithBranchesController);

export default router;
