import type UserRole from "./roles";

function verifyRole(role: string, requiredRole: UserRole[] | UserRole) {
  if (Array.isArray(requiredRole)) {
    if (requiredRole.includes(role as UserRole)) return true;
  } else {
    if (role === requiredRole) return true;
  }

  throw new Error("You are not authorized to perform this action");
}
