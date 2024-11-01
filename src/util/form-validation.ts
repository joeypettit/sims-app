export function validateTemplateName(templateName: string) {
  // Trim input
  templateName = templateName.trim();

  // Check if empty
  if (!templateName) {
    return "Template name is required.";
  }

  // Length check
  if (templateName.length < 3 || templateName.length > 50) {
    return "Template name must be between 3 and 50 characters.";
  }

  // Character restriction check
  const namePattern = /^[a-zA-Z0-9-_ ]+$/;
  if (!namePattern.test(templateName)) {
    return "Template name can only contain letters, numbers, spaces, dashes, and underscores.";
  }

  // All checks passed
  return null;
}
