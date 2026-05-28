import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { alphabetUpdateSchema } from "@/features/alphabet/lib/schemas";
import { requireCmsUser, authErrorResponse } from "@/features/auth/server/request-auth";
import { getAdminDb } from "@/shared/firebase/admin";

interface RouteContext {
  params: Promise<{ letter: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireCmsUser(request);
    const { letter } = await context.params;
    const body = alphabetUpdateSchema.parse(await request.json());
    const normalizedLetter = decodeURIComponent(letter).normalize("NFC").toUpperCase();

    await getAdminDb().collection("alphabet").doc(normalizedLetter).set({
      ...body,
      letter: normalizedLetter,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados da letra inválidos." }, { status: 400 });
    }

    return authErrorResponse(error);
  }
}
