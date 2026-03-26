import { format, formatDistance, formatRelative } from 'date-fns';

export const formatters = {
  // Format currency
  formatCurrency(
    amount: number,
    currencyCode: string = 'USD',
    locale: string = 'en-US'
  ): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback if currency code is invalid
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  },

  // Format price (without currency symbol)
  formatPrice(amount: number): string {
    return amount.toFixed(2);
  },

  // Format percentage
  formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)}%`;
  },

  // Format phone number
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return phone;

    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  },

  // Format date
  formatDate(
    date: Date | string | number,
    formatStr: string = 'MMM dd, yyyy'
  ): string {
    try {
      return format(new Date(date), formatStr);
    } catch {
      return 'Invalid date';
    }
  },

  // Format time
  formatTime(
    date: Date | string | number,
    formatStr: string = 'HH:mm'
  ): string {
    try {
      return format(new Date(date), formatStr);
    } catch {
      return 'Invalid time';
    }
  },

  // Format datetime
  formatDateTime(
    date: Date | string | number,
    formatStr: string = 'MMM dd, yyyy HH:mm'
  ): string {
    try {
      return format(new Date(date), formatStr);
    } catch {
      return 'Invalid date';
    }
  },

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date: Date | string | number): string {
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  },

  // Format relative date (e.g., "yesterday at 3:00 PM")
  formatRelativeDate(date: Date | string | number): string {
    try {
      return formatRelative(new Date(date), new Date());
    } catch {
      return 'Unknown';
    }
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // Format number with commas
  formatNumber(num: number, decimals: number = 0): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  // Format rating (e.g., 4.5/5)
  formatRating(rating: number, maxRating: number = 5): string {
    return `${rating.toFixed(1)}/${maxRating}`;
  },

  // Format product name
  formatProductName(name: string, maxLength: number = 50): string {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  },

  // Format address
  formatAddress(address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  }): string {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.zipCode,
    ].filter(Boolean);
    return parts.join(', ');
  },

  // Format full name
  formatFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  },

  // Format initials from name
  formatInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  },

  // Format order number
  formatOrderNumber(orderId: string): string {
    return `#${orderId.slice(-8).toUpperCase()}`;
  },

  // Truncate text
  truncate(text: string, length: number = 100): string {
    if (text.length <= length) return text;
    return text.substring(0, length - 3) + '...';
  },

  // Capitalize first letter
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Capitalize each word
  capitalizeWords(text: string): string {
    return text
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  },

  // Convert order status to readable text
  formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  },

  // Convert payment status to readable text
  formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return statusMap[status] || status;
  },
};
