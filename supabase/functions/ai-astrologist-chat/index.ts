import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.20.1";

const openAiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const openAiConfig = new Configuration({ apiKey: openAiKey });
const openai = new OpenAIApi(openAiConfig);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const { message, userId, predictionId } = await req.json();

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get tarot prediction
    const { data: tarotPrediction, error: fetchPredictionError } =
      await supabase
        .from("tarot_readings")
        .select("question, cards, prediction")
        .eq("id", predictionId)
        .eq("user_id", userId)
        .single();

    if (fetchPredictionError) throw fetchPredictionError;

    // Save user message
    const { error: saveMessageError } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        message: message,
        is_ai_response: false,
        prediction_id: predictionId,
      });

    if (saveMessageError) throw saveMessageError;

    // Get chat history
    const { data: chatHistory, error: chatError } = await supabase
      .from("chat_messages")
      .select("message, is_ai_response")
      .eq("user_id", userId)
      .eq("prediction_id", predictionId)
      .order("created_at", { ascending: true })
      .limit(10);

    if (chatError) throw chatError;

    // Prepare messages for OpenAI
    const messages = chatHistory.map((msg) => ({
      role: msg.is_ai_response ? "assistant" : "user",
      content: msg.message,
    }));

    messages.unshift({
      role: "system",
      content: `You are an AI Astrologist named Celeste, known for your mystical insights and compassionate advice. Your role is to:

1. Provide personalized astrological insights based on the user's questions and concerns.
2. Interpret the user's recent tarot reading in the context of their current situation.
3. Use a warm, supportive tone with a touch of mysticism in your language.
4. Avoid technical astrological terms; instead, use simple, relatable metaphors.
5. Ask 3-4 clarifying questions to better understand the user's situation before offering your main insight or advice.
6. Limit your responses to 3-4 sentences for clarity and impact.

Remember to reference this tarot reading in your responses: ${JSON.stringify(
        tarotPrediction
      )}

Begin each interaction by briefly acknowledging the user's question or concern.`,
    });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
    });

    const aiResponse = response.data.choices[0].message?.content;

    if (!aiResponse) {
      throw new Error("No response from OpenAI");
    }

    // Save AI response
    await supabase.from("chat_messages").insert({
      user_id: userId,
      prediction_id: predictionId,
      message: aiResponse,
      is_ai_response: true,
    });

    return new Response(JSON.stringify({ message: aiResponse }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
