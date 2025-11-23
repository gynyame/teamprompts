"use strict";
(() => {
  // extension/content.ts
  console.log("TeamPrompts content script loaded");
  if (window.teamPromptsInjected) {
    console.log("TeamPrompts already active on this page");
  } else {
    window.teamPromptsInjected = true;
    console.log("TeamPrompts activated");
    const initializeTeamPrompts = () => {
      const button = document.createElement("div");
      button.id = "teamprompts-trigger";
      button.innerHTML = "\u{1F4DD} Prompts";
      button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4F46E5;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    `;
      button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.05)";
      });
      button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";
      });
      button.addEventListener("click", openPromptsPanel);
      document.body.appendChild(button);
    };
    const openPromptsPanel = () => {
      chrome.runtime.sendMessage({ type: "GET_PROMPTS" }, (response) => {
        showPromptsUI(response.prompts);
      });
    };
    const showPromptsUI = (prompts) => {
      const panel = document.createElement("div");
      panel.id = "teamprompts-panel";
      panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-height: 80vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      z-index: 1000000;
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    `;
      panel.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Your Prompts</h2>
        <button id="close-panel" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">\xD7</button>
      </div>
      <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
        ${prompts.length === 0 ? '<p style="color: #6b7280; text-align: center;">No prompts yet. Create your first prompt!</p>' : prompts.map((prompt) => `
            <div class="prompt-item" data-prompt-id="${prompt.id}" style="padding: 12px; margin-bottom: 8px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: background 0.2s;">
              <div style="font-weight: 600; margin-bottom: 4px;">${prompt.title}</div>
              <div style="font-size: 14px; color: #6b7280;">${prompt.description || "Click to insert"}</div>
            </div>
          `).join("")}
      </div>
    `;
      document.body.appendChild(panel);
      document.getElementById("close-panel")?.addEventListener("click", () => {
        panel.remove();
      });
      document.querySelectorAll(".prompt-item").forEach((item) => {
        item.addEventListener("mouseenter", (e) => {
          e.target.style.background = "#f3f4f6";
        });
        item.addEventListener("mouseleave", (e) => {
          e.target.style.background = "white";
        });
        item.addEventListener("click", (e) => {
          const promptId = e.currentTarget.dataset.promptId;
          const prompt = prompts.find((p) => p.id === promptId);
          insertPrompt(prompt);
          panel.remove();
        });
      });
      panel.addEventListener("click", (e) => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    };
    const insertPrompt = (prompt) => {
      const selectors = [
        'textarea[placeholder*="Message"]',
        'textarea[placeholder*="Ask"]',
        'textarea[placeholder*="Type"]',
        '[contenteditable="true"]',
        "textarea"
      ];
      let inputField = null;
      for (const selector of selectors) {
        inputField = document.querySelector(selector);
        if (inputField) break;
      }
      if (inputField) {
        if (inputField.tagName === "TEXTAREA") {
          inputField.value = prompt.content;
          inputField.dispatchEvent(new Event("input", { bubbles: true }));
          inputField.focus();
        } else if (inputField.isContentEditable) {
          inputField.textContent = prompt.content;
          inputField.dispatchEvent(new Event("input", { bubbles: true }));
          inputField.focus();
        }
        showNotification("Prompt inserted successfully!");
      } else {
        showNotification("Could not find input field", "error");
      }
    };
    const showNotification = (message, type = "success") => {
      const notification = document.createElement("div");
      notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#10B981" : "#EF4444"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000001;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => notification.remove(), 300);
      }, 3e3);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeTeamPrompts);
    } else {
      initializeTeamPrompts();
    }
  }
})();
