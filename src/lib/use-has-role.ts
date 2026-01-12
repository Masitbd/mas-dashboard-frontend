import { useSession } from 'next-auth/react';
import type { Role } from '@/types/roles';
import { hasRole } from '@/lib/rbac';

export function useHasRole(required: Role | Role[]) {
  const { data } = useSession();
  const role = data?.user?.role as Role | undefined;
  return hasRole(role, required);
}
