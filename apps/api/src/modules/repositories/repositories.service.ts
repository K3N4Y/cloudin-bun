import type { NamespaceName, RoleName } from "../../db/schema";
import { artifactsAccountId } from "../../env";
import type { PublicUser } from "../users/users.schema";
import * as repositoriesRepo from "./repositories.repo";
import {
  artifactRemote,
  DEFAULT_BRANCH,
  toRepositoryDto,
  type RepositoryDto,
} from "./repositories.schema";

export type NamespaceRule = {
  readonly createRoles: readonly RoleName[];
  readonly forkFrom: readonly NamespaceName[] | null;
};

export const NAMESPACE_RULES: Record<NamespaceName, NamespaceRule> = {
  prod: { createRoles: ["admin", "moderator"], forkFrom: null },
  staging: { createRoles: ["admin", "moderator"], forkFrom: ["prod", "staging"] },
  workspace: { createRoles: ["admin", "moderator", "user"], forkFrom: ["prod", "staging"] },
  agents: { createRoles: [], forkFrom: ["workspace", "staging", "prod"] },
};

export type CreateRepositoryCommand = {
  actor: PublicUser;
  namespace: NamespaceName;
  name: string;
};

export type CreateRepositoryFailure = "forbidden" | "name_conflict";

export type CreateRepositoryOutcome =
  | { ok: true; repo: RepositoryDto }
  | { ok: false; reason: CreateRepositoryFailure };

export async function createRepository(input: CreateRepositoryCommand): Promise<CreateRepositoryOutcome> {
  const { actor, namespace, name } = input;

  const roleName = await repositoriesRepo.findRoleName(actor.roleId);
  if (!roleName || !NAMESPACE_RULES[namespace].createRoles.includes(roleName)) {
    return { ok: false, reason: "forbidden" };
  }

  const inserted = await repositoriesRepo.insertRepository({
    name,
    namespace,
    ownerId: actor.id,
    sourceRepoId: null,
    parentWorkspaceId: null,
    remote: artifactRemote(artifactsAccountId, namespace, name),
    defaultBranch: DEFAULT_BRANCH,
  });
  if (!inserted.ok) return { ok: false, reason: inserted.reason };

  return { ok: true, repo: toRepositoryDto(inserted.repo) };
}
