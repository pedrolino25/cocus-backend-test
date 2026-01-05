import { BranchResponse } from "./branches.types";

export interface GithubRepo {
  name: string;
  fork: boolean;
  owner: {
    login: string;
  };
}

export interface RepoResponse {
  repositoryName: string;
  ownerLogin: string;
  branches: BranchResponse[];
}