"use strict";
(() => {
  // extension/background.ts
  console.log("TeamPrompts background script loaded");
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
})();
