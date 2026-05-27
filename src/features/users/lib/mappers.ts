import { toIsoDate } from "@/shared/lib/firestore-date";
import type { UserProfile } from "../types";

interface UserDoc {
  name?: string;
  email?: string;
  photoUrl?: string;
  role?: UserProfile["role"];
  status?: UserProfile["status"];
  lastLoginAt?: unknown;
  approvedAt?: unknown;
  approvedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function mapUserDoc(id: string, data: UserDoc): UserProfile {
  return {
    id,
    name: data.name ?? "Usuário",
    email: data.email ?? "",
    photoUrl: data.photoUrl ?? "",
    role: data.role ?? "editor",
    status: data.status ?? "pending",
    lastLoginAt: toIsoDate(data.lastLoginAt),
    approvedAt: toIsoDate(data.approvedAt),
    approvedBy: data.approvedBy,
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}
