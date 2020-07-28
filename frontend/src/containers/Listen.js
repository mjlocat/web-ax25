import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from '../libs/contextLib';
import Packet from '../components/Packet';
import UISend from '../components/UISend';
import "./Listen.css";

export default function Listen() {
  const { packets } = useAppContext();
  const bottomRef = useRef(null);
  const [autoscroll, setAutoscroll] = useState(true);
  const [scrollHandlerSet, updateScrollHandlerSet] = useState(false);

  useEffect(() => {
    if (!scrollHandlerSet) {
      window.addEventListener('scroll', onScroll);
      updateScrollHandlerSet(true);
    }
    scrollToBottom();
    return () => {
      if (scrollHandlerSet) {
        window.removeEventListener('scroll', onScroll);
        updateScrollHandlerSet(false);
      }
    };
  }, [packets]);

  function onScroll() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
      if (!autoscroll) {
        setAutoscroll(true);
      }
    } else {
      if (autoscroll) {
        setAutoscroll(false);
      }
    }
  }

  function scrollToBottom() {
    if (autoscroll) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="Listen">
      <div className="lander">
        <h1>Listen</h1>
        <table className="packetTable">
          {packets.map(packet => <Packet packet={packet} />)}
        </table>
      </div>
      <div ref={bottomRef} className="bottomPad" />
      <UISend />
    </div>
  );
}