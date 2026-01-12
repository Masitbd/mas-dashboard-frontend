import type { Role } from '@/types/roles';

export function hasRole(userRole: Role | undefined, required: Role | Role[]) {
  if (!userRole) {
    return false;
  }
  if (Array.isArray(required)) {
    return required.includes(userRole);
  }
  return userRole === required;
}
