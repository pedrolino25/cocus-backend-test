import { GITHUB_API } from "../../consts/api";
import { GithubBranch } from "../../types/branches.types";
import { getRepositoryBranchesRepository } from "./branches.repository";

global.fetch = jest.fn();

describe("getRepositoryBranchesRepository", () => {
  const mockOwner = "pedrolino25";
  const mockRepo = "example";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if owner is empty", async () => {
    await expect(getRepositoryBranchesRepository("", mockRepo)).rejects.toThrow(
      "Missing required parameter 'owner'"
    );
  });

  it("should throw error if repo is empty", async () => {
    await expect(getRepositoryBranchesRepository(mockOwner, "")).rejects.toThrow(
      "Missing required parameter 'repo'"
    );
  });

  it("should call fetch with correct URL and headers", async () => {
    const mockResponse: GithubBranch[] = [
      { name: "main", commit: { sha: "abc123" } },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getRepositoryBranchesRepository(mockOwner, mockRepo);

    expect(fetch).toHaveBeenCalledWith(
      `${GITHUB_API}/repos/${mockOwner}/${mockRepo}/branches`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should throw error if fetch returns non-ok response", async () => {
    const errorBody = "Not Found";

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => errorBody,
    });

    await expect(getRepositoryBranchesRepository(mockOwner, mockRepo)).rejects.toThrow("External service returned an error");
  });
});
