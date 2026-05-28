import { NextResponse } from "next/server";
import { FirebaseAuthError } from "firebase-admin/auth";
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

  const decodedToken = await verifyCmsToken(token);
  const role = decodedToken.role as UserRole | undefined;

  if (decodedToken.cmsAccess !== true || !role || !roles.includes(role)) {
    throw new CmsAuthError("Acesso não autorizado. Entre novamente para atualizar suas permissões.", 403);
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

async function verifyCmsToken(token: string) {
  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch (error) {
    console.error("CMS token verification failed", getSafeAuthError(error));
    throw mapTokenVerificationError(error);
  }
}

function mapTokenVerificationError(error: unknown) {
  if (error instanceof FirebaseAuthError) {
    if (error.code === "auth/id-token-expired") {
      return new CmsAuthError("Sessão expirada. Entre novamente no CMS.", 401);
    }

    if (error.code === "auth/argument-error") {
      return new CmsAuthError("Token inválido para este projeto Firebase. Confira se NEXT_PUBLIC_FIREBASE_PROJECT_ID e FIREBASE_PROJECT_ID são iguais no deploy.", 401);
    }

    if (error.code === "auth/invalid-credential") {
      return new CmsAuthError("Firebase Admin não está configurado corretamente no deploy.", 500);
    }
  }

  return new CmsAuthError("Não foi possível validar a sessão. Entre novamente no CMS.", 401);
}

function getSafeAuthError(error: unknown) {
  if (error instanceof FirebaseAuthError) {
    return { code: error.code, message: error.message };
  }

  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }

  return { message: "Unknown auth error" };
}
