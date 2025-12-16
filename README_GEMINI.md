# Gemini AI Integration

## Overview

This project includes integration with Google's Gemini AI API to provide intelligent assistance for bank employees. The integration includes:

- **AI Assistant**: Chat interface for employees to ask questions and get help
- **Customer Analysis**: AI-powered analysis of customer data and transaction patterns
- **Product Recommendations**: Intelligent product suggestions based on customer profile
- **Transaction Analysis**: Pattern analysis and insights from transaction data

## Setup

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

Or copy from example:

```bash
cp .env.example .env
```

Then edit `.env` and add your API key.

### 3. Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install @google/generative-ai
```

## Usage

### AI Assistant Component

The AI Assistant provides a chat interface for employees:

```tsx
import { AIAssistant } from '@/components/gemini';

<AIAssistant
  customer={selectedCustomer}
  transactions={customerTransactions}
/>
```

### Customer Analysis Component

Analyze customer data with AI:

```tsx
import { CustomerAnalysis } from '@/components/gemini';

<CustomerAnalysis
  customer={customer}
  transactions={transactions}
/>
```

### Using the Hook

You can also use the `useGemini` hook directly:

```tsx
import { useGemini } from '@/hooks/useGemini';

const {
  analyzeCustomer,
  recommendProducts,
  chat,
  analyzeTransactions,
  isAvailable,
  isLoading,
  error
} = useGemini();

// Analyze customer
const analysis = await analyzeCustomer(customer, transactions);

// Get product recommendations
const recommendations = await recommendProducts(customer, products);

// Chat with AI
const response = await chat(messages, { customer, transactions });
```

## Features

### 1. Customer Analysis
- Analyzes customer profile and transaction history
- Provides insights and recommendations
- Risk level assessment
- Product suggestions

### 2. AI Assistant Chat
- Context-aware responses
- Customer-specific assistance
- Transaction history awareness
- Multi-language support (PL/EN)

### 3. Transaction Analysis
- Pattern recognition
- Anomaly detection
- Trend analysis
- Summary generation

### 4. Product Recommendations
- Personalized suggestions
- Based on customer segment
- Considers existing products
- Risk-appropriate recommendations

## API Service

The `geminiService` provides the following methods:

- `analyzeCustomer(customer, transactions)` - Analyze customer data
- `recommendProducts(customer, products)` - Get product recommendations
- `chat(messages, context)` - Chat with AI assistant
- `analyzeTransactions(transactions)` - Analyze transaction patterns
- `generateReportSummary(data)` - Generate report summaries
- `isAvailable()` - Check if API is configured

## Fallback Mode

If Gemini API is not configured, the application will:
- Show appropriate messages to users
- Use mock data for demonstrations
- Continue to function normally without AI features

## Security Notes

⚠️ **Important**: 
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- API keys should be kept secure
- In production, use environment variables on your hosting platform

## Cost Considerations

Gemini API has usage limits and costs. Check [Google AI Studio Pricing](https://ai.google.dev/pricing) for current rates.

For development and testing:
- Free tier available
- Rate limits apply
- Monitor usage in Google Cloud Console

## Troubleshooting

### API Not Working

1. Check that `VITE_GEMINI_API_KEY` is set in `.env`
2. Verify the API key is valid
3. Check browser console for errors
4. Ensure you're using the correct model name

### Rate Limiting

If you hit rate limits:
- Implement request throttling
- Cache responses when possible
- Use mock data for development

### Type Errors

If you see TypeScript errors:
- Ensure `@google/generative-ai` is installed
- Check that types are properly imported
- Restart TypeScript server

## Example Usage in Components

### Dashboard Integration

```tsx
import { AIAssistant } from '@/components/gemini';

function Dashboard() {
  return (
    <div>
      {/* Other dashboard content */}
      <AIAssistant />
    </div>
  );
}
```

### Customer Page Integration

```tsx
import { CustomerAnalysis, AIAssistant } from '@/components/gemini';

function CustomerProfile({ customer, transactions }) {
  return (
    <div>
      <CustomerAnalysis customer={customer} transactions={transactions} />
      <AIAssistant customer={customer} transactions={transactions} />
    </div>
  );
}
```

## Future Enhancements

Potential improvements:
- [ ] Conversation history persistence
- [ ] Voice input/output
- [ ] Multi-modal analysis (images, documents)
- [ ] Custom training for bank-specific terminology
- [ ] Integration with bank's knowledge base
- [ ] Automated report generation
- [ ] Real-time transaction monitoring alerts


