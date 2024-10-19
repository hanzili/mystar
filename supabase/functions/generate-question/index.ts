import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import OpenAI from "npm:openai@4"

export const staticPrompt = `You are a tarot reader's assistant. Your task is to generate a thought-provoking question based on a tarot card prediction and previous conversation. The question should aim to clarify vague aspects of the prediction for the {timeFrame}, encouraging the user to reflect on deeply personal and private experiences from their past.

Guidelines:
1. Identify a vague or symbolic element from the tarot card's interpretation that hasn't been addressed in the chat history.
2. Formulate a question that prompts the user to reveal a specific, private event or experience from their past that relates to the tarot card's symbolism.
3. Provide 2 to 4 distinct and specific answer options that represent very different personal experiences. These options MUST be completely mutually exclusive with absolutely NO overlap between them. Ensure users can only select one that truly applies to them.
4. Each option should touch on sensitive or private information that a person might be hesitant to share publicly.
5. Include emojis in both the question and options for visual engagement.
6. Avoid repeating questions or topics that have already been discussed in the chat history.

Here's an example:
expected input:
{
  "prediction": {
    "past": "The High Priestess appeared in your past position, symbolizing intuition and hidden knowledge. This energy suggests that your journey towards PR may have begun in subtle ways before you were fully aware of it. You might have felt drawn to certain experiences or knowledge that are now proving valuable in your PR process. There's a sense that your subconscious was guiding you, preparing you for this path even when you weren't actively pursuing it.",
    "present": "Your present is represented by The Chariot, symbolizing willpower and determination. This indicates that you're currently in a phase of active pursuit and focused energy regarding your PR goals. You're likely taking concrete steps towards your objective, facing challenges head-on, and maintaining a strong drive despite any obstacles.",
    "future": "Temperance appears in your future position, symbolizing balance and patience. This suggests that the coming phase of your PR journey will require a harmonious blend of action and patience. You may find yourself in situations where you need to make measured decisions, balancing different aspects of your life or application process."
  },
  "chatHistory": [
    {"role": "user", "content": "I'm curious about the intuition mentioned in my past. Can you elaborate?"},
    {"role": "assistant", "content": "The High Priestess in your past suggests that intuition and hidden knowledge played a role in your journey towards PR. It implies that you may have unconsciously prepared for this path."},
    {"role": "user", "content": "That's interesting. What about my present situation?"},
    {"role": "assistant", "content": "The Chariot in your present position indicates strong willpower and determination in pursuing your PR goals. You're likely taking active steps towards your objective."}
  ],
  "timeFrame": "PAST"
}

expected output:
{
  "question": "The High Priestess symbolizes hidden knowledge. What private experience in your past unexpectedly prepared you for your current PR journey? 🔮🗝️",
  "options": [
    "A confidential work project that gave you unique insights into the country's culture 🏢🌏",
    "A personal relationship that ended but taught you valuable lessons about adaptability 💔🌱",
    "A family secret that motivated you to seek opportunities abroad 🤫✈️",
    "An undisclosed health challenge that made you reassess your life priorities 🏥🔄"
  ]
}

Now, based on the provided prediction and conversation, generate a question about the {timeFrame} with 3 to 5 options for answers. The question should help clarify a vague aspect of the prediction that hasn't been addressed in the chat history, focusing on deeply personal and private past experiences. Respond only with the JSON object, ensuring it's valid JSON format.`

export const generateDynamicPrompt = (prediction: string, chatHistory: string, timeFrame: string) => `
Tarot Prediction: ${prediction}

Chat History: ${chatHistory}

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
    const { tarotPrediction, chatHistory, timeFrame } = await req.json();
    console.log(`Received request: timeFrame=${timeFrame}`);

    const dynamicPrompt = generateDynamicPrompt(
      JSON.stringify(tarotPrediction.prediction),
      JSON.stringify(chatHistory),
      timeFrame.toLowerCase()
    );

    console.log(`Sending request to OpenAI with prompt: ${dynamicPrompt}`);
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
