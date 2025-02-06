/**
 * 
 *
 * A small utility library for encoding/decoding URI components
 * and managing query strings in a robust but intuitive way.
 *
 */

/**
 * Encodes a single value for safe inclusion in a URI component.
 * For strings, uses encodeURIComponent; for objects, JSON-stringifies and then encodes.
 * 
 * @param {string|object|number} value - The value to encode.
 * @returns {string} Encoded representation of the value.
 */
export function encodeParam(value) {
    if (typeof value === 'object') {
      // Convert object or array to JSON, then encode
      return encodeURIComponent(JSON.stringify(value));
    }
    // Convert other primitives (string, number, etc.) to string, then encode
    return encodeURIComponent(String(value));
  }
  
  /**
   * Decodes a single value from a URI-encoded string.
   * If it detects a JSON-like structure, it attempts to parse it as JSON.
   * 
   * @param {string} encodedValue - The URI-encoded string to decode.
   * @returns {string|object} Decoded string or parsed object.
   */
  export function decodeParam(encodedValue) {
    const decoded = decodeURIComponent(encodedValue);
    try {
      // Attempt to parse JSON if the decoded string is valid JSON
      return JSON.parse(decoded);
    } catch (err) {
      // If not JSON, return as-is (string)
      return decoded;
    }
  }
  
  /**
   * Builds a query string from an object of key-value pairs.
   * Each value is encoded with encodeParam.
   * 
   * @param {Object} params - An object whose properties will become query string parameters.
   * @returns {string} A URI-safe query string (without the leading '?').
   * 
   * Example:
   * buildQueryString({ page: 2, filter: { name: "Ivan", tags: ["tech", "books"] } })
   * -> "page=2&filter=%7B%22name%22%3A%22Ivan%22%2C%22tags%22%3A%5B%22tech%22%2C%22books%22%5D%7D"
   */
  export function buildQueryString(params = {}) {
    const queryParts = Object.entries(params).map(([key, val]) => {
      return `${encodeURIComponent(key)}=${encodeParam(val)}`;
    });
    return queryParts.join('&');
  }
  
  /**
   * Parses a query string into an object of decoded key-value pairs.
   * 
   * @param {string} queryString - The query string (e.g., "page=2&filter=...").
   * @returns {Object} Decoded key-value pairs.
   * 
   * Example:
   * parseQueryString("page=2&filter=%7B%22name%22%3A%22Ivan%22%2C%22tags%22%3A%5B%22tech%22%2C%22books%22%5D%7D")
   * -> { page: "2", filter: { name: "Ivan", tags: ["tech", "books"] } }
   */
  export function parseQueryString(queryString = '') {
    // Remove leading '?' if present
    const cleanString = queryString.replace(/^\?/, '');
    if (!cleanString) return {};
  
    return cleanString.split('&').reduce((acc, pair) => {
      const [rawKey, rawValue] = pair.split('=');
      const key = decodeURIComponent(rawKey);
      const value = decodeParam(rawValue);
      acc[key] = value;
      return acc;
    }, {});
  }
  