import { z } from 'zod';

// Base schemas
export const AddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid postal code'),
  country: z.string().min(1, 'Country is required'),
});

export const NoteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Note content is required'),
  createdAt: z.date(),
  createdBy: z.string(),
  type: z.enum(['GENERAL', 'IMPORTANT', 'REMINDER']),
});

export const FeeSchema = z.object({
  name: z.string().min(1, 'Fee name is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  frequency: z.enum(['MONTHLY', 'YEARLY', 'ONE_TIME']),
});

// Customer schemas
export const AccountSchema = z.object({
  id: z.string(),
  accountNumber: z.string().min(1, 'Account number is required'),
  iban: z.string().min(15, 'IBAN must have at least 15 characters'),
  swiftBic: z.string().min(8, 'SWIFT/BIC must have at least 8 characters'),
  type: z.enum(['PERSONAL_CHECKING', 'BUSINESS', 'SAVINGS', 'INVESTMENT']),
  balance: z.number(),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  isActive: z.boolean(),
  openedDate: z.date(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    pesel: z.string().length(11, 'SSN must have 11 digits'),
    dateOfBirth: z.date(),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(9, 'Phone number must have at least 9 digits'),
    address: AddressSchema,
  }),
  bankingInfo: z.object({
    customerSince: z.date(),
    segment: z.enum(['RETAIL', 'PREMIUM', 'PRIVATE']),
    riskProfile: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    accounts: z.array(AccountSchema),
    products: z.array(z.any()), // Will be defined later
  }),
  notes: z.array(NoteSchema),
  lastActivity: z.date(),
  avatar: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

// Transaction schema
export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  fromAccount: z.string().min(1, 'Source account is required'),
  toAccount: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'OTHER']),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  timestamp: z.date(),
  employeeId: z.string(),
  customerId: z.string(),
  referenceNumber: z.string(),
});

// Transfer form schema
export const TransferFormSchema = z.object({
  fromAccount: z.string().min(1, 'Select source account'),
  toAccount: z.string().min(1, 'Enter recipient account number'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Transfer description is required'),
  recipientName: z.string().min(1, 'Recipient name is required'),
});

// Contact edit schema
export const ContactEditSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(9, 'Phone number must have at least 9 digits'),
  address: AddressSchema,
});

// Card application schema
export const CardApplicationSchema = z.object({
  cardType: z.enum(['DEBIT', 'CREDIT', 'PREPAID']),
  cardBrand: z.enum(['VISA', 'MASTERCARD', 'AMEX']),
  creditLimit: z.number().positive().optional(),
  deliveryAddress: AddressSchema,
});

// Loan application schema
export const LoanApplicationSchema = z.object({
  loanType: z.enum(['PERSONAL', 'MORTGAGE', 'AUTO', 'BUSINESS']),
  requestedAmount: z.number().positive('Amount must be positive'),
  termMonths: z.number().min(1, 'Term must be at least 1 month'),
  purpose: z.string().min(1, 'Loan purpose is required'),
  monthlyIncome: z.number().positive('Monthly income must be positive'),
});