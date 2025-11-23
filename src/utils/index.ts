import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'PLN'): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Format date and time
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Format account number
export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(.{4})/g, '$1 ').trim();
}

// Mask account number for security
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  const visiblePart = accountNumber.slice(-4);
  const maskedPart = '*'.repeat(accountNumber.length - 4);
  return maskedPart + visiblePart;
}

// Generate initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    FOOD: 'bg-green-100 text-green-800',
    TRANSPORT: 'bg-blue-100 text-blue-800',
    SHOPPING: 'bg-purple-100 text-purple-800',
    BILLS: 'bg-yellow-100 text-yellow-800',
    ENTERTAINMENT: 'bg-pink-100 text-pink-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors.OTHER;
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    BLOCKED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || colors.INACTIVE;
}

// Export all utilities
export * from './errorHandling';
export * from './loadingStates';
export * from './dataSeed';
export * from './animations';