"use client";

import { useEffect } from "react";

/** Last-resort boundary: replaces the root layout, so it carries its own html/body. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F6F3EE", color: "#0B0B0F", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 clamp(1rem, 4vw, 3rem)" }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8102E", margin: 0 }}>Something went wrong</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05, margin: "16px 0 0" }}>Janpaksh Bharat hit a snag.</h1>
            <p style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 17, lineHeight: 1.6, color: "#6B6B75", margin: "20px 0 0" }}>
              Please try again in a moment. If it keeps happening, email the desk and mention this reference.
              {error.digest && <span style={{ display: "block", fontSize: 12, marginTop: 8 }}>Reference {error.digest}</span>}
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={reset} style={{ font: "500 15px Helvetica, Arial, sans-serif", background: "#E8862A", color: "#0B0B0F", border: 0, borderRadius: 999, padding: "14px 24px", cursor: "pointer" }}>
                Try again
              </button>
              <a href="/" style={{ font: "500 15px Helvetica, Arial, sans-serif", color: "#0B0B0F", border: "1px solid #0B0B0F", borderRadius: 999, padding: "13px 24px", textDecoration: "none" }}>
                Front page
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
