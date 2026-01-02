import { FieldNamesMarkedBoolean } from "react-hook-form";

export function pickDirty<T extends Record<string, any>>(
  values: T,
  dirty: FieldNamesMarkedBoolean<T>
): Partial<T> {
  return Object.keys(dirty).reduce((acc, key) => {
    const typedKey = key as keyof T;
    acc[typedKey] = values[typedKey];
    return acc;
  }, {} as Partial<T>);
}
