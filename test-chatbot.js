import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Test the Gemini API connection
async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API connection...");
    
    // Initialize the Google Generative AI with API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Test prompt
    const prompt = "What are 3 simple tips for managing stress?";
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("API connection successful!");
    console.log("Response:", text);
    
    return true;
  } catch (error) {
    console.error("Error testing Gemini API:", error.message);
    return false;
  }
}

// Run the test
testGeminiAPI().then(success => {
  if (success) {
    console.log("Test completed successfully.");
  } else {
    console.log("Test failed. Please check your API key and configuration.");
  }
});
