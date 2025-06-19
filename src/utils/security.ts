
/**
 * Security utilities for input sanitization and validation
 */

// Basic HTML sanitization - removes potentially harmful characters
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Sanitize tire description with additional safety
export const sanitizeTireDescription = (description: string): string => {
  if (!description) return '';
  
  const sanitized = sanitizeInput(description);
  // Limit length to prevent excessive data
  return sanitized.length > 500 ? sanitized.substring(0, 500) + '...' : sanitized;
};

// Validate tire size format
export const validateTireSize = (size: string): boolean => {
  if (!size) return false;
  
  // Common tire size patterns: 225/50R17, 225/50ZR17, 225/50-17, etc.
  const tireSizePattern = /^[0-9]{2,3}\/[0-9]{2,3}[A-Z]?R?[0-9]{2,3}$/i;
  return tireSizePattern.test(size.replace(/[\s-]/g, ''));
};

// Validate image data URL
export const validateImageData = (imageUrl: string): boolean => {
  if (!imageUrl) return true; // Optional field
  
  // Check if it's a valid data URL for images
  const dataUrlPattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
  return dataUrlPattern.test(imageUrl);
};

// Validate image size (in bytes)
export const validateImageSize = (imageUrl: string, maxSizeBytes: number = 5 * 1024 * 1024): boolean => {
  if (!imageUrl) return true; // Optional field
  
  try {
    // Estimate size from base64 data URL
    const base64Data = imageUrl.split(',')[1];
    if (!base64Data) return false;
    
    const sizeBytes = (base64Data.length * 3) / 4;
    return sizeBytes <= maxSizeBytes;
  } catch {
    return false;
  }
};

// Generic field validation
export const validateRequiredField = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate quantity
export const validateQuantity = (quantity: number): string | null => {
  if (!quantity || quantity < 1 || quantity > 10000) {
    return 'Quantity must be between 1 and 10,000';
  }
  return null;
};
