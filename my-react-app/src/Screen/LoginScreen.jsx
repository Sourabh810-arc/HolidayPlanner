import { useState } from "react";

export function LoginScreen({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("https://holiday-planner-gray.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login failed");
      onAuthenticated({ token: result.token, user: result.user });
    } catch (err) {
      setError(err.message || "Unable to login.");
      setStatus("ready");
    }
  };

  return (
    <div className="planner-card" style={{ maxWidth: 540, margin: "0 auto" }}>
      <h2 style={{ color: "#1f2937", marginBottom: 10 }}>Login with Email</h2>
      <p style={{ color: "#4b5563", marginBottom: 24 }}>Enter your email address to continue planning your trip.</p>

      <label style={{ display: "block", marginBottom: 12, color: "#374151", fontWeight: 600 }}>Email address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input-field"
        style={{ marginBottom: 18 }}
      />

      <button
        onClick={login}
        disabled={status === "loading"}
        className="button button-primary"
        style={{ width: "100%" }}
      >
        {status === "loading" ? "Logging in..." : "Continue"}
      </button>

      {error && <div style={{ marginTop: 20, color: "#b91c1c", fontWeight: 600 }}>{error}</div>}
    </div>
  );
}
