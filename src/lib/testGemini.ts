import { getGeminiResponses } from './geminiService';

// Test function to verify Gemini API integration
export async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API integration...');
    
    const testQuery = "I have been experiencing headaches and dizziness for the past week. What could this indicate?";
    const results = await getGeminiResponses(testQuery);
    
    console.log('API Test Results:');
    results.forEach((result, index) => {
      console.log(`Model ${index + 1}: ${result.model}`);
      console.log(`Confidence: ${result.confidence}`);
      console.log(`Accuracy: ${result.accuracy}`);
      console.log(`F1 Score: ${result.f1Score}`);
      console.log(`Response Length: ${result.response.length} characters`);
      console.log('---');
    });
    
    return results;
  } catch (error) {
    console.error('API Test Failed:', error);
    throw error;
  }
}
