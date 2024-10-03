// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_vote from "./routes/api/vote.ts";
import * as $index from "./routes/index.tsx";
import * as $Candidate from "./islands/Candidate.tsx";
import * as $CandidateList from "./islands/CandidateList.tsx";
import * as $DevPanel from "./islands/DevPanel.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/vote.ts": $api_vote,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Candidate.tsx": $Candidate,
    "./islands/CandidateList.tsx": $CandidateList,
    "./islands/DevPanel.tsx": $DevPanel,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
