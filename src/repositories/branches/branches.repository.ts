import { GITHUB_API } from "../../consts/api";
import { ApiError } from "../../utils/errors/api-error";
import { ErrorCodes, ErrorMessages } from "../../utils/errors/error.enums";
import { GithubBranch } from "../../types/branches.types";
import { isEmptyString } from "../../utils/validations/validations";

export async function getRepositoryBranchesRepository(
  owner: string,
  repo: string
): Promise<GithubBranch[]> {

  if (isEmptyString(owner)) {
    throw new ApiError(500, ErrorCodes.MissingParameter, ErrorMessages.MissingParameter.replace('$1', 'owner'));
  }

  if (isEmptyString(repo)) {
    throw new ApiError(500, ErrorCodes.MissingParameter, ErrorMessages.MissingParameter.replace('$1', 'repo'));
  }

  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/branches`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new ApiError(response.status, ErrorCodes.ExternalServiceError, ErrorMessages.ExternalServiceError);
  }

  return response.json();
}