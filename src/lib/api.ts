export async function generateTarotPrediction(question: string, cards: string, userId: string) {
  try {
    const response = await fetch(
      'https://didojidulfoxymrtnesc.supabase.co/functions/v1/generate-tarot-prediction',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ question, cards, userId }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate prediction');
    }

    const data = await response.json();
    return data.prediction;
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
}

export async function chatWithAIAstrologist(message: string, userId: string, predictionId: string) {
  try {
    const response = await fetch(
      'https://didojidulfoxymrtnesc.supabase.co/functions/v1/ai-astrologist-chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          message, 
          userId,
          predictionId
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error chatting with AI Astrologist:', error);
    throw error;
  }
}

