// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveUrl") {
    console.log("Received message in content script with URL:", request.url); // Debugging log
    const url = request.url;
    const key = prompt("Enter a shortcut key for this URL:");

    if (key) {
      if (key.length > 15) {
        alert('The key must be 15 characters or less.');
        return;
      }
      chrome.storage.sync.set({ [key]: url }, () => {
        alert(`Saved ${url} with the key ${key}`);
      });
    }
  }
});

