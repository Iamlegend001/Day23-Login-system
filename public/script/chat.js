"use strict";
(function () {
  function el(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function createMessage({ text, isUser }) {
    const wrapper = document.createElement("div");
    wrapper.className = `msg ${isUser ? "msg--user" : ""}`.trim();

    const avatar = document.createElement("div");
    avatar.className = "msg__avatar";

    const bubble = document.createElement("div");
    bubble.className = "msg__bubble";
    bubble.textContent = text;

    if (isUser) {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    } else {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    }
    return wrapper;
  }

  function initChat() {
    const form = el("[data-chat-form]");
    const input = el("[data-chat-input]");
    const list = el("[data-chat-list]");
    const threads = el("[data-thread-list]");
    const sidebar = el("[data-sidebar]");
    const overlay = el("[data-overlay]");
    const sidebarToggle = el("[data-sidebar-toggle]");
    if (!form || !input || !list) return;

    // Auto-resize textarea and Enter to send, Shift+Enter for newline
    function autoresize() {
      input.style.height = "auto";
      input.style.height = Math.min(240, input.scrollHeight) + "px";
    }
    autoresize();
    input.addEventListener("input", autoresize);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const userMsg = createMessage({ text, isUser: true });
      list.appendChild(userMsg);
      input.value = "";
      autoresize();
      list.scrollTop = list.scrollHeight;

      // Simulated assistant response; replace with API call as needed
      const thinking = createMessage({ text: "…", isUser: false });
      list.appendChild(thinking);
      list.scrollTop = list.scrollHeight;

      try {
        // Example: replace with a real API endpoint
        await new Promise((r) => setTimeout(r, 600));
        thinking.querySelector(".msg__bubble").textContent =
          "This is a demo response. Hook me to your backend.";
      } catch (err) {
        thinking.querySelector(".msg__bubble").textContent =
          "Sorry, something went wrong.";
      }
      list.scrollTop = list.scrollHeight;
    });

    // Sidebar demo: switch active thread
    if (threads) {
      threads.addEventListener("click", (e) => {
        const btn = e.target.closest(".thread");
        if (!btn) return;
        threads
          .querySelectorAll(".thread[aria-current]")
          .forEach((el) => el.removeAttribute("aria-current"));
        btn.setAttribute("aria-current", "true");
      });
    }

    // Sidebar open/close
    function setSidebar(open) {
      if (!sidebar) return;
      if (open) {
        sidebar.setAttribute("data-open", "true");
        if (overlay) overlay.setAttribute("data-open", "true");
      } else {
        sidebar.removeAttribute("data-open");
        if (overlay) overlay.removeAttribute("data-open");
      }
    }
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        const isOpen = sidebar?.getAttribute("data-open") === "true";
        setSidebar(!isOpen);
      });
    }
    if (overlay) {
      overlay.addEventListener("click", () => setSidebar(false));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChat);
  } else {
    initChat();
  }
})();
