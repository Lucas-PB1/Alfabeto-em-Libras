export type UserRole = "admin" | "editor";

export type UserStatus = "pending" | "approved" | "blocked";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsClaims {
  cmsAccess: boolean;
  role: UserRole;
}
