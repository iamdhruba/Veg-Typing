import React from 'react';

const Hand = ({ side, activeFingers = [] }) => {
  const isLeft = side === 'left';
  const isActive = (f) => activeFingers.includes(f);
  
  // Finger IDs: L1-L4 (left fingers), R1-R4 (right fingers), T (thumb)
  return (
    <svg width="120" height="120" viewBox="0 0 200 200" className={`transition-all duration-300 ${isLeft ? 'scale-x-[-1]' : ''}`}>
      {/* Index */}
      <path d="M40,160 Q30,120 45,80 Q50,40 60,35 Q70,30 80,40 Q85,80 85,100" fill="none" stroke="currentColor" strokeWidth="2" className={isActive(isLeft ? 'L4' : 'R1') ? 'text-primary stroke-[6] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'text-on-background/20'} />
      {/* Middle */}
      <path d="M85,100 Q85,30 100,25 Q115,20 120,35 Q125,80 125,100" fill="none" stroke="currentColor" strokeWidth="2" className={isActive(isLeft ? 'L3' : 'R2') ? 'text-primary stroke-[6] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'text-on-background/20'} />
      {/* Ring */}
      <path d="M125,100 Q125,20 140,15 Q155,10 160,25 Q165,80 165,100" fill="none" stroke="currentColor" strokeWidth="2" className={isActive(isLeft ? 'L2' : 'R3') ? 'text-primary stroke-[6] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'text-on-background/20'} />
      {/* Pinky */}
      <path d="M165,100 Q165,30 180,35 Q195,40 190,60 Q185,100 180,120" fill="none" stroke="currentColor" strokeWidth="2" className={isActive(isLeft ? 'L1' : 'R4') || (isLeft && isActive('L_SHIFT')) || (!isLeft && isActive('R_SHIFT')) ? 'text-primary stroke-[6] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'text-on-background/20'} />
      {/* Palm Base */}
      <path d="M40,160 Q80,180 120,160 Q150,140 180,120" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-background/20" />
      {/* Thumb */}
      <path d="M40,160 Q10,150 5,130 Q0,110 20,100 Q40,90 60,110" fill="none" stroke="currentColor" strokeWidth="2" className={isActive('T') ? 'text-primary stroke-[6] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'text-on-background/20'} />
    </svg>
  );
};

const FingerGuide = ({ activeFingers = [] }) => {
  return (
    <div className="flex gap-12 opacity-80 scale-125 transition-opacity hover:opacity-100">
      <Hand side="left" activeFingers={activeFingers} />
      <Hand side="right" activeFingers={activeFingers} />
    </div>
  );
};

export default FingerGuide;
