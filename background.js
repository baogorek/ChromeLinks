// Duplicated functionality
function formatUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url; // Default to https if no protocol is specified
  }
  return url;
}

// background.js
chrome.commands.onCommand.addListener((command) => {
  if (command === "save-url") {
    console.log("hello!");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab.url;

      chrome.tabs.sendMessage(tab.id, { action: "saveUrl", url: url });
    });
  }
});


chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.sync.get(null, function(items) {
    let suggestions = [];

    if (text) {
      // If there is text, filter keys based on the input (case-insensitive)
      const lowerCaseText = text.toLowerCase();
      suggestions = Object.keys(items)
        .filter(key => key.toLowerCase().includes(lowerCaseText))
        .map(key => ({ content: key, description: key }));
    } else {
      // If there is no text, list all keys (already in alphabetical order)
      suggestions = Object.keys(items).map(key => ({ content: key, description: key }));
    }

    suggest(suggestions);
  });
});

chrome.omnibox.onInputEntered.addListener((text) => {
  const lowerCaseText = text.toLowerCase();

  chrome.storage.sync.get(null, (items) => {
    // Find the key that matches the entered text in a case-insensitive manner
    const matchingKey = Object.keys(items).find(key => key.toLowerCase() === lowerCaseText);

    if (matchingKey) {
      let url = items[matchingKey];

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.update(tabs[0].id, {url: url});
      });
    }
  });
});
