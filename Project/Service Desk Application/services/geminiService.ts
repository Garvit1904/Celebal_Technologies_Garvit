import { GoogleGenerativeAI } from "@google/generative-ai";
import { TicketCategory, TicketPriority, TICKET_CATEGORIES, TICKET_PRIORITIES } from '../constants';
import type { Ticket } from '../types';

const API_KEY = process.env.API_KEY || "";

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // or "gemini-1.5-flash"

export const suggestCategoryAndPriority = async (
  title: string,
  description: string
): Promise<{ category: TicketCategory; priority: TicketPriority } | null> => {
  if (!API_KEY) return null;
  try {
    const prompt = `Analyze the following support ticket and determine the best category and priority.

Title: "${title}"
Description: "${description}"

Respond in strict JSON format like:
{
  "category": "CATEGORY_HERE",
  "priority": "PRIORITY_HERE"
}

Categories: ${TICKET_CATEGORIES.join(', ')}
Priorities: ${TICKET_PRIORITIES.join(', ')}
`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text().trim();

    const parsed = JSON.parse(text);

    return {
      category: parsed.category as TicketCategory,
      priority: parsed.priority as TicketPriority,
    };
  } catch (error) {
    console.error("Error suggesting category/priority with Gemini:", error);
    return null;
  }
};

export const suggestSolution = async (ticket: Ticket): Promise<string | null> => {
  if (!API_KEY) return null;
  try {
    const prompt = `
You are an expert IT support technician. A user has submitted the following ticket.
Please provide a concise, step-by-step solution or a set of diagnostic questions to help resolve the issue.
Format your response using markdown.

Ticket Details:
- Title: ${ticket.title}
- Description: ${ticket.description}
- Category: ${ticket.category}
- Priority: ${ticket.priority}
- Created By: ${ticket.creatorName}
- Status: ${ticket.status}

History & Comments:
${ticket.comments.map(c => `- ${c.authorName} at ${new Date(c.createdAt).toLocaleString()}: "${c.content}"`).join('\n') || 'No comments yet.'}

Provide your suggested solution below.
`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const solution = response.text().trim();

    return solution;
  } catch (error) {
    console.error("Error suggesting solution with Gemini:", error);
    return null;
  }
};
