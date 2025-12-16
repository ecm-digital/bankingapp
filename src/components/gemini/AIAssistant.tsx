import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, Sparkles } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { GeminiMessage } from '@/api/geminiApi';
import { Customer, Transaction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIAssistantProps {
  customer?: Customer;
  transactions?: Transaction[];
  onClose?: () => void;
}

export function AIAssistant({ customer, transactions, onClose }: AIAssistantProps) {
  const { language } = useLanguage();
  const { chat, isLoading, isAvailable, error } = useGemini();
  const [messages, setMessages] = useState<GeminiMessage[]>([
    {
      role: 'model',
      content: language === 'pl' 
        ? 'Cześć! Jestem asystentem AI. Jak mogę Ci pomóc w obsłudze klienta?'
        : 'Hello! I\'m an AI assistant. How can I help you with customer service?',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: GeminiMessage = {
      role: 'user',
      content: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const response = await chat(newMessages, { customer, transactions });

    if (response) {
      setMessages([
        ...newMessages,
        {
          role: 'model',
          content: response.message,
        },
      ]);
    } else if (error) {
      setMessages([
        ...newMessages,
        {
          role: 'model',
          content: language === 'pl' 
            ? 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'
            : 'Sorry, an error occurred. Please try again.',
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAvailable && !customer) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-amber-600">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm">
            {language === 'pl' 
              ? 'Gemini API nie jest skonfigurowane. Ustaw VITE_GEMINI_API_KEY w pliku .env'
              : 'Gemini API is not configured. Set VITE_GEMINI_API_KEY in .env file'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {language === 'pl' ? 'Asystent AI' : 'AI Assistant'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAvailable 
                ? (language === 'pl' ? 'Gemini AI aktywne' : 'Gemini AI active')
                : (language === 'pl' ? 'Tryb demo' : 'Demo mode')
              }
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'model' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-slate-100 rounded-lg px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'pl' 
                ? 'Zadaj pytanie asystentowi...'
                : 'Ask the assistant a question...'
            }
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}
      </div>
    </Card>
  );
}

