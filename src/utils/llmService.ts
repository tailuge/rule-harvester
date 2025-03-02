
import { localStorageService } from './localStorageService';

export interface Rule {
  id: string;
  title: string;
  description: string;
}

const AZURE_ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';

const systemPrompt = `
Extract policy rules from the given paragraph of a document. 
Format your response as a JSON object with the following structure:
{
  "title": "Short, clear title of the rule",
  "description": "Detailed description that clearly explains the criteria that must be met to match this rule"
}
Only return the JSON object, nothing else. If there's no clear rule in the paragraph, respond with:
{
  "title": "No rule found",
  "description": "This paragraph does not contain an extractable policy rule."
}
`;

export const llmService = {
  extractRule: async (paragraph: string): Promise<Rule> => {
    const apiKey = localStorageService.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not set. Please configure it in settings.');
    }

    const payload = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: paragraph }
      ],
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1
    };

    console.log('Sending to LLM:', payload);

    try {
      const response = await fetch(AZURE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LLM API error:', errorText);
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('LLM Response:', data);

      // Parse the content from the response
      try {
        const content = data.choices[0].message.content;
        const parsedRule = JSON.parse(content);
        
        return {
          id: Date.now().toString(),
          title: parsedRule.title,
          description: parsedRule.description
        };
      } catch (e) {
        console.error('Error parsing LLM response:', e);
        throw new Error('Failed to parse rule from LLM response');
      }
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  }
};
