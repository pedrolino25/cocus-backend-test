import { Request, Response, NextFunction } from "express";
import { getUserReposWithBranchesService } from "../../services/repos/repos.service";
import { ApiError } from "../../utils/errors/api-error";
import { ErrorCodes, ErrorMessages } from "../../utils/errors/error.enums";
import { isEmptyString } from "../../utils/validations/validations";

export async function getUserReposWithBranchesController(req: Request, res: Response, next: NextFunction) {

  try {
    const { username } = req.params;
    const { includeForks } = req.query;

    if (req.headers.accept !== "application/json") {
      throw new ApiError(406, ErrorCodes.InvalidAcceptHeader, ErrorMessages.InvalidAcceptHeader);
    }
  
    if (includeForks && includeForks !== 'true' && includeForks !== 'false'){
      throw new ApiError(400, ErrorCodes.InvalidQueryParameter, ErrorMessages.InvalidQueryParameter.replace('$1', 'includeForks').replace('$2', 'boolean (true or false)'));
    }

    if (isEmptyString(username)) {
      throw new ApiError(400, ErrorCodes.MissingParameter, ErrorMessages.MissingParameter.replace('$1', 'username'));
    }
  
    const result = await getUserReposWithBranchesService(username, includeForks === 'true');
    res.json(result);
  } catch (error) {
    next(error);
  }
}