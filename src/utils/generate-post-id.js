/**
 * Generates a unique post ID by selecting specific characters from the input string
 * Pattern: First 5 chars + 7th + 10th + 12th + 15th + 17th + 20th + 23rd + 25th + 27th + 30th + 35th + 40th
 * @param {string} text - The input text to generate ID from
 * @returns {string} Generated ID
 */
export function generatePostId(text) {
  if (!text) return "";

  // Clean the text - remove extra spaces and special characters
  // const cleanText = text
  //   .replace(/[^\w\s]/g, "")
  //   .replace(/\s+/g, " ")
  //   .trim();

  // Get first 5 characters
  const firstFive = text.slice(0, 5);

  // Get the specific characters if they exist
  const positions = [7, 9, 11, 13, 15, 19, 23, 27, 31, 35, 39];
  const selectedChars = positions
    .map((pos) => (text.length > pos ? text[pos] : ""))
    .join("");

  // Combine and ensure we have at least some characters
  const id = (firstFive + selectedChars).toLowerCase();

  return id || null;
}
