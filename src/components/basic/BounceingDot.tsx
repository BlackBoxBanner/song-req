"use client";

import {cn} from "@/lib/utils";
import {useState} from "react";

const BouncingDot = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={cn(getAnimation(i))}>
          .
        </div>
      ))}
    </>
  );

  function getAnimation(index: number): string {
    const animations = ["animate-bounce", ""];

    return animations[index % animations.length];
  }
};

export default BouncingDot;
