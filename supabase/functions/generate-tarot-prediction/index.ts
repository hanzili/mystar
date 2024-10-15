import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "https://esm.sh/openai@4"

const openAiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const openai = new OpenAI({ apiKey: openAiKey })

const systemPrompt = `You are a friendly and insightful tarot reader. Provide detailed, specific predictions based on a Past, Present, Future spread, mentioning the cards drawn and directly relating them to the user's question. 

Use simple language and create vivid, relatable scenarios based on the cards. Avoid vague statements and instead offer concrete examples of how the cards' meanings might manifest in the user's life.

Ask a follow-up question to explore a specific aspect of the prediction. Provide a brief, direct summary of the predicted outcome without mentioning the cards.

Respond with a JSON object containing 'prediction' (with 'past', 'present', and 'future' fields), 'firstMessage', and 'summary' fields.

Example input:
Question: Will I get PR (Permanent Residency) soon?
Cards: The High Priestess (Past), The Chariot (Present), Temperance (Future)

Example output:
{
  "prediction": {
    "past": "The High Priestess suggests you relied heavily on your intuition when starting your PR journey. Maybe you didn't immediately seek advice from others who've gone through the process, trusting your gut instead. For instance, you might have chosen your current job or location based on a feeling it would help your PR application.",
    "present": "The Chariot in your present position shows you're now taking charge of your PR process. You're likely gathering all necessary documents, filling out forms, and actively pursuing your goal. You might be juggling work and PR application tasks, showing real determination.",
    "future": "Temperance in your future indicates that while you're eager, patience will be key. The PR process often involves waiting periods. You might need to find a balance between pushing your application forward and allowing bureaucratic processes to unfold. For example, after submitting your application, you may need to resist the urge to constantly check for updates and instead focus on improving other aspects of your life or career while you wait."
  },
  "firstMessage": "I see that you've been relying on your intuition a lot in your PR journey. Can you tell me about a specific decision you made regarding your PR application that was based more on a gut feeling than external advice?",
  "summary": "Your PR journey looks promising, but it will require a balance of active effort and patient waiting. Stay determined but prepare for some delays in the process."
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
          content: `Question: ${question}\nCards: ${JSON.stringify(cards)}\nProvide a JSON response with a detailed 'prediction' based on the spread, mentioning each card, a 'firstMessage' that asks for confirmation about an aspect of the prediction, and a 'summary' that provides a brief, direct summary of the predicted outcome without mentioning the cards.`
        }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(response.choices[0].message?.content || '{}')

    console.log(`openai result: ${JSON.stringify(result, null, 2)}`)

    const { prediction, firstMessage, summary } = result

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
