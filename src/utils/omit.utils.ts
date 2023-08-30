export const OMIT = <T, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> => {
  const newObject = { ...object };

  keys.forEach(key => delete newObject[key]);

  return newObject;
};
