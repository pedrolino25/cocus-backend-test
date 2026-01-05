import { GITHUB_API } from "../../consts/api";
import { ApiError } from "../../utils/errors/api-error";
import { ErrorCodes, ErrorMessages } from "../../utils/errors/error.enums";
import { GithubRepo } from "../../types/repo.types";
import { isEmptyString } from "../../utils/validations/validations";

export async function getUserRepositoriesRepository(username: string): Promise<GithubRepo[]> {

  if (isEmptyString(username)) {
    throw new ApiError(500, ErrorCodes.MissingParameter, ErrorMessages.MissingParameter.replace('$1', 'username'));
  }

  const response = await fetch(
    `${GITHUB_API}/users/${username}/repos`,
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
