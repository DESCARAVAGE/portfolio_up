// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import * as React from 'react';
import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import "../../styles/index.css";
import { paths } from "../../paths";

export function Page(): JSX.Element {
  const interBubbleRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interBubble = interBubbleRef.current;
    if (!interBubble) return;

    const move = () => {
      curX.current += (tgX.current - curX.current) / 20;
      curY.current += (tgY.current - curY.current) / 20;
      interBubble.style.transform = `translate(${Math.round(
        curX.current
      )}px, ${Math.round(curY.current)}px)`;
      animationRef.current = requestAnimationFrame(move);
    };

    const handleMouseMove = (event: MouseEvent) => {
      tgX.current = event.clientX;
      tgY.current = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    move();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="landingCard" onClick={() => navigate(paths.home)}>
        <h3>Découvrez mon portfolio</h3>
        <MeetingRoomIcon />
      </div>
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive" ref={interBubbleRef}></div>
        </div>
      </div>
    </>
  );
}

{
  /* <div style={{ display: 'flex', justifyContent: 'center' }}>
<div className='landingCard' >
<h3>Bienvenue</h3>
<HomeFilledIcon />
</div>
</div> */
}
