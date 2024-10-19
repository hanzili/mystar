import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import OpenAI from "npm:openai@4"

export const staticPrompt = `You are a tarot reader's assistant. Your task is to generate a thought-provoking question based on a tarot card prediction and previous conversation. The question should be about the {timeFrame} and include three distinct answer options.

Guidelines:
1. The question must directly relate to the tarot card's interpretation.
2. Reflect realistic scenarios or decisions relevant to the user's situation.
3. Provide three distinct and meaningful answer options.
4. Include emojis in both the question and options for visual engagement.

Here's an example:
expected input:
{
  "prediction": {
    "past": "The High Priestess appeared in your past position, symbolizing intuition and hidden knowledge. This energy suggests that your journey towards PR may have begun in subtle ways before you were fully aware of it.",
    "present": "Your present is represented by The Chariot, symbolizing willpower and determination. This indicates that you're currently in a phase of active pursuit and focused energy regarding your PR goals.",
    "future": "Temperance appears in your future position, symbolizing balance and patience. This suggests that the coming phase of your PR journey will require a harmonious blend of action and patience."
  },
  "previousConversation": [
    {"role": "user", "content": "I'm worried about my PR application. Can you give me more details about the future card?"},
    {"role": "assistant", "content": "The Temperance card in your future position suggests a need for balance and patience in your PR journey. It indicates that while progress is being made, it may not always be as rapid as you might wish. This card encourages you to find harmony between different aspects of your life and the application process."}
  ],
  "timeFrame": "FUTURE"
}

expected output:
{
  "question": "As Temperance guides your future PR journey, how will you maintain balance while pursuing your goals? ⚖️🏃‍♂️",
  "options": [
    "Set strict boundaries between work and personal life 🧘‍♀️",
    "Prioritize tasks flexibly, adjusting as needed 🔄",
    "Seek mentorship to navigate challenges efficiently 🧭"
  ]
}

Now, based on the provided prediction and conversation, generate a question about the {timeFrame} with three options for answers. Respond only with the JSON object, ensuring it's valid JSON format.`

export const generateDynamicPrompt = (prediction: string, previousConversation: string, timeFrame: string) => `
Tarot Prediction: ${prediction}

Previous Conversation: ${previousConversation}

${staticPrompt.replace(/{timeFrame}/g, timeFrame.toLowerCase())}`



const openAiKey = Deno.env.get('OPENAI_API_KEY')

const openai = new OpenAI({ apiKey: openAiKey })

// Enum for time frames
enum TimeFrame {
  PAST = 'PAST',
  PRESENT = 'PRESENT',
  FUTURE = 'FUTURE'
}

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { prediction, previousConversation, timeFrame } = await req.json();
    console.log(`Received request: timeFrame=${timeFrame}`);

    const dynamicPrompt = generateDynamicPrompt(
      JSON.stringify(prediction),
      JSON.stringify(previousConversation),
      timeFrame.toLowerCase()
    );

    console.log(`Sending request to OpenAI`);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: staticPrompt },
        { role: "user", content: dynamicPrompt }
      ],
      max_tokens: 200,
    });

    const aiResponse = response.choices[0].message?.content;

    if (!aiResponse) {
      console.error(`No response received from OpenAI`);
      throw new Error("No response from OpenAI");
    }
    console.log(`Received response from OpenAI: ${aiResponse}`);

    // Parse the JSON response
    const parsedResponse = JSON.parse(aiResponse);

    console.log("Parsed response:", JSON.stringify(parsedResponse));

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
