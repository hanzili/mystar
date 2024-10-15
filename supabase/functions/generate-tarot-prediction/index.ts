import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "https://esm.sh/openai@4"

const openAiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const openai = new OpenAI({ apiKey: openAiKey })

const systemPrompt = `You are a friendly tarot reader. Give detailed predictions based on a Past, Present, Future spread, mentioning the specific cards drawn. Also ask a follow-up question to confirm an aspect of the prediction. Respond with a JSON object containing 'prediction' and 'firstMessage' fields.

Example input:
Question: Will I get a new job soon?
Cards: The Tower (Past), The Fool (Present), Ten of Cups (Future)

Example output:
{
  "prediction": "Your past is represented by The Tower, suggesting a period of sudden change or upheaval in your career. This might have been a job loss or a realization that your previous path wasn't right for you. The Fool in your present position indicates you're at the beginning of a new journey, ready to take risks and explore new opportunities. You're open to new experiences and have a fresh perspective on your career. The Ten of Cups in your future is a very positive sign, representing fulfillment and happiness. This suggests that not only will you likely find a new job, but it could bring you significant satisfaction and a sense of achievement. The combination of these cards indicates that while you may have faced challenges in the past, you're now on a path that could lead to a much more fulfilling career.",
  "firstMessage": "The Tower card in your past position suggests you've experienced some significant changes or challenges in your career recently. Can you tell me more about these experiences and how they've influenced your current job search?"
}`


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
          content: `Question: ${question}\nCards: ${JSON.stringify(cards)}\nProvide a JSON response with a detailed 'prediction' based on the spread, mentioning each card, and a 'firstMessage' that asks for confirmation about an aspect of the prediction.`
        }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(response.choices[0].message?.content || '{}')

    console.log(`openai result: ${JSON.stringify(result, null, 2)}`)

    const { prediction, firstMessage } = result

    console.log(`prediction: ${prediction}`)
    console.log(`firstMessage: ${firstMessage}`)

    if (!prediction || !firstMessage) {
      console.error(`Invalid response from OpenAI: missing prediction or firstMessage`)
      throw new Error("Invalid response from OpenAI: missing required fields")
    }
    console.log(`Received prediction and first message from OpenAI`)

    return new Response(
      JSON.stringify({ prediction, firstMessage }),
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
