import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4";

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
    const { message, userId, predictionId, chatHistory, tarotPrediction } = await req.json();
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
      content: `You are Celeste, a friendly AI Tarot reader. Your role is to provide a customized tarot interpretation through interactive conversation. 

User's Question: "${tarotPrediction.question}"

Tarot Cards Drawn:
1. ${tarotPrediction.cards[0]}
2. ${tarotPrediction.cards[1]}
3. ${tarotPrediction.cards[2]}

Guidelines:
1. Base all your responses on the user's specific question and the three cards drawn.
2. Interpret the cards in relation to the user's question, explaining their significance clearly.
3. Use a warm, conversational tone to engage the user.
4. Keep initial responses concise (2-3 sentences) but be ready to elaborate if the user asks.
5. Ask clarifying questions if needed to better understand the user's situation or their interpretation of the cards.

Begin each reply by addressing the user's latest input, then offer insights based on their question and cards. Encourage the user to share their thoughts or ask for clarification on specific cards or aspects of the reading.`,
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
