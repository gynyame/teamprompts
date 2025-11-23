// Background script
console.log('TeamPrompts background script loaded')

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed')
})

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PROMPTS') {
        // Fetch prompts from storage or API
        // In a real app, this might fetch from an API if not in storage
        chrome.storage.sync.get(['prompts'], (result) => {
            sendResponse({ prompts: result.prompts || [] });
        });
        return true; // Keep message channel open for async response
    }

    if (message.type === 'INSERT_PROMPT') {
        // Handle prompt insertion logging or analytics
        sendResponse({ success: true });
    }
});
