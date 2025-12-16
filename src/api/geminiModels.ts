import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * List available Gemini models for the API key
 * This is a utility function to help debug which models are available
 */
export async function listAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to get model info - this might not work directly, but we can try
    const models = [
      'gemini-1.5-pro',
      'gemini-1.5-flash', 
      'gemini-pro',
      'gemini-1.0-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'models/gemini-pro',
    ];

    const available: string[] = [];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Try a simple test call
        await model.generateContent('test');
        available.push(modelName);
      } catch (error: any) {
        // Model not available, skip
        if (error?.message && !error.message.includes('404')) {
          // Other error, might be available
          available.push(modelName);
        }
      }
    }

    return available;
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}


