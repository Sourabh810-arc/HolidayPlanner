import React, { useState } from "react";

export default function HotelImage({ src, alt }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{ width:"100%", height:200, background:"#e5e7eb", borderRadius:10, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af", fontSize:"0.9rem" }}>
      Image unavailable
    </div>
  );
  return <img src={src} alt={alt} onError={() => setErr(true)} style={{ width:"100%", height:200, objectFit:"cover", borderRadius:10, marginBottom:16 }} />;
}
