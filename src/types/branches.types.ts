export interface GithubBranch {
  name: string;
  commit: {
    sha: string;
  };
}

export interface BranchResponse {
  name: string;
  lastCommitSha: string;
}