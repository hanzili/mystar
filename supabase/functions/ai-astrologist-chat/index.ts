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
      content: `You are Celeste, a friendly AI Tarot reader and fortune teller. Provide a customized tarot interpretation for:

      Question: "${tarotPrediction.question}"
      Cards: ${tarotPrediction.cards}
      Prediction: ${tarotPrediction.prediction}

      Guidelines:
      1. Use a warm, conversational tone.
      2. Keep responses concise (1-2 sentences) unless asked to elaborate.
      3. Ask simple questions to gather more information when needed.
      4. Acknowledge user's input before continuing.
      5. Relate responses to specific cards or aspects of the user's question.
      6. If the user's question is vague, offer a reasonable guess about their situation and ask for confirmation or clarification.
      7. When the user provides more details, acknowledge their input before continuing
      8. Then, relate their input back to the tarot reading or ask a follow-up question
      9. Do not let the conversation die. Try to keep the conversation going and ask follow up questions.


      Aim for a personal and insightful dialogue.`,
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
