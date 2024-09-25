import { buildServerApp } from "./app_factory.ts";

const app = buildServerApp();

Deno.serve(app.fetch);
