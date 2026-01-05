import { ApiError } from "../../utils/errors/api-error";
import { ErrorCodes, ErrorMessages } from "../../utils/errors/error.enums";
import { getRepositoryBranchesRepository } from "../../repositories/branches/branches.repository";
import { getUserRepositoriesRepository } from "../../repositories/repos/repos.repository";
import { GithubBranch } from "../../types/branches.types";
import { GithubRepo, RepoResponse } from "../../types/repo.types";
import { isEmptyString } from "../../utils/validations/validations";

export async function getUserReposWithBranchesService(username: string, includeForks?: boolean): Promise<RepoResponse[]> {
  
  if (isEmptyString(username)) {
    throw new ApiError(500, ErrorCodes.MissingParameter, ErrorMessages.MissingParameter.replace('$1', 'username'));
  }

  let repos = await getUserRepositoriesRepository(username);

  if (!includeForks) {
    repos = repos.filter((repo: GithubRepo) => !repo.fork);
  }

  return Promise.all(
    repos.map(async (repo: GithubRepo): Promise<RepoResponse> => {
      const branchesList = await getRepositoryBranchesRepository(repo.owner.login, repo.name);
      return { 
        repositoryName: repo.name, 
        ownerLogin: repo.owner.login, 
        branches: branchesList.map((branch: GithubBranch) => ({ 
          name: branch.name, 
          lastCommitSha: branch.commit.sha 
        }))
      };
    })
  );
}