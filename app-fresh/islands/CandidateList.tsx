import { FunctionComponent } from "preact";
import { Signal } from "@preact/signals";

import { candidates } from "../data.ts";
import { Candidate } from "./Candidate.tsx";

interface Props {
  csrfToken: string;
  submittedSignal: Signal<boolean>;
}

export const CandidateList: FunctionComponent<Props> = (
  { csrfToken, submittedSignal },
) => {
  return (
    <ul class="flex flex-wrap justify-between mt-24">
      {candidates.map((candidate) => (
        <li>
          <Candidate
            id={candidate.id}
            label={candidate.name}
            image={candidate.image}
            csrfToken={csrfToken}
            submittedSignal={submittedSignal}
          />
        </li>
      ))}
    </ul>
  );
};
