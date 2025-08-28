import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// Initialize the OpenAI chat model
export const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

// Example function to generate a response
export async function generateResponse(userInput: string, systemPrompt?: string) {
  try {
    const messages = [
      new SystemMessage(systemPrompt || 'You are a helpful AI assistant.'),
      new HumanMessage(userInput),
    ];

    const response = await chatModel.invoke(messages);
    return response.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}

// Example function for GitHub repository summarization
export async function summarizeGitHubRepo(githubUrl: string) {
  const systemPrompt = `You are an expert at analyzing GitHub repositories. 
  Provide a concise summary and 2-3 interesting facts about the repository. 
  Format your response as JSON with 'summary' and 'cool_facts' fields.`;

  const userPrompt = `Please analyze this GitHub repository: ${githubUrl}`;

  try {
    const response = await generateResponse(userPrompt, systemPrompt);
    return response;
  } catch (error) {
    console.error('Error summarizing GitHub repo:', error);
    throw error;
  }
}
