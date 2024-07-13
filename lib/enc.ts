import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

// Ensure the secret key is stored in an environment variable
const secretKey = process.env.ENCRYPTION_SECRET_KEY;

if (!secretKey) {
  throw new Error("ENCRYPTION_SECRET_KEY environment variable is not set.");
}

// Derive a key from the secret
const key = scryptSync(secretKey, "salt", 32); // 32 bytes for AES-256

// Function to encrypt data
export function encrypt(text: string): string {
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv("aes-256-ctr", key, iv);
  const encryptedText = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  // Return the IV and encrypted text in a combined format (e.g., base64)
  return `${iv.toString("hex")}:${encryptedText.toString("hex")}`;
}

// Function to decrypt data
export function decrypt(encrypted: string): string {
  const [ivHex, encryptedTextHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedTextHex, "hex");

  const decipher = createDecipheriv("aes-256-ctr", key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decryptedText.toString("utf8");
}

/**
 * Decrypts non-ID fields of the user object.
 *
 * @param user - The user object containing the fields to decrypt.
 * @returns A new user object with decrypted fields.
 */
export function decryptUserFields(
  user: DatabaseUserAttributes
): DatabaseUserAttributes {
  // Check if the user field exists
  if (!user) {
    throw new Error("User is missing");
  }

  // Decrypt the non-ID fields of the user
  const decryptedUser = Object.fromEntries(
    Object.entries(user).map(([key, value]) => {
      // Decrypt only if the value is not the ID field
      const decryptedValue = key === "id" ? value : decrypt(value); // Decrypt the value synchronously
      return [key, decryptedValue] as [string, string];
    })
  );

  // Return a new user object with decrypted fields, including the ID field
  return decryptedUser as unknown as DatabaseUserAttributes;
}
