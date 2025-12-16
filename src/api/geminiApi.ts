import { GoogleGenerativeAI } from '@google/generative-ai';
import { Customer, Transaction } from '@/types';

// Initialize Gemini API
// In production, this should be stored in environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Available models (try in order)
// Note: Model names may vary based on API version and region
const AVAILABLE_MODELS = [
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-pro',
  'gemini-1.0-pro',
];

export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GeminiAnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GeminiChatResponse {
  message: string;
  suggestions?: string[];
}

class GeminiService {
  private model: any = null;

  constructor() {
    if (genAI && API_KEY) {
      // Initialize will happen lazily on first use
      // This allows us to handle errors better
      console.log('🔧 Gemini API key found, will initialize model on first use');
    } else {
      console.warn('⚠️ Gemini API not configured. Set VITE_GEMINI_API_KEY environment variable.');
    }
  }

  /**
   * Initialize model dynamically, trying available models
   */
  private async initializeModel(): Promise<boolean> {
    if (this.model) {
      return true; // Already initialized
    }

    if (!genAI || !API_KEY) {
      return false;
    }

    // Try available models in order
    for (const modelName of AVAILABLE_MODELS) {
      try {
        const testModel = genAI.getGenerativeModel({ model: modelName });
        // Don't test immediately - just try to use it and catch errors
        // This avoids unnecessary API calls during initialization
        this.model = testModel;
        console.log(`✅ Gemini API model set to ${modelName} (will test on first use)`);
        return true;
      } catch (error: any) {
        // Check if it's a 404 (model not found) or other error
        if (error?.message?.includes('404') || error?.message?.includes('not found')) {
          console.warn(`⚠️ Model ${modelName} not available, trying next...`);
          continue;
        } else {
          // Other error during initialization
          console.warn(`⚠️ Error initializing ${modelName}:`, error.message);
          // Still try next model
          continue;
        }
      }
    }

    // If all models failed
    console.error('❌ Failed to initialize any Gemini model. Please check:');
    console.error('1. Your API key is valid');
    console.error('2. Your API key has access to Gemini models');
    console.error('3. Visit https://makersuite.google.com/app/apikey to verify');
    console.error('4. Check available models at: https://ai.google.dev/models');
    return false;
  }

  /**
   * Check if Gemini API is available
   */
  isAvailable(): boolean {
    return API_KEY !== '';
  }

  /**
   * Get initialized model, initializing if needed
   */
  private async getModel(): Promise<any> {
    if (!this.model) {
      await this.initializeModel();
    }
    return this.model;
  }

  /**
   * Analyze customer data and provide insights
   */
  async analyzeCustomer(customer: Customer, transactions: Transaction[]): Promise<GeminiAnalysisResult> {
    if (!this.isAvailable()) {
      return this.getMockAnalysis();
    }

    const model = await this.getModel();
    if (!model) {
      return this.getMockAnalysis();
    }

    try {
      const prompt = `Jako ekspert bankowy, przeanalizuj dane klienta i transakcje. 
      
Klient: ${customer.personalInfo.firstName} ${customer.personalInfo.lastName}
Segment: ${customer.bankingInfo.segment}
Konta: ${customer.bankingInfo.accounts.length}
Liczba transakcji: ${transactions.length}

Przeanalizuj:
1. Wzorce transakcji
2. Potencjalne potrzeby klienta
3. Rekomendacje produktów
4. Poziom ryzyka

Odpowiedz w formacie JSON:
{
  "summary": "krótkie podsumowanie",
  "insights": ["insight1", "insight2"],
  "recommendations": ["rekomendacja1", "rekomendacja2"],
  "riskLevel": "LOW|MEDIUM|HIGH"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON from response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.warn('Failed to parse JSON from Gemini response:', e);
        // If JSON parsing fails, return structured response
      }

      return {
        summary: text.substring(0, 200),
        insights: [text.substring(0, 100)],
        recommendations: ['Przeanalizuj szczegóły klienta'],
        riskLevel: 'MEDIUM',
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Return mock analysis on error
      const mock = this.getMockAnalysis();
      if (error?.message) {
        mock.summary = `Błąd API: ${error.message}. Wyświetlam przykładową analizę.`;
      }
      return mock;
    }
  }

  /**
   * Generate product recommendations for a customer
   */
  async recommendProducts(customer: Customer, availableProducts: any[]): Promise<string[]> {
    if (!this.isAvailable()) {
      return ['Karta kredytowa', 'Konto oszczędnościowe', 'Lokata'];
    }

    const model = await this.getModel();
    if (!model) {
      return ['Karta kredytowa', 'Konto oszczędnościowe'];
    }

    try {
      const prompt = `Na podstawie profilu klienta, zaproponuj 3 najlepsze produkty bankowe.

Klient: ${customer.personalInfo.firstName} ${customer.personalInfo.lastName}
Segment: ${customer.bankingInfo.segment}
Liczba kont: ${customer.bankingInfo.accounts.length}

Dostępne produkty: ${availableProducts.map((p: any) => p.name).join(', ')}

Odpowiedz tylko nazwami produktów oddzielonymi przecinkami.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    } catch (error) {
      console.error('Gemini API error:', error);
      return ['Karta kredytowa', 'Konto oszczędnościowe'];
    }
  }

  /**
   * Chat with AI assistant
   */
  async chat(messages: GeminiMessage[], context?: { customer?: Customer; transactions?: Transaction[] }): Promise<GeminiChatResponse> {
    if (!this.isAvailable()) {
      return {
        message: 'Gemini API nie jest skonfigurowane. Ustaw zmienną środowiskową VITE_GEMINI_API_KEY.',
        suggestions: ['Sprawdź konfigurację API'],
      };
    }

    try {
      const lastMessage = messages[messages.length - 1];
      
      // Build conversation history
      let historyText = '';
      if (messages.length > 1) {
        historyText = '\n\nHistoria rozmowy:\n';
        messages.slice(0, -1).forEach(msg => {
          historyText += `${msg.role === 'user' ? 'Pracownik' : 'Asystent'}: ${msg.content}\n`;
        });
      }

      // Build context prompt
      let contextPrompt = '';
      if (context?.customer) {
        contextPrompt = `\n\nKontekst: Pracujesz z klientem ${context.customer.personalInfo.firstName} ${context.customer.personalInfo.lastName} (Segment: ${context.customer.bankingInfo.segment}).`;
      }
      if (context?.transactions && context.transactions.length > 0) {
        contextPrompt += ` Klient ma ${context.transactions.length} transakcji w historii.`;
      }

      const fullPrompt = `Jesteś asystentem AI dla pracowników banku. Pomagasz w obsłudze klientów i codziennych zadaniach.${contextPrompt}${historyText}\n\nOdpowiedz profesjonalnie i pomocnie na pytanie pracownika banku.\n\nPracownik: ${lastMessage.content}\nAsystent:`;

      const model = await this.getModel();
      if (!model) {
        return {
          message: 'Nie udało się zainicjalizować modelu Gemini. Sprawdź konfigurację API.',
          suggestions: ['Sprawdź klucz API', 'Sprawdź konsolę przeglądarki'],
        };
      }

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        message: text,
        suggestions: this.extractSuggestions(text),
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // More detailed error handling
      let errorMessage = 'Przepraszam, wystąpił błąd podczas komunikacji z asystentem AI.';
      
      if (error?.message) {
        if (error.message.includes('API_KEY')) {
          errorMessage = 'Błąd autoryzacji API. Sprawdź czy klucz API jest poprawny.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'Przekroczono limit żądań API. Spróbuj ponownie za chwilę.';
        } else if (error.message.includes('safety')) {
          errorMessage = 'Żądanie zostało zablokowane z powodu polityki bezpieczeństwa.';
        } else {
          errorMessage = `Błąd: ${error.message}`;
        }
      }
      
      return {
        message: errorMessage,
        suggestions: ['Spróbuj ponownie', 'Sprawdź konfigurację API', 'Sprawdź konsolę przeglądarki'],
      };
    }
  }

  /**
   * Analyze transaction patterns
   */
  async analyzeTransactions(transactions: Transaction[]): Promise<string> {
    if (!this.isAvailable()) {
      return 'Analiza transakcji wymaga skonfigurowanego Gemini API.';
    }

    const model = await this.getModel();
    if (!model) {
      return 'Nie udało się zainicjalizować modelu Gemini.';
    }

    try {
      const summary = {
        total: transactions.length,
        deposits: transactions.filter(t => t.type === 'DEPOSIT').length,
        withdrawals: transactions.filter(t => t.type === 'WITHDRAWAL').length,
        transfers: transactions.filter(t => t.type === 'TRANSFER').length,
      };

      const prompt = `Przeanalizuj wzorce transakcji bankowych:

Statystyki:
- Łącznie: ${summary.total}
- Wpłaty: ${summary.deposits}
- Wypłaty: ${summary.withdrawals}
- Przelewy: ${summary.transfers}

Przeanalizuj wzorce i zaproponuj krótkie podsumowanie (max 150 słów).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Nie udało się przeanalizować transakcji.';
    }
  }

  /**
   * Generate report summary
   */
  async generateReportSummary(data: any): Promise<string> {
    if (!this.isAvailable()) {
      return 'Generowanie raportu wymaga skonfigurowanego Gemini API.';
    }

    const model = await this.getModel();
    if (!model) {
      return 'Nie udało się zainicjalizować modelu Gemini.';
    }

    try {
      const prompt = `Wygeneruj profesjonalne podsumowanie raportu bankowego na podstawie danych:

${JSON.stringify(data, null, 2)}

Podsumowanie powinno być zwięzłe (max 200 słów) i profesjonalne.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Nie udało się wygenerować podsumowania raportu.';
    }
  }

  private extractSuggestions(text: string): string[] {
    // Simple extraction of suggestions from text
    const suggestions: string[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
        suggestions.push(line.replace(/^[-•*\d.]\s/, '').trim());
      }
    });

    return suggestions.slice(0, 3); // Max 3 suggestions
  }

  private getMockAnalysis(): GeminiAnalysisResult {
    return {
      summary: 'Klient wymaga szczegółowej analizy. Sprawdź historię transakcji i produkty.',
      insights: [
        'Regularne transakcje wskazują na stabilność finansową',
        'Warto rozważyć dodatkowe produkty oszczędnościowe',
      ],
      recommendations: [
        'Zaproponuj kartę kredytową z programem lojalnościowym',
        'Rozważ ofertę konta oszczędnościowego',
      ],
      riskLevel: 'LOW',
    };
  }
}

export const geminiService = new GeminiService();

