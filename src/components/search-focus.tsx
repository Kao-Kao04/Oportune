"use client";

import { useEffect } from "react";

// Arriving at /#search (the header search button) focuses the search field.
export function SearchFocus() {
  useEffect(() => {
    if (window.location.hash === "#search") document.getElementById("search")?.focus();
  }, []);
  return null;
}
