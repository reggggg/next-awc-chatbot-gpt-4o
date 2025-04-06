import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { knowledgeBase } from '@/app/data/knowledge-base';

export const runtime = 'edge';

const openai = createOpenAI({
  apiKey: process.env.AWC_CHATBOT_TOKEN!,
  baseURL: 'https://models.inference.ai.azure.com',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const formattedBoothList = knowledgeBase.booths.map((booth) => {
  return `- ${booth.name} (${booth.size}) – $${booth.price.toLocaleString()}  
  - Features: ${booth.features}  
  - Remaining: ${booth.remaining}`;
}).join('\n\n');

const formattedSponsorshipList = knowledgeBase.sponsorships.map((sponsorship) => {
  return `- ${sponsorship.name} – $${sponsorship.price.toLocaleString()}  
  - Benefits: ${sponsorship.benefits}  
  - Remaining: ${sponsorship.remaining}`;
}).join('\n\n');

const systemPrompt = `You are a helpful sales assistant for the Affiliate World event. 
  Use this knowledge base for accurate information:

  Upcoming events:
  - Affiliate World Europe 2025 (September 4-5, 2025)
  - Affiliate World Asia 2025 (December 3-4, 2025)
  - Affiliate World Dubai 2026 (February 10-11, 2026)
  
  Booth options:
  ${formattedBoothList}

  Sponsorship options:
  ${formattedSponsorshipList}
  
  - Take note that there are many sponsorships. If the user asks for the list, only a max of 6 items then add a "Type 'show more' to see more" text below it. Do not show the 'show more' text if all the sponsorships are already shown 
  
  Make these part of the conversation when it is related to what the user asks:
  - Discount for multiple booths
  - Explain the visibility and ROI benefits

  Only provide booth or sponsorship information if the user explicitly asks for it.
  For all other queries, provide a helpful response without automatically mentioning booths or sponsorships.
  If unsure about what the user is asking, ask for clarification.

  If there is a potential lead, try to implement this rules:
  - If the potential lead is trying to get a discount, a maximum automatic discount threshold is 10%.
  - Incentives (e.g., early bird pricing, bundle offers).
  - Scarcity messaging (e.g., "Only 3 booths left!").

  If the user is nearly closing the deal, try to implement this rules:
  - Finalize preliminary agreements and flag for human follow-up.
  - Collect and record lead details (name, company, email, phone).
  - Provide calendar links for meetings or follow-up calls.

  Keep responses concise and focused on the user's query.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: errorHandler,
  });
}

function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}
