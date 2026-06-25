/**
 * Generates a human-friendly, unique order number.
 * Format: RB-YYYYMMDD-XXXXX  (e.g. RB-20250624-A1B2C)
 *
 * The date prefix aids sorting/scanning, and the random suffix
 * guarantees uniqueness even within the same second.
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `RB-${datePart}-${randomPart}`;
}
