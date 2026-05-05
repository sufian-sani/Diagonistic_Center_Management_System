import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

/**
 * Singleton Pattern Implementation for AI Service
 * Ensures only one instance of GoogleGenerativeAI exists across the application.
 */
class AIManager {
    constructor() {
        if (AIManager.instance) {
            return AIManager.instance;
        }

        const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyA-mock-key-for-development';
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using the exact identifiers found in the API's model list
        this.defaultModel = "gemini-flash-latest"; 
        this.fallbackModel = "gemini-pro-latest";
        
        AIManager.instance = this;
    }

    /**
     * Get the generative model instance
     * @param {Object} config - Optional model configuration (e.g., systemInstruction)
     * @param {string} modelName - Override model name
     * @returns {Object}
     */
    getModel(config = {}, modelName = null) {
        return this.genAI.getGenerativeModel({ 
            model: modelName || this.defaultModel,
            ...config 
        });
    }

    /**
     * Generate content with built-in retry and model fallback logic
     * @param {string} prompt 
     * @param {Object} config 
     * @returns {Promise<Object>}
     */
    async generateContentWithRetry(prompt, config = {}, maxAttempts = 3) {
        let lastError;

        // Try primary model first, then fallback if it's a 404/compatibility issue
        const modelsToTry = [this.defaultModel, this.fallbackModel];

        for (const modelName of modelsToTry) {
            const model = this.getModel(config, modelName);
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await model.generateContent(prompt);
                } catch (error) {
                    lastError = error;
                    const is404 = error.message.includes('404') || error.message.includes('not found');
                    const isRetryable = error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable');
                    
                    if (is404 && modelName === this.defaultModel) {
                        console.warn(`AI Model ${modelName} not found. Switching to fallback ${this.fallbackModel}...`);
                        break; // Exit inner loop to try next model
                    }

                    if (isRetryable && attempt < maxAttempts) {
                        const delay = Math.pow(2, attempt) * 1000;
                        console.warn(`AI Service Busy (${modelName}). Retrying in ${delay}ms... (Attempt ${attempt}/${maxAttempts})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    
                    if (modelName === this.fallbackModel || !is404) {
                        // If it's not a 404 or we are already on fallback, don't try other models for this attempt
                        break; 
                    }
                }
            }
        }
        throw lastError;
    }

    /**
     * Helper to start a chat session
     * @param {Array} history - Chat history
     * @param {Object} config - Model config
     * @returns {Object}
     */
    startChatSession(history = [], config = {}) {
        const model = this.getModel(config);
        return model.startChat({ history });
    }

    /**
     * Send a message in a chat session with retry logic
     * @param {Object} chatSession 
     * @param {string} message 
     * @returns {Promise<Object>}
     */
    async sendMessageWithRetry(chatSession, message, maxAttempts = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await chatSession.sendMessage(message);
            } catch (error) {
                lastError = error;
                const isRetryable = error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable');

                if (isRetryable && attempt < maxAttempts) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.warn(`AI Chat Service Busy (503). Retrying in ${delay}ms... (Attempt ${attempt}/${maxAttempts})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                break;
            }
        }
        throw lastError;
    }

    /**
     * Static method to get the singleton instance
     */
    static getInstance() {
        if (!AIManager.instance) {
            AIManager.instance = new AIManager();
        }
        return AIManager.instance;
    }
}

const aiManager = AIManager.getInstance();
export default aiManager;
