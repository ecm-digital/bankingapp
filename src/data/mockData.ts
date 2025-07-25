import { Customer, Transaction, QueueItem, BankProduct, Card, Loan, Employee } from '@/types';

// Mock data generators
export const generateMockCustomers = (): Customer[] => {
  return [
    {
      id: '1',
      personalInfo: {
        firstName: 'Anna',
        lastName: 'Kowalska',
        pesel: '85010112345',
        dateOfBirth: new Date('1985-01-01'),
        email: 'anna.kowalska@email.com',
        phone: '+48 123 456 789',
        address: {
          street: 'ul. Marszałkowska 123',
          city: 'Warszawa',
          postalCode: '00-001',
          country: 'Polska',
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
            iban: 'PL61109010140000071219812874',
            swiftBic: 'BIGBPLPW',
            type: 'PERSONAL_CHECKING',
            balance: 15420.50,
            currency: 'PLN',
            isActive: true,
            openedDate: new Date('2020-03-15'),
          },
        ],
        products: [],
      },
      notes: [
        {
          id: 'note1',
          content: 'Klient zainteresowany kredytem hipotecznym',
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
        firstName: 'Piotr',
        lastName: 'Nowak',
        pesel: '90050567890',
        dateOfBirth: new Date('1990-05-05'),
        email: 'piotr.nowak@email.com',
        phone: '+48 987 654 321',
        address: {
          street: 'ul. Krakowska 45',
          city: 'Kraków',
          postalCode: '30-001',
          country: 'Polska',
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
            iban: 'PL27114020040000300201355387',
            swiftBic: 'BIGBPLPW',
            type: 'PERSONAL_CHECKING',
            balance: 3250.75,
            currency: 'PLN',
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
        lastName: 'Wiśniewska',
        pesel: '78032298765',
        dateOfBirth: new Date('1978-03-22'),
        email: 'maria.wisniewska@email.com',
        phone: '+48 555 123 456',
        address: {
          street: 'ul. Długa 78',
          city: 'Gdańsk',
          postalCode: '80-001',
          country: 'Polska',
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
            iban: 'PL83109010140000071219812875',
            swiftBic: 'BIGBPLPW',
            type: 'PERSONAL_CHECKING',
            balance: 45780.25,
            currency: 'PLN',
            isActive: true,
            openedDate: new Date('2015-11-10'),
          },
          {
            id: 'acc4',
            accountNumber: '5555666677779999',
            iban: 'PL84109010140000071219812876',
            swiftBic: 'BIGBPLPW',
            type: 'SAVINGS',
            balance: 125000.00,
            currency: 'PLN',
            isActive: true,
            openedDate: new Date('2016-05-20'),
          },
        ],
        products: [],
      },
      notes: [
        {
          id: 'note2',
          content: 'VIP klient - priorytetowa obsługa',
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
        firstName: 'Tomasz',
        lastName: 'Zieliński',
        pesel: '92081534567',
        dateOfBirth: new Date('1992-08-15'),
        email: 'tomasz.zielinski@email.com',
        phone: '+48 666 789 012',
        address: {
          street: 'ul. Słowackiego 12',
          city: 'Wrocław',
          postalCode: '50-001',
          country: 'Polska',
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
            iban: 'PL85109010140000071219812877',
            swiftBic: 'BIGBPLPW',
            type: 'PERSONAL_CHECKING',
            balance: -150.00,
            currency: 'PLN',
            isActive: true,
            openedDate: new Date('2019-09-05'),
          },
        ],
        products: [],
      },
      notes: [
        {
          id: 'note3',
          content: 'Konto przekroczone - skontaktować się w sprawie spłaty',
          createdAt: new Date('2024-01-19'),
          createdBy: 'emp2',
          type: 'IMPORTANT',
        },
      ],
      lastActivity: new Date('2024-01-19'),
      status: 'ACTIVE',
    },
  ];
};e
xport const generateMockTransactions = (): Transaction[] => {
  return [
    {
      id: 'tx1',
      type: 'TRANSFER',
      amount: 500.00,
      currency: 'PLN',
      fromAccount: '1234567890123456',
      toAccount: '9876543210987654',
      description: 'Przelew za zakupy',
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
      currency: 'PLN',
      fromAccount: '1234567890123456',
      description: 'Wypłata z bankomatu',
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
      currency: 'PLN',
      fromAccount: '9876543210987654',
      description: 'Wpłata gotówki',
      category: 'OTHER',
      status: 'COMPLETED',
      timestamp: new Date('2024-01-18T09:45:00'),
      employeeId: 'emp2',
      customerId: '2',
      referenceNumber: 'TXN20240118001',
    },
  ];
};e
xport const generateMockQueue = (): QueueItem[] => {
  return [
    {
      id: 'q1',
      customerId: '1',
      customerName: 'Anna Kowalska',
      serviceType: 'Konsultacja kredytowa',
      priority: 'HIGH',
      estimatedTime: 30,
      arrivalTime: new Date('2024-01-20T09:00:00'),
      status: 'WAITING',
      queueNumber: 1,
    },
    {
      id: 'q2',
      customerId: '2',
      customerName: 'Piotr Nowak',
      serviceType: 'Otwarcie konta',
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
      name: 'Konto Osobiste Premium',
      category: 'ACCOUNT',
      description: 'Konto z pakietem usług premium dla wymagających klientów',
      features: [
        'Brak opłat za przelewy',
        'Darmowa karta debetowa',
        'Wyższe limity transakcji',
        'Dedykowany doradca',
      ],
      requirements: [
        'Minimalny wiek: 18 lat',
        'Miesięczne wpływy min. 3000 PLN',
        'Dokumenty tożsamości',
      ],
      interestRate: 0.5,
      fees: [
        {
          name: 'Prowadzenie konta',
          amount: 0,
          currency: 'PLN',
          frequency: 'MONTHLY',
        },
      ],
      isPromotional: true,
      promotionDetails: {
        title: 'Promocja na start',
        description: 'Pierwsze 6 miesięcy bez opłat',
        validUntil: new Date('2024-06-30'),
        discountPercentage: 100,
      },
    },
    {
      id: 'prod2',
      name: 'Kredyt Gotówkowy Express',
      category: 'LOAN',
      description: 'Szybki kredyt gotówkowy z decyzją w 15 minut',
      features: [
        'Decyzja w 15 minut',
        'Wypłata tego samego dnia',
        'Bez zabezpieczeń do 50 000 PLN',
        'Elastyczne raty',
      ],
      requirements: [
        'Minimalny wiek: 21 lat',
        'Stałe zatrudnienie min. 3 miesiące',
        'Miesięczny dochód min. 2000 PLN',
      ],
      interestRate: 9.9,
      fees: [
        {
          name: 'Prowizja',
          amount: 299,
          currency: 'PLN',
          frequency: 'ONE_TIME',
        },
      ],
      isPromotional: false,
    },
    {
      id: 'prod3',
      name: 'Lokata Terminowa Plus',
      category: 'INVESTMENT',
      description: 'Bezpieczna lokata z atrakcyjnym oprocentowaniem',
      features: [
        'Oprocentowanie do 5.5% w skali roku',
        'Kapitalizacja odsetek',
        'Możliwość przedłużenia',
        'Ubezpieczenie depozytów',
      ],
      requirements: [
        'Minimalna kwota: 1000 PLN',
        'Okres lokaty: 3-24 miesiące',
        'Posiadanie konta w banku',
      ],
      interestRate: 5.5,
      fees: [],
      isPromotional: true,
      promotionDetails: {
        title: 'Podwyższone oprocentowanie',
        description: 'Dodatkowe 0.5% dla nowych klientów',
        validUntil: new Date('2024-03-31'),
        specialOffer: 'Pierwsze 3 miesiące z bonusowym oprocentowaniem',
      },
    },
    {
      id: 'prod4',
      name: 'Ubezpieczenie Mieszkania',
      category: 'INSURANCE',
      description: 'Kompleksowa ochrona Twojego domu i mieszkania',
      features: [
        'Ochrona przed pożarem i zalaniem',
        'Ubezpieczenie wyposażenia',
        'Assistance 24/7',
        'Ochrona prawna',
      ],
      requirements: [
        'Wiek nieruchomości max. 100 lat',
        'Ocena stanu technicznego',
        'Dokumenty własności',
      ],
      fees: [
        {
          name: 'Składka miesięczna',
          amount: 45,
          currency: 'PLN',
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
      firstName: 'Katarzyna',
      lastName: 'Wiśniewska',
      email: 'k.wisniewska@bank.pl',
      role: 'ADVISOR',
      department: 'Obsługa Klienta',
    },
    {
      id: 'emp2',
      firstName: 'Marcin',
      lastName: 'Zieliński',
      email: 'm.zielinski@bank.pl',
      role: 'TELLER',
      department: 'Operacje Kasowe',
    },
  ];
};