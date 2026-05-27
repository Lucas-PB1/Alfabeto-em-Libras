import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireCmsUser, authErrorResponse } from "@/features/auth/server/request-auth";
import { profileUpdateSchema } from "@/features/users/lib/schemas";
import { getAdminDb } from "@/shared/firebase/admin";

export async function PATCH(request: Request) {
  try {
    const user = await requireCmsUser(request);
    const body = profileUpdateSchema.parse(await request.json());

    await getAdminDb().collection("users").doc(user.uid).set({
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados de perfil inválidos." }, { status: 400 });
    }

    return authErrorResponse(error);
  }
}
