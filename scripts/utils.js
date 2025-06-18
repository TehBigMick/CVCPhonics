// scripts/utils.js
// Utility functions for Phonics Web App

/**
 * Get a query parameter value by name
 * @param {string} key
 * @returns {string|null}
 */
export function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Shuffle an array (Fisher–Yates)
 * @param {Array} array
 * @returns {Array} shuffled copy
 */
export function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Trigger download of a blank certificate template image.
 * @param {Object} options
 * @param {string} options.templatePath - Path to certificate background image
 * @param {string} [options.filename]   - Suggested filename for download
 */
export function downloadCertificate({ templatePath, filename }) {
  // Create a temporary <a> to download the image directly
  const a = document.createElement('a');
  a.href = templatePath;
  if (filename) {
    a.download = filename;
  } else {
    const parts = templatePath.split('/');
    const base = parts[parts.length - 1] || 'certificate.png';
    a.download = base;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
