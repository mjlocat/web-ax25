import React from "react";
import './Packet.css';

export default function Packet({ packet }) {
  function getTime() {
    const received = new Date(packet.received);
    return received.toLocaleTimeString();
  }

  function formatVia() {
    if (packet.via.length === 0) {
      return 'DIRECT'
    }
    const digistring = packet.via.map(d => `${d.digi}${d.repeated ? '*' : ''}`);
    return digistring.join(', ');
  }

  return (
    <>
      <tr className="packetHeader">
        <td>{getTime()}</td>
        <td>From</td>
        <td>{packet.from}</td>
        <td>To</td>
        <td>{packet.to}</td>
        <td>Via</td>
        <td>{formatVia()}</td>
      </tr>
      <tr>
        <td colspan="7" className="packetData">{packet.data}</td>
      </tr>
    </>
  );
}