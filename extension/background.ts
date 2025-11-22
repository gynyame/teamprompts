// Background script
console.log('TeamPrompts background script loaded')

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed')
})
