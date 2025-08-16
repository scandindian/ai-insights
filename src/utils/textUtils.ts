export function capitalizeWords(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (s) => s.toUpperCase()) // Capitalize first letter
    .replace(/\b\w/g, (s) => s.toUpperCase()) // Capitalize each word
    .trim();
}