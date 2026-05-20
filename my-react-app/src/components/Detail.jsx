import React from "react";

export default function Detail({ children, style }) {
  return <div style={{ fontSize:"0.9rem", color:"#4b5563", marginBottom:4, wordBreak:"break-word", ...style }}>{children}</div>;
}
