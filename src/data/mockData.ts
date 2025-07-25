import { Customer, Transaction, QueueItem, BankProduct, Card, Loan, Employee } from '@/types';

// Mock data generators
export const generateMockCustomers = (): Customer[] => {
  return [
    {
      id: '1',
      personalInfo: {
        firstName: 'Anna',
        lastName: 'Johnson',
        pesel: '85010112345',
        dateOfBirth: new Date('1985-01-01'),
        email: 'anna.johnson@email.com',
        phone: '+1 555 123 4567',
        address: {
          street: '123 Main Street',
          city: 'New York',
          postalCode: '10001',
          country: 'USA',
        },
      },
      bankingInfo: {
        customerSince: new Date('2020-03-15'),
        segment: 'PREMIUM',
        riskProfile: 'LOW',
        accounts: [
          {
            id: 'acc1',
            accountNumber: '1234567890123456',
            iban: 'US64SVBKUS6S3300958879',
            swiftBic: 'SVBKUS6S',
            type: 'PERSONAL_CHECKING',
            balance: 15420.50,
            currency: 'USD',
            isActive: true,
            openedDate: new Date('2020-03-15'),
          },
        ],
        products: [],
      },
      notes: [
        {
          id: 'note1',
          content: 'Customer interested in mortgage loan',
          createdAt: new Date('2024-01-15'),
          createdBy: 'emp1',
          type: 'IMPORTANT',
        },
      ],
      lastActivity: new Date('2024-01-20'),
      status: 'ACTIVE',
    },
    {
      id: '2',
      personalInfo: {
        firstName: 'Peter',
        lastName: 'Smith',
        pesel: '90050567890',
        dateOfBirth: new Date('1990-05-05'),
        email: 'peter.smith@email.com',
        phone: '+1 555 987 6543',
        address: {
          street: '45 Oak Avenue',
          city: 'Chicago',
          postalCode: '60601',
          country: 'USA',
        },
      },
      bankingInfo: {
        customerSince: new Date('2018-07-22'),
        segment: 'RETAIL',
        riskProfile: 'MEDIUM',
        accounts: [
          {
            id: 'acc2',
            accountNumber: '9876543210987654',
            iban: 'US64SVBKUS6S3300958880',
            swiftBic: 'SVBKUS6S',
            type: 'PERSONAL_CHECKING',
            balance: 3250.75,
            currency: 'USD',
            isActive: true,
            openedDate: new Date('2018-07-22'),
          },
        ],
        products: [],
      },
      notes: [],
      lastActivity: new Date('2024-01-18'),
      status: 'ACTIVE',
    },
    {
      id: '3',
      personalInfo: {
        firstName: 'Maria',
        lastName: 'Williams',
        pesel: '78032298765',
        dateOfBirth: new Date('1978-03-22'),
        email: 'maria.williams@email.com',
        phone: '+1 555 555 1234',
        address: {
          street: '78 Pine Street',
          city: 'Boston',
          postalCode: '02101',
          country: 'USA',
        },
      },
      bankingInfo: {
        customerSince: new Date('2015-11-10'),
        segment: 'PRIVATE',
        riskProfile: 'LOW',
        accounts: [
          {
            id: 'acc3',
            accountNumber: '5555666677778888',
            iban: 'US64SVBKUS6S3300958881',
            swiftBic: 'SVBKUS6S',
            type: 'PERSONAL_CHECKING',
            balance: 45780.25,
            currency: 'USD',
            isActive: true,
            openedDate: new Date('2015-11-10'),
          },
          {
            id: 'acc4',
            accountNumber: '5555666677779999',
            iban: 'US64SVBKUS6S3300958883',
            swiftBic: 'SVBKUS6S',
            type: 'SAVINGS',
            balance: 125000.00,
            currency: 'USD',
            isActive: true,
            openedDate: new Date('2016-05-20'),
          },
        ],
        products: [],
      },
      notes: [
        {
          id: 'note2',
          content: 'VIP client - priority service',
          createdAt: new Date('2024-01-10'),
          createdBy: 'emp1',
          type: 'IMPORTANT',
        },
      ],
      lastActivity: new Date('2024-01-22'),
      status: 'ACTIVE',
    },
    {
      id: '4',
      personalInfo: {
        firstName: 'Thomas',
        lastName: 'Green',
        pesel: '92081534567',
        dateOfBirth: new Date('1992-08-15'),
        email: 'thomas.green@email.com',
        phone: '+1 555 789 0123',
        address: {
          street: '89 Elm Street',
          city: 'Philadelphia',
          postalCode: '19101',
          country: 'USA',
        },
      },
      bankingInfo: {
        customerSince: new Date('2019-09-05'),
        segment: 'RETAIL',
        riskProfile: 'HIGH',
        accounts: [
          {
            id: 'acc5',
            accountNumber: '1111222233334444',
            iban: 'US64SVBKUS6S3300958882',
            swiftBic: 'SVBKUS6S',
            type: 'PERSONAL_CHECKING',
            balance: -150.00,
            currency: 'USD',
            isActive: true,
            openedDate: new Date('2019-09-05'),
          },
        ],
        products: [],
      },
      notes: [
        {
          id: 'note3',
          content: 'Account overdrawn - contact regarding repayment',
          createdAt: new Date('2024-01-19'),
          createdBy: 'emp2',
          type: 'IMPORTANT',
        },
      ],
      lastActivity: new Date('2024-01-19'),
      status: 'ACTIVE',
    },
  ];
};

export const generateMockTransactions = (): Transaction[] => {
  return [
    {
      id: 'tx1',
      type: 'TRANSFER',
      amount: 500.00,
      currency: 'USD',
      fromAccount: '1234567890123456',
      toAccount: '9876543210987654',
      description: 'Transfer for purchases',
      category: 'SHOPPING',
      status: 'COMPLETED',
      timestamp: new Date('2024-01-20T10:30:00'),
      employeeId: 'emp1',
      customerId: '1',
      referenceNumber: 'TXN20240120001',
    },
    {
      id: 'tx2',
      type: 'WITHDRAWAL',
      amount: 200.00,
      currency: 'USD',
      fromAccount: '1234567890123456',
      description: 'ATM withdrawal',
      category: 'OTHER',
      status: 'COMPLETED',
      timestamp: new Date('2024-01-19T14:15:00'),
      employeeId: 'emp1',
      customerId: '1',
      referenceNumber: 'TXN20240119001',
    },
    {
      id: 'tx3',
      type: 'DEPOSIT',
      amount: 1000.00,
      currency: 'USD',
      fromAccount: '9876543210987654',
      description: 'Cash deposit',
      category: 'OTHER',
      status: 'COMPLETED',
      timestamp: new Date('2024-01-18T09:45:00'),
      employeeId: 'emp2',
      customerId: '2',
      referenceNumber: 'TXN20240118001',
    },
  ];
};

export const generateMockQueue = (): QueueItem[] => {
  return [
    {
      id: 'q1',
      customerId: '1',
      customerName: 'Anna Johnson',
      serviceType: 'Loan consultation',
      priority: 'HIGH',
      estimatedTime: 30,
      arrivalTime: new Date('2024-01-20T09:00:00'),
      status: 'WAITING',
      queueNumber: 1,
    },
    {
      id: 'q2',
      customerId: '2',
      customerName: 'Peter Smith',
      serviceType: 'Account opening',
      priority: 'NORMAL',
      estimatedTime: 20,
      arrivalTime: new Date('2024-01-20T09:15:00'),
      status: 'WAITING',
      queueNumber: 2,
    },
  ];
};

export const generateMockProducts = (): BankProduct[] => {
  return [
    {
      id: 'prod1',
      name: 'Premium Personal Account',
      category: 'ACCOUNT',
      description: 'Account with premium service package for demanding customers',
      features: [
        'No transfer fees',
        'Free debit card',
        'Higher transaction limits',
        'Dedicated advisor',
      ],
      requirements: [
        'Minimum age: 18 years',
        'Monthly income min. $3000',
        'Identity documents',
      ],
      interestRate: 0.5,
      fees: [
        {
          name: 'Account maintenance',
          amount: 0,
          currency: 'USD',
          frequency: 'MONTHLY',
        },
      ],
      isPromotional: true,
      promotionDetails: {
        title: 'Launch promotion',
        description: 'First 6 months without fees',
        validUntil: new Date('2024-06-30'),
        discountPercentage: 100,
      },
    },
    {
      id: 'prod2',
      name: 'Express Cash Loan',
      category: 'LOAN',
      description: 'Fast cash loan with 15-minute decision',
      features: [
        '15-minute decision',
        'Same-day payout',
        'No collateral up to $50,000',
        'Flexible installments',
      ],
      requirements: [
        'Minimum age: 21 years',
        'Stable employment min. 3 months',
        'Monthly income min. $2,000',
      ],
      interestRate: 9.9,
      fees: [
        {
          name: 'Commission',
          amount: 299,
          currency: 'USD',
          frequency: 'ONE_TIME',
        },
      ],
      isPromotional: false,
    },
    {
      id: 'prod3',
      name: 'Term Deposit Plus',
      category: 'INVESTMENT',
      description: 'Safe deposit with attractive interest rate',
      features: [
        'Interest rate up to 5.5% per year',
        'Interest capitalization',
        'Extension option',
        'Deposit insurance',
      ],
      requirements: [
        'Minimum amount: $1,000',
        'Deposit period: 3-24 months',
        'Bank account required',
      ],
      interestRate: 5.5,
      fees: [],
      isPromotional: true,
      promotionDetails: {
        title: 'Increased interest rate',
        description: 'Additional 0.5% for new customers',
        validUntil: new Date('2024-03-31'),
        specialOffer: 'First 3 months with bonus interest rate',
      },
    },
    {
      id: 'prod4',
      name: 'Home Insurance',
      category: 'INSURANCE',
      description: 'Comprehensive protection for your home and apartment',
      features: [
        'Fire and flood protection',
        'Equipment insurance',
        '24/7 assistance',
        'Legal protection',
      ],
      requirements: [
        'Property age max. 100 years',
        'Technical condition assessment',
        'Ownership documents',
      ],
      fees: [
        {
          name: 'Monthly premium',
          amount: 45,
          currency: 'USD',
          frequency: 'MONTHLY',
        },
      ],
      isPromotional: false,
    },
  ];
};export
 const generateMockCards = (): Card[] => {
  return [
    {
      id: 'card1',
      customerId: '1',
      cardNumber: '**** **** **** 1234',
      cardType: 'DEBIT',
      cardBrand: 'VISA',
      status: 'ACTIVE',
      expiryDate: new Date('2026-12-31'),
      issuedDate: new Date('2020-03-15'),
      lastUsed: new Date('2024-01-19'),
    },
    {
      id: 'card2',
      customerId: '1',
      cardNumber: '**** **** **** 5678',
      cardType: 'CREDIT',
      cardBrand: 'MASTERCARD',
      status: 'ACTIVE',
      expiryDate: new Date('2025-08-31'),
      creditLimit: 10000,
      availableLimit: 8500,
      issuedDate: new Date('2021-08-15'),
      lastUsed: new Date('2024-01-18'),
    },
  ];
};

export const generateMockLoans = (): Loan[] => {
  return [
    {
      id: 'loan1',
      customerId: '1',
      loanType: 'PERSONAL',
      principalAmount: 50000,
      currentBalance: 35000,
      interestRate: 8.5,
      termMonths: 60,
      monthlyPayment: 1025.50,
      nextPaymentDate: new Date('2024-02-15'),
      status: 'ACTIVE',
      startDate: new Date('2022-02-15'),
      paymentHistory: [
        {
          id: 'pay1',
          amount: 1025.50,
          paymentDate: new Date('2024-01-15'),
          status: 'PAID',
          principalAmount: 750.50,
          interestAmount: 275.00,
        },
      ],
    },
  ];
};

export const generateMockEmployees = (): Employee[] => {
  return [
    {
      id: 'emp1',
      firstName: 'Katherine',
      lastName: 'Wilson',
      email: 'k.wilson@bank.com',
      role: 'ADVISOR',
      department: 'Customer Service',
    },
    {
      id: 'emp2',
      firstName: 'Martin',
      lastName: 'Davis',
      email: 'm.davis@bank.com',
      role: 'TELLER',
      department: 'Cash Operations',
    },
  ];
};