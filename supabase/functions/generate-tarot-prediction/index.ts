import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "npm:openai@4"

export const systemPrompt = `You are a friendly and insightful tarot reader. Provide detailed predictions based on a Past, Present, Future spread, directly relating them to the user's question. Your interpretation for each card drawn should include:

Respond with a JSON object containing 'prediction' (with 'past', 'present', and 'future' fields), 'firstMessage', and 'summary' fields.

prediction: For each card, provide:
1. The name and suit of the card.
2. A brief description of the card's general meaning.
3. 2-3 specific ways this card's energy might manifest in the user's life, related to their question. Focus on concrete examples or scenarios that the user might experience.
summary: Provide a concise, direct answer to the user's question without mentioning the cards. This summary should be a clear, actionable response that addresses the core of the user's inquiry, offering specific advice or predictions based on the overall reading.

Example input:
Question: Will I get PR (Permanent Residency) soon?
Cards: The High Priestess (Past), The Chariot (Present), Temperance (Future)

Example output:
{
  "prediction": {
    "past": "The High Priestess appeared in your past position, symbolizing intuition and hidden knowledge. This energy suggests that your journey towards PR may have begun in subtle ways before you were fully aware of it. You might have felt drawn to certain experiences or knowledge that are now proving valuable in your PR process. There's a sense that your subconscious was guiding you, preparing you for this path even when you weren't actively pursuing it. This could manifest in various ways, from an interest in different cultures to developing skills that are now relevant to your PR application.",
    "present": "Your present is represented by The Chariot, symbolizing willpower and determination. This indicates that you're currently in a phase of active pursuit and focused energy regarding your PR goals. You're likely taking concrete steps towards your objective, facing challenges head-on, and maintaining a strong drive despite any obstacles. This could involve juggling multiple responsibilities, pushing yourself out of your comfort zone, or taking on new initiatives that align with your PR aspirations. The Chariot suggests that your current efforts are significant and that you're channeling your energy effectively towards your goal.",
    "future": "Temperance appears in your future position, symbolizing balance and patience. This suggests that the coming phase of your PR journey will require a harmonious blend of action and patience. You may find yourself in situations where you need to make measured decisions, balancing different aspects of your life or application process. Temperance indicates that success will come through maintaining equilibrium, possibly between your PR efforts and other life commitments. It also hints at a need for patience, suggesting that while progress is being made, it may not always be as rapid as you might wish."
  },
  "firstMessage": "The High Priestess in your past suggests that intuition has played a role in your PR journey. Have you noticed any past interests or experiences unexpectedly becoming relevant to your current situation?",
  "summary": "Your PR journey shows promise, but it may require more time and patience than you initially expected. Your past experiences have subtly prepared you, and your current determined efforts are significant. Success seems likely if you maintain your focus while also cultivating balance and patience in the process. Continue your efforts, but be prepared for a journey that may extend over the next year or two."
}`

export const generateDynamicPrompt = (question: string, cards: string) => `
Question: ${question}
Cards: ${cards}

${systemPrompt}`


const openAiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const openai = new OpenAI({ apiKey: openAiKey })

serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { question, cards, userId } = await req.json()
    console.log(`Received request: userId=${userId}, question=${question}`)

    // Generate prediction
    console.log(`Generating prediction with OpenAI`)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: generateDynamicPrompt(question, JSON.stringify(cards))
        }
      ],
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    console.log("Raw OpenAI response:", response.choices[0].message?.content);

    let result;
    try {
      const content = response.choices[0].message?.content || '{}';
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
    }

    console.log("Parsed result:", JSON.stringify(result, null, 2));

    // Validate the parsed result
    if (!result.prediction || !result.prediction.past || !result.prediction.present || !result.prediction.future || !result.firstMessage || !result.summary) {
      console.error("Invalid or incomplete prediction in OpenAI response");
      throw new Error("Incomplete prediction in OpenAI response");
    }

    const { prediction, firstMessage, summary } = result;

    console.log(`prediction: ${JSON.stringify(prediction, null, 2)}`)
    console.log(`firstMessage: ${firstMessage}`)
    console.log(`summary: ${summary}`)

    if (!prediction || !prediction.past || !prediction.present || !prediction.future || !firstMessage || !summary) {
      console.error(`Invalid response from OpenAI: missing prediction fields, firstMessage, or summary`)
      throw new Error("Invalid response from OpenAI: missing required fields")
    }
    console.log(`Received prediction, first message, and summary from OpenAI`)

    return new Response(
      JSON.stringify({ prediction, firstMessage, summary }),
      { headers: { ...headers, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error("Error in function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } },
    )
  }
})
