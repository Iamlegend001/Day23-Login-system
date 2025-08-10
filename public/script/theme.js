"use strict";
(function () {
  const STORAGE_KEY = "theme-preference";

  function getSystemPreference() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function initTheme() {
    const stored = getStoredTheme();
    const theme = stored || getSystemPreference();
    applyTheme(theme);
    const toggle = document.querySelector("[data-toggle-theme]");
    if (toggle) {
      toggle.textContent = theme === "light" ? "Dark mode" : "Light mode";
      toggle.setAttribute(
        "aria-label",
        `Switch to ${theme === "light" ? "dark" : "light"} mode`
      );
      toggle.addEventListener("click", () => {
        const current =
          document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
        storeTheme(next);
        toggle.textContent = next === "light" ? "Dark mode" : "Light mode";
        toggle.setAttribute(
          "aria-label",
          `Switch to ${next === "light" ? "dark" : "light"} mode`
        );
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();
