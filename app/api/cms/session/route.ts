import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, isFirebaseAdminConfigured } from "@/shared/firebase/admin";
import { isBootstrapAdminEmail } from "@/features/auth/server/bootstrap";
import { mapUserDoc } from "@/features/users/lib/mappers";
import type { UserRole, UserStatus } from "@/features/users/types";

interface SessionBody {
  idToken?: string;
  name?: string;
}

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin não configurado." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as SessionBody;

    if (!body.idToken) {
      return NextResponse.json({ error: "Token ausente." }, { status: 400 });
    }

    const decodedToken = await getAdminAuth().verifyIdToken(body.idToken);
    const email = decodedToken.email ?? "";
    const userRef = getAdminDb().collection("users").doc(decodedToken.uid);
    const userSnapshot = await userRef.get();
    const existingUser = userSnapshot.exists ? mapUserDoc(decodedToken.uid, userSnapshot.data() ?? {}) : null;
    const bootstrapAdmin = isBootstrapAdminEmail(email);
    const role: UserRole = bootstrapAdmin ? "admin" : existingUser?.role ?? "editor";
    const status: UserStatus = bootstrapAdmin ? "approved" : existingUser?.status ?? "pending";
    const name = body.name || decodedToken.name || existingUser?.name || email.split("@")[0] || "Usuário";

    await userRef.set({
      name,
      email,
      photoUrl: decodedToken.picture ?? existingUser?.photoUrl ?? "",
      role,
      status,
      lastLoginAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: existingUser?.createdAt ? userSnapshot.get("createdAt") : FieldValue.serverTimestamp(),
      approvedAt: status === "approved" ? FieldValue.serverTimestamp() : existingUser?.approvedAt ?? null,
      approvedBy: bootstrapAdmin ? "bootstrap" : existingUser?.approvedBy ?? "",
    }, { merge: true });

    await getAdminAuth().setCustomUserClaims(decodedToken.uid, {
      cmsAccess: status === "approved",
      role,
    });

    const updatedSnapshot = await userRef.get();
    return NextResponse.json({ profile: mapUserDoc(decodedToken.uid, updatedSnapshot.data() ?? {}) });
  } catch {
    return NextResponse.json({ error: "Não foi possível iniciar a sessão CMS." }, { status: 500 });
  }
}
