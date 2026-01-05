import { GITHUB_API } from "../../consts/api";
import { GithubRepo } from "../../types/repo.types";
import { getUserRepositoriesRepository } from "./repos.repository";


global.fetch = jest.fn();

describe("getUserRepositoriesRepository", () => {
  const mockUsername = "pedrolino25";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if username is empty", async () => {
    await expect(getUserRepositoriesRepository("")).rejects.toThrow(
      "Missing required parameter 'username'"
    );
  });

  it("should call fetch with correct URL and headers", async () => {
    const mockResponse: GithubRepo[] = [
      { name: "example", fork: false, owner: { login: mockUsername } },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getUserRepositoriesRepository(mockUsername);

    expect(fetch).toHaveBeenCalledWith(
      `${GITHUB_API}/users/${mockUsername}/repos`,
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

    await expect(getUserRepositoriesRepository(mockUsername)).rejects.toThrow("External service returned an error");
  });
});
