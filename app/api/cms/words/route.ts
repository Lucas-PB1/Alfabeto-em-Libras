import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireCmsUser, authErrorResponse } from "@/features/auth/server/request-auth";
import { wordWriteSchema } from "@/features/words/lib/schemas";
import { getAdminDb } from "@/shared/firebase/admin";

export async function POST(request: Request) {
  try {
    await requireCmsUser(request);
    const body = wordWriteSchema.parse(await request.json());

    await getAdminDb().collection("words").add({
      ...body,
      name: body.name.normalize("NFC").toUpperCase(),
      letter: body.letter.normalize("NFC").toUpperCase(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados da palavra inválidos." }, { status: 400 });
    }

    return authErrorResponse(error);
  }
}
