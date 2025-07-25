import { 
  Customer, 
  Transaction, 
  QueueItem, 
  BankProduct, 
  Card, 
  Loan, 
  Employee 
} from '@/types';
import {
  generateMockCustomers,
  generateMockTransactions,
  generateMockQueue,
  generateMockProducts,
  generateMockCards,
  generateMockLoans,
  generateMockEmployees
} from '@/data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Error class
export class MockApiError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = 'MockApiError';
  }
}

// Authentication API
export const authApi = {
  async login(email: string, password: string): Promise<Employee> {
    await delay(1000);
    
    const employees = generateMockEmployees();
    const employee = employees.find(emp => emp.email === email);
    
    if (!employee || password !== 'password123') {
      throw new MockApiError('Invalid login credentials', 401);
    }
    
    return employee;
  },

  async logout(): Promise<void> {
    await delay(300);
    // Mock logout - in real app would invalidate token
  },
};

// Customers API
export const customersApi = {
  async getAll(): Promise<Customer[]> {
    await delay(500);
    return generateMockCustomers();
  },

  async getById(id: string): Promise<Customer> {
    await delay(300);
    
    const customers = generateMockCustomers();
    const customer = customers.find(c => c.id === id);
    
    if (!customer) {
      throw new MockApiError('Customer not found', 404);
    }
    
    return customer;
  },

  async search(query: string): Promise<Customer[]> {
    await delay(300);
    
    if (!query.trim()) return [];
    
    const customers = generateMockCustomers();
    return customers.filter(customer => {
      const fullName = `${customer.personalInfo.firstName} ${customer.personalInfo.lastName}`.toLowerCase();
      const email = customer.personalInfo.email.toLowerCase();
      const phone = customer.personalInfo.phone.toLowerCase();
      const searchTerm = query.toLowerCase();
      
      return fullName.includes(searchTerm) || 
             email.includes(searchTerm) || 
             phone.includes(searchTerm) ||
             customer.id.includes(searchTerm);
    });
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    await delay(500);
    
    const customers = generateMockCustomers();
    const customer = customers.find(c => c.id === id);
    
    if (!customer) {
      throw new MockApiError('Customer not found', 404);
    }
    
    return { ...customer, ...updates };
  },

  async addNote(customerId: string, content: string, type: 'GENERAL' | 'IMPORTANT' | 'REMINDER'): Promise<void> {
    await delay(300);
    
    // Mock note creation - in real app would persist to database
    console.log('Note added:', { customerId, content, type, createdAt: new Date() });
  },
};

// Transactions API
export const transactionsApi = {
  async getAll(): Promise<Transaction[]> {
    await delay(500);
    return generateMockTransactions();
  },

  async getByCustomerId(customerId: string): Promise<Transaction[]> {
    await delay(300);
    
    const transactions = generateMockTransactions();
    return transactions.filter(t => t.customerId === customerId);
  },

  async create(transactionData: Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>): Promise<Transaction> {
    await delay(1000);
    
    // Validate transaction data
    if (transactionData.amount <= 0) {
      throw new MockApiError('Amount must be greater than zero', 400);
    }
    
    if (!transactionData.fromAccount) {
      throw new MockApiError('Source account is required', 400);
    }
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx_${Date.now()}`,
      timestamp: new Date(),
      referenceNumber: `TXN${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      status: 'PENDING',
    };
    
    // Simulate processing delay
    setTimeout(() => {
      console.log('Transaction processed:', newTransaction.id);
    }, 2000);
    
    return newTransaction;
  },

  async updateStatus(id: string, status: Transaction['status']): Promise<void> {
    await delay(300);
    
    console.log('Transaction status updated:', { id, status });
  },
};

// Queue API
export const queueApi = {
  async getAll(): Promise<QueueItem[]> {
    await delay(500);
    return generateMockQueue();
  },

  async add(itemData: Omit<QueueItem, 'id' | 'arrivalTime' | 'queueNumber'>): Promise<QueueItem> {
    await delay(300);
    
    const existingQueue = generateMockQueue();
    const nextQueueNumber = Math.max(...existingQueue.map(item => item.queueNumber), 0) + 1;
    
    const newQueueItem: QueueItem = {
      ...itemData,
      id: `q_${Date.now()}`,
      arrivalTime: new Date(),
      queueNumber: nextQueueNumber,
      status: 'WAITING',
    };
    
    return newQueueItem;
  },

  async updateStatus(id: string, status: QueueItem['status']): Promise<void> {
    await delay(300);
    
    console.log('Queue item status updated:', { id, status });
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    
    console.log('Queue item removed:', id);
  },
};

// Products API
export const productsApi = {
  async getAll(): Promise<BankProduct[]> {
    await delay(500);
    return generateMockProducts();
  },

  async getById(id: string): Promise<BankProduct> {
    await delay(300);
    
    const products = generateMockProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      throw new MockApiError('Product not found', 404);
    }
    
    return product;
  },

  async applyForProduct(productId: string, customerId: string, _applicationData: any): Promise<{ applicationId: string; status: string }> {
    await delay(1500);
    
    // Mock application validation
    if (!productId || !customerId) {
      throw new MockApiError('Brak wymaganych danych wniosku', 400);
    }
    
    const applicationId = `app_${Date.now()}`;
    
    return {
      applicationId,
      status: 'PENDING',
    };
  },
};

// Cards API
export const cardsApi = {
  async getByCustomerId(customerId: string): Promise<Card[]> {
    await delay(300);
    
    const cards = generateMockCards();
    return cards.filter(card => card.customerId === customerId);
  },

  async updateStatus(cardId: string, status: Card['status']): Promise<void> {
    await delay(500);
    
    console.log('Card status updated:', { cardId, status });
  },

  async updateLimits(cardId: string, creditLimit: number): Promise<void> {
    await delay(500);
    
    if (creditLimit < 0) {
      throw new MockApiError('Credit limit cannot be negative', 400);
    }
    
    console.log('Card limits updated:', { cardId, creditLimit });
  },

  async apply(customerId: string, cardType: Card['cardType'], cardBrand: Card['cardBrand']): Promise<{ applicationId: string }> {
    await delay(1000);
    
    const applicationId = `card_app_${Date.now()}`;
    
    console.log('Card application submitted:', {
      applicationId,
      customerId,
      cardType,
      cardBrand,
      status: 'PENDING',
    });
    
    return { applicationId };
  },
};

// Loans API
export const loansApi = {
  async getByCustomerId(customerId: string): Promise<Loan[]> {
    await delay(300);
    
    const loans = generateMockLoans();
    return loans.filter(loan => loan.customerId === customerId);
  },

  async getById(id: string): Promise<Loan> {
    await delay(300);
    
    const loans = generateMockLoans();
    const loan = loans.find(l => l.id === id);
    
    if (!loan) {
      throw new MockApiError('Loan not found', 404);
    }
    
    return loan;
  },

  async apply(customerId: string, loanData: {
    loanType: Loan['loanType'];
    principalAmount: number;
    termMonths: number;
  }): Promise<{ applicationId: string }> {
    await delay(1500);
    
    // Mock loan validation
    if (loanData.principalAmount <= 0) {
      throw new MockApiError('Loan amount must be greater than zero', 400);
    }
    
    if (loanData.termMonths <= 0) {
      throw new MockApiError('Loan term must be greater than zero', 400);
    }
    
    const applicationId = `loan_app_${Date.now()}`;
    
    console.log('Loan application submitted:', {
      applicationId,
      customerId,
      ...loanData,
      status: 'PENDING',
    });
    
    return { applicationId };
  },

  async calculatePayment(principalAmount: number, interestRate: number, termMonths: number): Promise<{
    monthlyPayment: number;
    totalInterest: number;
    totalAmount: number;
  }> {
    await delay(200);
    
    // Simple loan calculation
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    const totalAmount = monthlyPayment * termMonths;
    const totalInterest = totalAmount - principalAmount;
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  },
};