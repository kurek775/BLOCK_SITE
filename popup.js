async function loadBlocklist() {
  const stored = await chrome.storage.local.get('blockedWords');
  return stored.blockedWords || [];
}

function renderInputs(words) {
  const container = document.getElementById('inputs');
  container.innerHTML = '';

  words.forEach((word) => {
    const div = document.createElement('div');
    div.className = 'entry';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = word;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '🗑️';
    removeBtn.addEventListener('click', () => div.remove());

    div.appendChild(input);
    div.appendChild(removeBtn);
    container.appendChild(div);
  });
}

document.getElementById('add').addEventListener('click', () => {
  const container = document.getElementById('inputs');
  const div = document.createElement('div');
  div.className = 'entry';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter keyword...';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '🗑️';
  removeBtn.addEventListener('click', () => div.remove());

  div.appendChild(input);
  div.appendChild(removeBtn);
  container.appendChild(div);
});

document.getElementById('save').addEventListener('click', async () => {
  const inputs = Array.from(document.querySelectorAll('#inputs input'))
    .map(i => i.value.trim().toLowerCase())
    .filter(Boolean);

  await chrome.storage.local.set({ blockedWords: inputs });
  const status = document.getElementById('status');
  status.textContent = '✅ Saved!';
  status.style.opacity = '1';
  status.style.color = 'green';

  setTimeout(() => {
    status.style.opacity = '0';
  }, 2000);
});

(async () => {
  const words = await loadBlocklist();
  renderInputs(words);
})();
