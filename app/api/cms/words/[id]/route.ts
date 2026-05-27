import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireCmsUser, authErrorResponse } from "@/features/auth/server/request-auth";
import { wordPatchSchema } from "@/features/words/lib/schemas";
import { getAdminDb } from "@/shared/firebase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireCmsUser(request);
    const { id } = await context.params;
    const body = wordPatchSchema.parse(await request.json());

    await getAdminDb().collection("words").doc(id).set({
      ...body,
      name: body.name?.toUpperCase(),
      letter: body.letter?.toUpperCase(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados da palavra inválidos." }, { status: 400 });
    }

    return authErrorResponse(error);
  }
}
