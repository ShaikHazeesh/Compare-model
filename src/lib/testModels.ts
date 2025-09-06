import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Test function to check which models are actually available
export async function testAvailableModels() {
  const modelsToTest = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-pro-vision'
  ];

  const availableModels = [];
  const unavailableModels = [];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Test");
      await result.response.text();
      availableModels.push(modelName);
      console.log(`✅ ${modelName} - Available`);
    } catch (error) {
      unavailableModels.push(modelName);
      console.log(`❌ ${modelName} - Not available: ${error.message}`);
    }
  }

  console.log('\n=== AVAILABLE MODELS ===');
  availableModels.forEach(model => console.log(`✅ ${model}`));
  
  console.log('\n=== UNAVAILABLE MODELS ===');
  unavailableModels.forEach(model => console.log(`❌ ${model}`));

  return { availableModels, unavailableModels };
}
