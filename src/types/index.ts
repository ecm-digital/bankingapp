// Base types
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  type: 'GENERAL' | 'IMPORTANT' | 'REMINDER';
}

export interface Fee {
  name: string;
  amount: number;
  currency: string;
  frequency: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
}

export interface PromotionDetails {
  title: string;
  description: string;
  validUntil: Date;
  discountPercentage?: number;
  specialOffer?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  principalAmount: number;
  interestAmount: number;
}

// Customer Model
export interface Account {
  id: string;
  accountNumber: string;
  iban: string;
  swiftBic: string;
  type: 'PERSONAL_CHECKING' | 'BUSINESS' | 'SAVINGS' | 'INVESTMENT';
  balance: number;
  currency: string;
  isActive: boolean;
  openedDate: Date;
}

export interface Customer {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    pesel: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address: Address;
  };
  bankingInfo: {
    customerSince: Date;
    segment: 'RETAIL' | 'PREMIUM' | 'PRIVATE';
    riskProfile: 'LOW' | 'MEDIUM' | 'HIGH';
    accounts: Account[];
    products: BankProduct[];
  };
  notes: Note[];
  lastActivity: Date;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Transaction Model
export interface Transaction {
  id: string;
  type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT';
  amount: number;
  currency: string;
  fromAccount: string;
  toAccount?: string;
  description: string;
  category: 'FOOD' | 'TRANSPORT' | 'SHOPPING' | 'BILLS' | 'ENTERTAINMENT' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  timestamp: Date;
  employeeId: string;
  customerId: string;
  referenceNumber: string;
}

// Queue Item Model
export interface QueueItem {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  estimatedTime: number;
  arrivalTime: Date;
  status: 'WAITING' | 'IN_SERVICE' | 'COMPLETED';
  assignedEmployee?: string;
  queueNumber: number;
}

// Bank Product Model
export interface BankProduct {
  id: string;
  name: string;
  category: 'ACCOUNT' | 'LOAN' | 'INVESTMENT' | 'INSURANCE';
  description: string;
  features: string[];
  requirements: string[];
  interestRate?: number;
  fees: Fee[];
  isPromotional: boolean;
  promotionDetails?: PromotionDetails;
}

// Card Model
export interface Card {
  id: string;
  customerId: string;
  cardNumber: string; // Masked for security
  cardType: 'DEBIT' | 'CREDIT' | 'PREPAID';
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX';
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'PENDING';
  expiryDate: Date;
  creditLimit?: number;
  availableLimit?: number;
  issuedDate: Date;
  lastUsed?: Date;
}

// Loan Model
export interface Loan {
  id: string;
  customerId: string;
  loanType: 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'BUSINESS';
  principalAmount: number;
  currentBalance: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  nextPaymentDate: Date;
  status: 'ACTIVE' | 'PAID_OFF' | 'DELINQUENT' | 'DEFAULT';
  startDate: Date;
  paymentHistory: PaymentRecord[];
}

// Employee Model
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'TELLER' | 'ADVISOR' | 'MANAGER';
  department: string;
  avatar?: string;
}

// Error Model
export interface AppError {
  type: 'VALIDATION' | 'NETWORK' | 'AUTHORIZATION' | 'SYSTEM';
  message: string;
  details?: string;
  recoverable: boolean;
  actions?: ErrorAction[];
}

export interface ErrorAction {
  label: string;
  action: () => void;
}