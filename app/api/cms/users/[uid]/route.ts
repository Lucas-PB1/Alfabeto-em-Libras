import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireCmsUser, authErrorResponse } from "@/features/auth/server/request-auth";
import { userUpdateSchema } from "@/features/users/lib/schemas";
import { getAdminAuth, getAdminDb } from "@/shared/firebase/admin";
import type { UserRole, UserStatus } from "@/features/users/types";

interface RouteContext {
  params: Promise<{ uid: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const admin = await requireCmsUser(request, ["admin"]);
    const { uid } = await context.params;
    const body = userUpdateSchema.parse(await request.json());
    const current = await getAdminDb().collection("users").doc(uid).get();
    const role = (body.role ?? current.get("role") ?? "editor") as UserRole;
    const status = (body.status ?? current.get("status") ?? "pending") as UserStatus;

    await getAdminDb().collection("users").doc(uid).set({
      ...body,
      approvedAt: status === "approved" ? FieldValue.serverTimestamp() : current.get("approvedAt") ?? null,
      approvedBy: status === "approved" ? admin.uid : current.get("approvedBy") ?? "",
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    await getAdminAuth().setCustomUserClaims(uid, {
      cmsAccess: status === "approved",
      role,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados de usuário inválidos." }, { status: 400 });
    }

    return authErrorResponse(error);
  }
}
