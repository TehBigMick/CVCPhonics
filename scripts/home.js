const year = document.getElementById('copyright-year');
if (year) year.textContent = `© ${new Date().getFullYear()}`;

const progressPanel = document.getElementById('recent-progress');

try {
  const history = JSON.parse(localStorage.getItem('phonicsHubProgress') || '[]');
  const latest = history.at(-1);

  if (latest && progressPanel) {
    document.getElementById('recent-label').textContent = latest.level;
    document.getElementById('recent-score').textContent = `${latest.score} / ${latest.total}`;
    document.getElementById('recent-link').href = latest.type === 'cvc'
      ? 'cvc/index.html'
      : 'sightwords/index.html';
    progressPanel.hidden = false;
  }
} catch {
  // A blocked or malformed local store should never prevent the page from loading.
}
