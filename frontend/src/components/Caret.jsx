import React from 'react';
import { useTypingStore } from '../store/useTypingStore';

const Caret = () => {
  const caretStyle = useTypingStore(s => s.caretStyle);

  if (caretStyle === 'block') {
    return <span className="absolute left-0 top-[10%] w-[1ch] h-[80%] bg-primary/40 animate-blink z-20 mix-blend-difference"></span>;
  }
  
  if (caretStyle === 'underline') {
    return <span className="absolute left-0 bottom-0 w-[1ch] h-[3px] bg-primary animate-blink z-20"></span>;
  }

  // Default: line
  return (
    <span className="absolute left-0 top-[10%] w-[3px] h-[80%] bg-primary animate-blink z-20 shadow-[0_0_8px_rgba(211,0,38,0.6)]"></span>
  );
};

export default Caret;
