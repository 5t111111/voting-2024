import { FunctionComponent } from "preact";

type Props = {
  text: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
};

export const Button: FunctionComponent<Props> = (
  { text, disabled, onClick },
) => {
  return (
    <button
      class={`rounded-lg ${
        disabled ? "bg-gray-400" : "bg-blue-500"
      } text-white px-4 py-2 shadow-sm font-semibold`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
