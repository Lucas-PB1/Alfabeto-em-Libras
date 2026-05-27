export const DEFAULT_FIRESTORE_DATABASE_ID = "(default)";

export function resolveFirestoreDatabaseId(databaseId?: string) {
  return databaseId?.trim() || DEFAULT_FIRESTORE_DATABASE_ID;
}
