import { describe, expect, it } from "vitest";
import { canAccessCms, canManageContent, canManageUsers } from "./permissions";
import type { UserProfile } from "../types";

const baseUser: UserProfile = {
  id: "user-1",
  name: "Lucas",
  email: "lucas@example.com",
  photoUrl: "",
  role: "editor",
  status: "approved",
};

describe("CMS permissions", () => {
  it("allows approved editors to manage content only", () => {
    expect(canAccessCms(baseUser)).toBe(true);
    expect(canManageContent(baseUser)).toBe(true);
    expect(canManageUsers(baseUser)).toBe(false);
  });

  it("allows approved admins to manage users", () => {
    expect(canManageUsers({ ...baseUser, role: "admin" })).toBe(true);
  });

  it("blocks pending users from the CMS", () => {
    expect(canAccessCms({ ...baseUser, status: "pending" })).toBe(false);
  });
});
