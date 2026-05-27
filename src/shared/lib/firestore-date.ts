interface TimestampLike {
  seconds?: number;
  toDate?: () => Date;
}

export function toIsoDate(value: unknown) {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const timestamp = value as TimestampLike;

  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString();
  }

  if (typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toISOString();
  }

  return undefined;
}
