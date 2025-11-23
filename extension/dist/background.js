"use strict";
(() => {
  // extension/background.ts
  console.log("TeamPrompts background script loaded");
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_PROMPTS") {
      chrome.storage.sync.get(["prompts"], (result) => {
        sendResponse({ prompts: result.prompts || [] });
      });
      return true;
    }
    if (message.type === "INSERT_PROMPT") {
      sendResponse({ success: true });
    }
  });
})();
