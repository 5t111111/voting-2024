import { FunctionComponent } from "preact";

type Props = {
  text: string;
  type: "button" | "submit";
  disabled?: boolean;
};

export const Button: FunctionComponent<Props> = ({ text, type, disabled }) => {
  return (
    <button
      type={type}
      class={`rounded-lg ${
        disabled ? "bg-gray-400" : "bg-blue-500"
      } text-white px-4 py-2 shadow-sm font-semibold`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
