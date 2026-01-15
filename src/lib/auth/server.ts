import { getCurrentUser as _getUser } from "@/lib/auth";

/**
 * Server-only wrapper used by API routes / RSC.
 * Source of truth: getCurrentUser from @/lib/auth
 */
export async function getUserFromSessionServer() {
  return _getUser();
}
