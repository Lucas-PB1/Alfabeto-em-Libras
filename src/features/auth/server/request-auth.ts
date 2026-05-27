import { NextResponse } from "next/server";
import { getAdminAuth } from "@/shared/firebase/admin";
import type { UserRole } from "@/features/users/types";

export interface CmsRequestUser {
  uid: string;
  email?: string;
  role: UserRole;
}

export class CmsAuthError extends Error {
  constructor(
    message: string,
    public status = 401,
  ) {
    super(message);
  }
}

export async function requireCmsUser(request: Request, roles: UserRole[] = ["admin", "editor"]) {
  const token = getBearerToken(request);

  if (!token) {
    throw new CmsAuthError("Sessão não encontrada.");
  }

  const decodedToken = await getAdminAuth().verifyIdToken(token);
  const role = decodedToken.role as UserRole | undefined;

  if (decodedToken.cmsAccess !== true || !role || !roles.includes(role)) {
    throw new CmsAuthError("Acesso não autorizado.", 403);
  }

  return { uid: decodedToken.uid, email: decodedToken.email, role };
}

export function authErrorResponse(error: unknown) {
  if (error instanceof CmsAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Não foi possível validar a sessão." }, { status: 500 });
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  return scheme.toLowerCase() === "bearer" ? token : "";
}
