import { encodeBase64 } from "@std/encoding";

/**
 * CRRF トークンを生成する
 * @returns 生成された CSRF トークン
 */
export const generateCsrfToken = () => {
  return encodeBase64(crypto.getRandomValues(new Uint8Array(32)));
};
