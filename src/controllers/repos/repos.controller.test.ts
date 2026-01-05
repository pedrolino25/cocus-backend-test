import { NextFunction, Request, Response } from "express";
import { getUserReposWithBranchesController } from "./repos.controller";
import { ApiError } from "../../utils/errors/api-error";
import { ErrorCodes, ErrorMessages } from "../../utils/errors/error.enums";
import { getUserReposWithBranchesService } from "../../services/repos/repos.service";


jest.mock("../../services/repos/repos.service");

describe("getUserReposWithBranchesController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    mockNext = jest.fn();

    mockRes = {
      json: jsonMock,
    };
  });

  it("should call next with ApiError if Accept header is invalid", async () => {
    mockReq = {
      headers: { accept: "text/html" },
      params: { username: "pedrolino25" },
      query: {},
    };

    await getUserReposWithBranchesController(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(1);
    const error = mockNext.mock.calls[0][0];

    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as unknown as ApiError;

    expect(apiError.status).toBe(406);
    expect(apiError.code).toBe(ErrorCodes.InvalidAcceptHeader);
    expect(apiError.message).toBe(ErrorMessages.InvalidAcceptHeader);
  });

  it("should call next with ApiError if includeForks query is invalid", async () => {
    mockReq = {
      headers: { accept: "application/json" },
      params: { username: "pedrolino25" },
      query: { includeForks: "test" },
    };

    await getUserReposWithBranchesController(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    const error = mockNext.mock.calls[0][0];

    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as unknown as ApiError;

    expect(apiError.status).toBe(400);
    expect(apiError.code).toBe(ErrorCodes.InvalidQueryParameter);
    expect(apiError.message).toBe(
      ErrorMessages.InvalidQueryParameter
        .replace("$1", "includeForks")
        .replace("$2", "boolean (true or false)")
    );
  });

  it("should call next with ApiError if username is missing or empty", async () => {
    mockReq = {
      headers: { accept: "application/json" },
      params: { username: "" },
      query: {},
    };

    await getUserReposWithBranchesController(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as unknown as ApiError;

    expect(apiError.status).toBe(400);
    expect(apiError.code).toBe(ErrorCodes.MissingParameter);
    expect(apiError.message).toBe(
      ErrorMessages.MissingParameter.replace("$1", "username")
    );
  });

  it("should call service and return JSON when includeForks is true", async () => {
    const mockData = [
      {
        repositoryName: "repo1",
        ownerLogin: "pedrolino25",
        branches: [{ name: "main", lastCommitSha: "abc123" }],
      },
    ];

    (getUserReposWithBranchesService as jest.Mock).mockResolvedValueOnce(mockData);

    mockReq = {
      headers: { accept: "application/json" },
      params: { username: "pedrolino25" },
      query: { includeForks: "true" },
    };

    await getUserReposWithBranchesController(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(getUserReposWithBranchesService).toHaveBeenCalledWith("pedrolino25", true);
    expect(jsonMock).toHaveBeenCalledWith(mockData);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should default includeForks to false when not provided", async () => {
    const mockData = [
      {
        repositoryName: "repo2",
        ownerLogin: "pedrolino25",
        branches: [{ name: "dev", lastCommitSha: "def456" }],
      },
    ];

    (getUserReposWithBranchesService as jest.Mock).mockResolvedValueOnce(mockData);

    mockReq = {
      headers: { accept: "application/json" },
      params: { username: "pedrolino25" },
      query: {},
    };

    await getUserReposWithBranchesController(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(getUserReposWithBranchesService).toHaveBeenCalledWith("pedrolino25", false);
    expect(jsonMock).toHaveBeenCalledWith(mockData);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
