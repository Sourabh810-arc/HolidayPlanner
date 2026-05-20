import { useState } from "react";

export function LoginScreen({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestOtp = async () => {
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("https://holiday-planner-gray.vercel.app/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send OTP");
      setMessage("OTP sent to your email. Enter it below to continue.");
      setStatus("waiting");
    } catch (err) {
      setError(err.message || "Unable to request OTP.");
      setStatus("ready");
    }
  };

  const verifyOtp = async () => {
    setError("");
    if (!otp.trim()) {
      setError("Enter the OTP to continue.");
      return;
    }

    setStatus("verifying");
    try {
      const response = await fetch("https://holiday-planner-gray.vercel.app/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "OTP verification failed");
      onAuthenticated({ token: result.token, user: result.user });
    } catch (err) {
      setError(err.message || "Unable to verify OTP.");
      setStatus("waiting");
    }
  };

  return (
    <div className="planner-card" style={{ maxWidth: 540, margin: "0 auto" }}>
      <h2 style={{ color: "#1f2937", marginBottom: 10 }}>Login with Email OTP</h2>
      <p style={{ color: "#4b5563", marginBottom: 24 }}>Enter your email and use the one-time code to continue planning your trip.</p>

      <label style={{ display: "block", marginBottom: 12, color: "#374151", fontWeight: 600 }}>Email address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input-field"
        style={{ marginBottom: 18 }}
      />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={requestOtp}
          disabled={status === "loading" || status === "verifying"}
          className="button button-primary"
          style={{ flex: 1 }}
        >
          {status === "loading" ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>

      {status !== "ready" && (
        <div style={{ marginTop: 18, padding: 16, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <p style={{ margin: 0, color: "#111827" }}>{message || "Check your inbox for the OTP."}</p>
        </div>
      )}

      {status === "waiting" && (
        <>
          <label style={{ display: "block", marginTop: 24, marginBottom: 12, color: "#374151", fontWeight: 600 }}>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="input-field"
            style={{ marginBottom: 18 }}
          />
          <button
            onClick={verifyOtp}
            disabled={status === "verifying"}
            className="button button-success"
            style={{ width: "100%" }}
          >
            {status === "verifying" ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {error && <div style={{ marginTop: 20, color: "#b91c1c", fontWeight: 600 }}>{error}</div>}
    </div>
  );
}
