import { buildApp } from "./app_factory.ts";

const app = buildApp();

Deno.serve(app.fetch);
