import { z } from 'zod';

// Base schemas
export const AddressSchema = z.object({
  street: z.string().min(1, 'Ulica jest wymagana'),
  city: z.string().min(1, 'Miasto jest wymagane'),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy kod pocztowy'),
  country: z.string().min(1, 'Kraj jest wymagany'),
});

export const NoteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Treść notatki jest wymagana'),
  createdAt: z.date(),
  createdBy: z.string(),
  type: z.enum(['GENERAL', 'IMPORTANT', 'REMINDER']),
});

export const FeeSchema = z.object({
  name: z.string().min(1, 'Nazwa opłaty jest wymagana'),
  amount: z.number().positive('Kwota musi być dodatnia'),
  currency: z.string().length(3, 'Waluta musi mieć 3 znaki'),
  frequency: z.enum(['MONTHLY', 'YEARLY', 'ONE_TIME']),
});

// Customer schemas
export const AccountSchema = z.object({
  id: z.string(),
  accountNumber: z.string().min(1, 'Numer konta jest wymagany'),
  iban: z.string().min(15, 'IBAN musi mieć co najmniej 15 znaków'),
  swiftBic: z.string().min(8, 'SWIFT/BIC musi mieć co najmniej 8 znaków'),
  type: z.enum(['PERSONAL_CHECKING', 'BUSINESS', 'SAVINGS', 'INVESTMENT']),
  balance: z.number(),
  currency: z.string().length(3, 'Waluta musi mieć 3 znaki'),
  isActive: z.boolean(),
  openedDate: z.date(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  personalInfo: z.object({
    firstName: z.string().min(1, 'Imię jest wymagane'),
    lastName: z.string().min(1, 'Nazwisko jest wymagane'),
    pesel: z.string().length(11, 'PESEL musi mieć 11 cyfr'),
    dateOfBirth: z.date(),
    email: z.string().email('Nieprawidłowy adres email'),
    phone: z.string().min(9, 'Numer telefonu musi mieć co najmniej 9 cyfr'),
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
  amount: z.number().positive('Kwota musi być dodatnia'),
  currency: z.string().length(3, 'Waluta musi mieć 3 znaki'),
  fromAccount: z.string().min(1, 'Konto źródłowe jest wymagane'),
  toAccount: z.string().optional(),
  description: z.string().min(1, 'Opis jest wymagany'),
  category: z.enum(['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'OTHER']),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  timestamp: z.date(),
  employeeId: z.string(),
  customerId: z.string(),
  referenceNumber: z.string(),
});

// Transfer form schema
export const TransferFormSchema = z.object({
  fromAccount: z.string().min(1, 'Wybierz konto źródłowe'),
  toAccount: z.string().min(1, 'Podaj numer konta odbiorcy'),
  amount: z.number().positive('Kwota musi być dodatnia'),
  description: z.string().min(1, 'Opis przelewu jest wymagany'),
  recipientName: z.string().min(1, 'Nazwa odbiorcy jest wymagana'),
});

// Contact edit schema
export const ContactEditSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Numer telefonu musi mieć co najmniej 9 cyfr'),
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
  requestedAmount: z.number().positive('Kwota musi być dodatnia'),
  termMonths: z.number().min(1, 'Okres musi być co najmniej 1 miesiąc'),
  purpose: z.string().min(1, 'Cel kredytu jest wymagany'),
  monthlyIncome: z.number().positive('Dochód miesięczny musi być dodatni'),
});