import { getRepositoryBranchesRepository } from "../../repositories/branches/branches.repository";
import { getUserRepositoriesRepository } from "../../repositories/repos/repos.repository";
import { GithubBranch } from "../../types/branches.types";
import { GithubRepo } from "../../types/repo.types";
import { getUserReposWithBranchesService } from "./repos.service";


jest.mock("../../repositories/repos/repos.repository");
jest.mock("../../repositories/branches/branches.repository");

const mockGetUserRepositoriesRepository = getUserRepositoriesRepository as jest.Mock;
const mockGetRepositoryBranchesRepository = getRepositoryBranchesRepository as jest.Mock;

describe("getUserReposWithBranchesService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if username is empty", async () => {
    await expect(getUserReposWithBranchesService("")).rejects.toThrow(
      "Missing required parameter 'username'"
    );
  });

  it("should fetch user repositories and branches, includeForks=false filters forks", async () => {
    const mockRepos: GithubRepo[] = [
      { name: "repo1", fork: false, owner: { login: "pedrolino25" } },
      { name: "repo2", fork: true, owner: { login: "pedrolino25" } },
    ];

    const mockBranchesRepo1: GithubBranch[] = [
      { name: "main", commit: { sha: "abc123" } },
    ];

    mockGetUserRepositoriesRepository.mockResolvedValue(mockRepos);
    mockGetRepositoryBranchesRepository.mockResolvedValue(mockBranchesRepo1);

    const result = await getUserReposWithBranchesService("pedrolino25", false);

    // Should filter out forks
    expect(mockGetUserRepositoriesRepository).toHaveBeenCalledWith("pedrolino25");
    expect(mockGetRepositoryBranchesRepository).toHaveBeenCalledTimes(1);
    expect(mockGetRepositoryBranchesRepository).toHaveBeenCalledWith("pedrolino25", "repo1");

    expect(result).toEqual([
      {
        repositoryName: "repo1",
        ownerLogin: "pedrolino25",
        branches: [
          { name: "main", lastCommitSha: "abc123" }
        ]
      }
    ]);
  });

  it("should include forks if includeForks=true", async () => {
    const mockRepos: GithubRepo[] = [
      { name: "repo1", fork: false, owner: { login: "pedrolino25" } },
      { name: "repo2", fork: true, owner: { login: "pedrolino25" } },
    ];

    const mockBranchesRepo1: GithubBranch[] = [
      { name: "main", commit: { sha: "abc123" } },
    ];

    const mockBranchesRepo2: GithubBranch[] = [
      { name: "dev", commit: { sha: "def456" } },
    ];

    mockGetUserRepositoriesRepository.mockResolvedValue(mockRepos);
    mockGetRepositoryBranchesRepository
      .mockResolvedValueOnce(mockBranchesRepo1)
      .mockResolvedValueOnce(mockBranchesRepo2);

    const result = await getUserReposWithBranchesService("pedrolino25", true);

    expect(mockGetRepositoryBranchesRepository).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      {
        repositoryName: "repo1",
        ownerLogin: "pedrolino25",
        branches: [{ name: "main", lastCommitSha: "abc123" }],
      },
      {
        repositoryName: "repo2",
        ownerLogin: "pedrolino25",
        branches: [{ name: "dev", lastCommitSha: "def456" }],
      },
    ]);
  });

  it("should handle empty repos list", async () => {
    mockGetUserRepositoriesRepository.mockResolvedValue([]);
    const result = await getUserReposWithBranchesService("pedrolino25", true);
    expect(result).toEqual([]);
    expect(mockGetRepositoryBranchesRepository).not.toHaveBeenCalled();
  });
});
