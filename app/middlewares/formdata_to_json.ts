import { createMiddleware } from "hono/factory";

/**
 * Form data を JSON に変換するミドルウェア
 * Form data を含むリクエストがこのミドルウェアで処理されると、
 * コンテキスト変数の `inputData` に変換された JSON がセットされる
 */
export const formDataToJson = createMiddleware<{
  Variables: {
    // deno-lint-ignore no-explicit-any
    inputData: any;
  };
}>(async (c, next) => {
  const contentType = c.req.header("content-type");

  if (!contentType) {
    return await next();
  }

  if (
    !contentType.includes("multipart/form-data") &&
    !contentType.includes("application/x-www-form-urlencoded")
  ) {
    return await next();
  }

  const formData = await c.req.formData();

  if (!formData) {
    return await next();
  }

  c.set("inputData", Object.fromEntries(formData.entries()));

  await next();
});
