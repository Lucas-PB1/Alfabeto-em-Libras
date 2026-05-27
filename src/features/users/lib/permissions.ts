import type { UserProfile, UserRole } from "../types";

export function canAccessCms(profile: UserProfile | null) {
  return profile?.status === "approved";
}

export function canManageContent(profile: UserProfile | null) {
  return canAccessCms(profile) && Boolean(profile?.role && ["admin", "editor"].includes(profile.role));
}

export function canManageUsers(profile: UserProfile | null) {
  return canAccessCms(profile) && profile?.role === "admin";
}

export function roleLabel(role: UserRole) {
  return role === "admin" ? "Administrador" : "Editor";
}

export function statusLabel(status: UserProfile["status"]) {
  const labels = {
    approved: "Aprovado",
    blocked: "Bloqueado",
    pending: "Pendente",
  };

  return labels[status];
}
