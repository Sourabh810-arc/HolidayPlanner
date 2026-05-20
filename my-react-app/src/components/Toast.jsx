import React from "react";

export default function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background:"#1f2937", color:"white", padding:"14px 24px", borderRadius:10,
      fontSize:"0.95rem", fontWeight:500, zIndex:9999, maxWidth:"90vw", textAlign:"center",
    }}>
      {msg}
    </div>
  );
}
