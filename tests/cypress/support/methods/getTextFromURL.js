/**
 * Extract text in between from url
 * @param {string} url - URL
 * @param {number} start - A start position
 * @param {number} end - A end position
 * @return {newURL} - return a string
 */
export function getTextInBetweenFromUrl(url, start, end) {
  let newURL = url.substring(start, end);

  return newURL;
}

/**
 * Extract text after a value from url
 * @param {string} url - URL
 * @param {number} start - A start position
 * @return {newText} - return a string
 */
export function getTextAfter(url, start) {
  let newURL = url.split(start, 2);
  let newText = newURL[1];

  return newText;
}