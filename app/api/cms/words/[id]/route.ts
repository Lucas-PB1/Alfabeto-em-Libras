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
    const patch = {
      ...body,
      ...(body.name ? { name: body.name.toUpperCase() } : {}),
      ...(body.letter ? { letter: body.letter.toUpperCase() } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await getAdminDb().collection("words").doc(id).set(patch, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados da palavra inválidos." }, { status: 400 });
    }

    return authErrorResponse(error);
  }
}
