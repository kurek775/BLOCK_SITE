let blockedWords = [];

async function loadBlockedList() {
  const stored = await chrome.storage.local.get('blockedWords');
  blockedWords = stored.blockedWords || [];
}

loadBlockedList();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.blockedWords) {
    blockedWords = changes.blockedWords.newValue || [];
  }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return;

  const url = details.url.toLowerCase();
  for (const word of blockedWords) {
    if (url.includes(word)) {
      await chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
          document.body.innerHTML = `
            <style>
              body {
                background-color: #111;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                font-family: Arial, sans-serif;
              }
              h1 { color: #e53935; }
            </style>
            <h1>🚫 Site Blocked</h1>
            <p>This site is blocked by your chrome extensionf.</p>
          `;
        }
      });
      return;
    }
  }
});
