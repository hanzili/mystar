import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1"

const openAiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const openAiConfig = new Configuration({ apiKey: openAiKey })
const openai = new OpenAIApi(openAiConfig)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { question, cards, userId } = await req.json()

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    const { data, error } = await supabase.from('tarot_readings').insert({
      user_id: userId,
      question: question,
      cards: cards,
    }).select()

    if (error) throw error

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a mystical tarot reader, providing insightful and thoughtful predictions based on the cards drawn and the question asked."
        },
        {
          role: "user",
          content: `Question: ${question}\nCards drawn: ${cards}\nPlease provide a tarot reading based on these cards and the question.`
        }
      ],
      max_tokens: 300
    })

    const prediction = response.data.choices[0].message?.content

    await supabase.from('tarot_readings').update({ prediction: prediction }).eq('id', data[0].id)

    return new Response(
      JSON.stringify({ prediction }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }
})