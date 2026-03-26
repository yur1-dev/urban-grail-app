// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (supports multiple formats)
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

// Postal code validation
const POSTAL_CODE_REGEX = /^[a-zA-Z0-9\s\-]{2,10}$/;

export const validators = {
  // Email validation
  isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email) && email.length <= 255;
  },

  // Password validation (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  isValidPassword(password: string): boolean {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false; // At least one uppercase
    if (!/[a-z]/.test(password)) return false; // At least one lowercase
    if (!/[0-9]/.test(password)) return false; // At least one number
    return true;
  },

  // Weak password check (minimum 6 characters)
  isWeakPassword(password: string): boolean {
    return password.length < 6;
  },

  // Phone validation
  isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  },

  // Name validation
  isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  // URL validation
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Postal code validation
  isValidPostalCode(code: string): boolean {
    return POSTAL_CODE_REGEX.test(code);
  },

  // Credit card validation (basic Luhn algorithm)
  isValidCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  // CVV validation
  isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv.trim());
  },

  // Expiry date validation (MM/YY format)
  isValidExpiryDate(expiryDate: string): boolean {
    const parts = expiryDate.trim().split('/');
    if (parts.length !== 2) return false;

    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    if (month < 1 || month > 12) return false;
    if (year < new Date().getFullYear() % 100) return false;

    return true;
  },

  // Validate form field
  validateField(
    fieldName: string,
    value: string
  ): { isValid: boolean; error?: string } {
    switch (fieldName.toLowerCase()) {
      case 'email':
        if (!value.trim()) {
          return { isValid: false, error: 'Email is required' };
        }
        if (!this.isValidEmail(value)) {
          return { isValid: false, error: 'Please enter a valid email' };
        }
        return { isValid: true };

      case 'password':
        if (!value) {
          return { isValid: false, error: 'Password is required' };
        }
        if (this.isWeakPassword(value)) {
          return { isValid: false, error: 'Password must be at least 6 characters' };
        }
        return { isValid: true };

      case 'phone':
        if (!value.trim()) {
          return { isValid: false, error: 'Phone number is required' };
        }
        if (!this.isValidPhone(value)) {
          return { isValid: false, error: 'Please enter a valid phone number' };
        }
        return { isValid: true };

      case 'name':
        if (!value.trim()) {
          return { isValid: false, error: 'Name is required' };
        }
        if (!this.isValidName(value)) {
          return { isValid: false, error: 'Name must be between 2 and 50 characters' };
        }
        return { isValid: true };

      default:
        return { isValid: !!value.trim() };
    }
  },

  // Validate multiple fields
  validateFields(
    fields: Record<string, string>
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    Object.entries(fields).forEach(([fieldName, value]) => {
      const validation = this.validateField(fieldName, value);
      if (!validation.isValid && validation.error) {
        errors[fieldName] = validation.error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
