import type { Session } from "hono_sessions";

export type Application = {
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
};
