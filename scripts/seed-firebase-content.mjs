import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

loadEnvFiles();

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇ".split("");
const words = [
  ["A", "ABELHA", "Bug", "bg-yellow-400"],
  ["B", "BOLA", "CircleDot", "bg-blue-400"],
  ["C", "CASA", "Home", "bg-red-400"],
  ["D", "DADO", "Dices", "bg-white"],
  ["E", "ESTRELA", "Star", "bg-yellow-300"],
  ["F", "FOGUETE", "Rocket", "bg-sky-500"],
  ["G", "GATO", "Cat", "bg-orange-300"],
  ["H", "HERÓI", "Shield", "bg-rose-500"],
  ["I", "ILHA", "Trees", "bg-cyan-400"],
  ["J", "JACARÉ", "Waves", "bg-green-700"],
  ["K", "KIWI", "Circle", "bg-green-200"],
  ["L", "LÁPIS", "Pencil", "bg-purple-400"],
  ["M", "MAÇÃ", "Apple", "bg-red-500"],
  ["N", "NUVEM", "Cloud", "bg-slate-100"],
  ["O", "OVO", "CircleDot", "bg-stone-100"],
  ["P", "PEIXE", "Fish", "bg-cyan-400"],
  ["Q", "QUEIJO", "PieChart", "bg-yellow-300"],
  ["R", "REI", "Crown", "bg-amber-500"],
  ["S", "SOL", "Sun", "bg-yellow-400"],
  ["T", "TREM", "Train", "bg-red-600"],
  ["U", "UVA", "Grape", "bg-purple-600"],
  ["V", "VELA", "Flame", "bg-orange-400"],
  ["W", "WIFI", "Wifi", "bg-sky-300"],
  ["X", "XÍCARA", "Coffee", "bg-slate-400"],
  ["Y", "YOYO", "Circle", "bg-purple-400"],
  ["Z", "ZEBRA", "Grid3X3", "bg-slate-100"],
];

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firestoreDatabaseId = process.env.FIREBASE_FIRESTORE_DATABASE_ID
  || process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID
  || "(default)";
const publicFirestoreDatabaseId = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID;

validateFirebaseConfig();

initializeApp({
  credential: getCredential(),
  projectId: firebaseProjectId,
  storageBucket,
});

const db = getFirestore(firestoreDatabaseId);
const bucket = storageBucket ? getStorage().bucket() : null;

try {
  await seedAlphabet();
  await seedWords();
  console.log(`Firebase CMS content seeded in Firestore database "${firestoreDatabaseId}".`);
} catch (error) {
  console.error("Falha ao popular o Firebase CMS.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

function getCredential() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (firebaseProjectId && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    return cert({
      projectId: firebaseProjectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    });
  }

  return applicationDefault();
}

function loadEnvFiles() {
  const originalKeys = new Set(Object.keys(process.env));

  for (const fileName of [".env", ".env.local"]) {
    const filePath = join(process.cwd(), fileName);

    if (!existsSync(filePath)) {
      continue;
    }

    for (const [key, value] of parseEnvFile(filePath)) {
      if (!originalKeys.has(key)) {
        process.env[key] = value;
      }
    }
  }
}

function parseEnvFile(filePath) {
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separatorIndex = line.indexOf("=");
      const key = line.slice(0, separatorIndex).trim();
      const value = stripEnvQuotes(line.slice(separatorIndex + 1).trim());
      return [key, value];
    });
}

function stripEnvQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function validateFirebaseConfig() {
  const hasServiceAccount = Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
  const hasApplicationCredentials = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  if (!firebaseProjectId) {
    failConfig("Defina FIREBASE_PROJECT_ID ou NEXT_PUBLIC_FIREBASE_PROJECT_ID no .env.");
  }

  if (!hasServiceAccount && !hasApplicationCredentials) {
    failConfig("Defina FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY, ou GOOGLE_APPLICATION_CREDENTIALS.");
  }
  if (publicFirestoreDatabaseId && publicFirestoreDatabaseId !== firestoreDatabaseId) {
    failConfig(
      `FIREBASE_FIRESTORE_DATABASE_ID (${firestoreDatabaseId}) e NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID (${publicFirestoreDatabaseId}) precisam ser iguais.`,
    );
  }
}

function failConfig(message) {
  console.error(`Configuração Firebase incompleta: ${message}`);
  process.exit(1);
}

async function seedAlphabet() {
  await Promise.all(alphabet.map(async (letter, index) => {
    const filePath = getLibrasFilePath(letter);
    const imageUrl = filePath ? await uploadWithToken(filePath, `cms/alphabet/${letter}.svg`) : `/libras/${letter}.svg`;

    await db.collection("alphabet").doc(letter).set({
      active: true,
      letter,
      librasImage: imageUrl,
      order: index,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }));
}

async function seedWords() {
  await Promise.all(words.map(([letter, name, iconKey, colorClass]) => (
    db.collection("words").doc(`word-${letter.toLowerCase()}`).set({
      active: true,
      colorClass,
      iconKey,
      image: "",
      letter,
      name,
      visualType: "icon",
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true })
  )));
}

function getLibrasFilePath(letter) {
  const svgPath = join(process.cwd(), "public", "libras", `${letter}.svg`);
  return existsSync(svgPath) ? svgPath : "";
}

async function uploadWithToken(filePath, destination) {
  if (!bucket) {
    return `/${destination.replace("cms/alphabet", "libras")}`;
  }

  const token = randomUUID();
  await bucket.upload(filePath, {
    destination,
    metadata: {
      contentType: "image/svg+xml",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;
}
