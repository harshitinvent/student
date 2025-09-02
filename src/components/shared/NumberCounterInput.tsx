import { useState } from "react";
import IconButton from "./IconButton";

export default function NumberCounterInput() {
  const [number, setNumber] = useState<number>(24);

  return (
    <div
      className={
        "rounded-12 bg-bgNavigate flex items-center justify-center h-40 p-4 gap-8"
      }
    >
      <IconButton
        className={"!size-32"}
        onClick={() =>
          setNumber((prevState) => (prevState <= 1 ? 1 : --prevState))
        }
      >
        -
      </IconButton>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(Number(e.target.value || 0))}
        className={
          "w-16 text-body-m font-medium text-center outline-none border-none bg-transparent"
        }
        min={1}
        max={99}
      />
      <IconButton
        className={"!size-32"}
        onClick={() =>
          setNumber((prevState) => (prevState >= 99 ? 99 : ++prevState))
        }
      >
        +
      </IconButton>
    </div>
  );
}
