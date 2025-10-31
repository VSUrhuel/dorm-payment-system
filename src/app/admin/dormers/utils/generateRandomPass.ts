/**
 * Generates a cryptographically secure random password.
 *
 * @param length The desired length of the password. Defaults to 12.
 * @returns A random password string.
 */
export const generateRandomPassword = (length: number = 12): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

  // Create a typed array to hold the random values
  const randomValues = new Uint32Array(length);

  // Fill the array with cryptographically secure random numbers
  window.crypto.getRandomValues(randomValues);

  // Map each random value to a character in the charset
  const passwordArray = Array.from(
    randomValues,
    (value) => charset[value % charset.length]
  );

  return passwordArray.join("");
};
