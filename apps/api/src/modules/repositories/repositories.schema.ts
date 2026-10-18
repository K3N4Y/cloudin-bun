import { z } from "zod";
import type { NamespaceName, Repository } from "../../db/schema";

export const DEFAULT_BRANCH = "main";

export const REPO_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export const createRepositorySchema = z.object({
  name: z.string().regex(REPO_NAME_PATTERN, "Invalid repository name."),
});

export function artifactRemote(
  accountId: string | null,
  namespace: NamespaceName,
  name: string,
): string | null {
  return accountId ? `https://${accountId}.artifacts.cloudflare.net/git/${namespace}/${name}.git` : null;
}

export type RepositoryDto = {
  id: number;
  name: string;
  namespace: NamespaceName;
  owner_id: number;
  source_repo_id: number | null;
  parent_workspace_id: number | null;
  remote: string | null;
  default_branch: string;
  created_at: string;
};

export function toRepositoryDto(row: Repository): RepositoryDto {
  return {
    id: row.id,
    name: row.name,
    namespace: row.namespace,
    owner_id: row.ownerId,
    source_repo_id: row.sourceRepoId,
    parent_workspace_id: row.parentWorkspaceId,
    remote: row.remote,
    default_branch: row.defaultBranch,
    created_at: row.createdAt.toISOString(),
  };
}
