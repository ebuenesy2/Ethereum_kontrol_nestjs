export interface OptionalParameter {
  key: string;
  value: string;
}

export function parseOptionalParameters(
  value: string | null | undefined,
): OptionalParameter[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is OptionalParameter =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as OptionalParameter).key === 'string' &&
        typeof (item as OptionalParameter).value === 'string',
    );
  } catch {
    return [];
  }
}
