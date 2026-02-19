/**
 * generate uuid
 * @returns
 */
export const uuid = () => {
  if (!typeof globalThis.window) {
    return crypto.randomUUID();
  }
  // node version < 19
  // return (await import('node:crypto')).randomUUID();
  // node version >= 19
  return globalThis.crypto.randomUUID();
};
