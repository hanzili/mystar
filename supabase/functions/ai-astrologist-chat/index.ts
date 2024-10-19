import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "npm:openai@4"

export const systemPrompt = `You are Celeste, a friendly AI Tarot reader and fortune teller. Provide insightful feedback and further predictions based on the existing conversation and tarot reading:

Question: "{question}"
Cards: {cards}
Prediction: {prediction}

Guidelines:
1. Use a warm, conversational tone.
2. Keep responses concise (2-3 sentences).
3. Acknowledge the user's input before continuing.
4. Provide new insights or details that expand on the original prediction.
5. Relate your feedback to specific cards or aspects of the user's question.
6. Make your predictions sound accurate and relevant to the user's situation.
7. Do not repeat information already discussed in the conversation.
8. Focus on giving the user a deeper understanding of their reading.

Aim for a personal and insightful dialogue that builds upon the existing prediction.`;

export const generateDynamicPrompt = (question: string, cards: string, prediction: string) => `
Question: ${question}
Cards: ${cards}
Prediction: ${prediction}

${systemPrompt}`
    

const openAiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const openai = new OpenAI({ apiKey: openAiKey });

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
    const { message, userId, predictionId, chatHistory, tarotPrediction } =
      await req.json();
    console.log(
      `Received request: userId=${userId}, predictionId=${predictionId}`
    );

    // Prepare messages for OpenAI
    const messages = chatHistory.map((msg) => ({
      role: msg.is_ai_response ? "assistant" : "user",
      content: msg.message,
    }));

    messages.unshift({
      role: "system",
      content: `You are Celeste, a friendly AI Tarot reader and fortune teller. Provide insightful feedback and further predictions based on the existing conversation and tarot reading:

      Question: "${tarotPrediction.question}"
      Cards: ${tarotPrediction.cards}
      Prediction: ${tarotPrediction.prediction}

      Guidelines:
      1. Use a warm, conversational tone.
      2. Keep responses concise (2-3 sentences).
      3. Acknowledge the user's input before continuing.
      4. Provide new insights or details that expand on the original prediction.
      5. Relate your feedback to specific cards or aspects of the user's question.
      6. Make your predictions sound accurate and relevant to the user's situation.
      7. Do not repeat information already discussed in the conversation.
      8. Focus on giving the user a deeper understanding of their reading.

      Aim for a personal and insightful dialogue that builds upon the existing prediction.`,
    });

    console.log(`Sending request to OpenAI`);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
    });

    const aiResponse = response.choices[0].message?.content;

    if (!aiResponse) {
      console.error(`No response received from OpenAI`);
      throw new Error("No response from OpenAI");
    }
    console.log(`Received response from OpenAI, ${aiResponse}`);

    return new Response(JSON.stringify({ message: aiResponse, predictionId }), {
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
