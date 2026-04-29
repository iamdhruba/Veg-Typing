import { useEffect, useRef } from "react";
import { PREETI_ALT_MAP } from "../utils/preetiMap";

export function usePreetiInput(onCharInsert) {
  const altHeld = useRef(false);
  const numBuffer = useRef("");

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Alt") {
        altHeld.current = true;
        numBuffer.current = "";
        e.preventDefault();
        return;
      }
      if (altHeld.current) {
        if (/^(Numpad\d|\d)$/.test(e.code) || /^\d$/.test(e.key)) {
          numBuffer.current += e.key.replace("Numpad", "");
          e.preventDefault();
          return;
        }
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "Alt") {
        altHeld.current = false;
        const code = numBuffer.current.padStart(4, "0");
        if (PREETI_ALT_MAP[code]) {
          onCharInsert(PREETI_ALT_MAP[code]);
        }
        numBuffer.current = "";
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onCharInsert]);
}
