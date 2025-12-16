import { useState, useCallback } from 'react';
import { geminiService, GeminiMessage, GeminiAnalysisResult, GeminiChatResponse } from '@/api/geminiApi';
import { Customer, Transaction } from '@/types';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAvailable = geminiService.isAvailable();

  const analyzeCustomer = useCallback(async (
    customer: Customer,
    transactions: Transaction[]
  ): Promise<GeminiAnalysisResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await geminiService.analyzeCustomer(customer, transactions);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd analizy klienta';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recommendProducts = useCallback(async (
    customer: Customer,
    availableProducts: any[]
  ): Promise<string[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const recommendations = await geminiService.recommendProducts(customer, availableProducts);
      return recommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd generowania rekomendacji';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chat = useCallback(async (
    messages: GeminiMessage[],
    context?: { customer?: Customer; transactions?: Transaction[] }
  ): Promise<GeminiChatResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.chat(messages, context);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd komunikacji z asystentem';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeTransactions = useCallback(async (
    transactions: Transaction[]
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const analysis = await geminiService.analyzeTransactions(transactions);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd analizy transakcji';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReportSummary = useCallback(async (
    data: any
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const summary = await geminiService.generateReportSummary(data);
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd generowania raportu';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAvailable,
    isLoading,
    error,
    analyzeCustomer,
    recommendProducts,
    chat,
    analyzeTransactions,
    generateReportSummary,
    clearError,
  };
};


