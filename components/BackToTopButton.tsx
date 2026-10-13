"use client";

import React from "react";

export default function BackToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="hover:text-[#C9A227] transition-colors"
    >
      Back to Top ↑
    </button>
  );
}
