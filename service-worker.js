let blockedWords = [];

async function loadBlockedList() {
  try {
    const response = await fetch(chrome.runtime.getURL('data.txt'));
    const text = await response.text();
    blockedWords = text
      .split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(Boolean);
    console.log('[Da Holda] Blocklist loaded:', blockedWords);
  } catch (err) {
    console.error('[Da Holda] Failed to load data.txt:', err);
  }
}

loadBlockedList();

chrome.runtime.onInstalled.addListener(loadBlockedList);

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
            <p>This site is blocked.</p>
          `;
        }
      });

      return; 
    }
  }
});
