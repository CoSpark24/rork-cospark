import { Alert } from 'react-native';

interface AIServiceOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIServiceResponse {
  completion: string;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<ContentPart>;
}

interface ContentPart {
  type: 'text' | 'image';
  text?: string;
  image?: string;
}

export async function generateText(
  messages: Message[],
  options: AIServiceOptions = {}
): Promise<string> {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: AIServiceResponse = await response.json();
    return data.completion;
  } catch (error) {
    console.error('Error generating text:', error);
    Alert.alert(
      'AI Service Error',
      'Failed to generate text. Please try again later.'
    );
    return '';
  }
}

export async function generatePitchDeck(
  idea: string,
  industry: string,
  targetAudience: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert pitch deck creator with experience in venture capital and startup fundraising.',
    },
    {
      role: 'user',
      content: `Create a pitch deck outline for the following startup idea:
      
      Idea: ${idea}
      Industry: ${industry}
      Target Audience: ${targetAudience}
      
      Please provide a structured outline with key points for each slide.`,
    },
  ];

  return generateText(messages, { temperature: 0.7 });
}

export async function generateBusinessPlan(
  idea: string,
  industry: string,
  targetAudience: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert business plan creator with experience in business strategy and market analysis.',
    },
    {
      role: 'user',
      content: `Create a business plan outline for the following startup idea:
      
      Idea: ${idea}
      Industry: ${industry}
      Target Audience: ${targetAudience}
      
      Please provide a structured outline with key sections and points to include.`,
    },
  ];

  return generateText(messages, { temperature: 0.7 });
}

export async function getAIMentorAdvice(
  question: string,
  startupStage: string,
  industry: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an experienced startup mentor with expertise across various industries. Provide concise, actionable advice to founders.',
    },
    {
      role: 'user',
      content: `I need advice on the following:
      
      Question: ${question}
      Startup Stage: ${startupStage}
      Industry: ${industry}
      
      Please provide practical, actionable advice based on your experience.`,
    },
  ];

  return generateText(messages, { temperature: 0.7 });
}

export async function validateStartupIdea(
  idea: string,
  targetMarket: string,
  competitors: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a startup idea validator with expertise in market analysis and business viability assessment.',
    },
    {
      role: 'user',
      content: `Validate the following startup idea:
      
      Idea: ${idea}
      Target Market: ${targetMarket}
      Known Competitors: ${competitors}
      
      Please provide an honest assessment of the idea's viability, potential challenges, and suggestions for improvement.`,
    },
  ];

  return generateText(messages, { temperature: 0.7 });
}