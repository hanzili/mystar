import { createClient } from '@supabase/supabase-js';
import { User, TarotReading, ChatMessage } from './types';

// Constants
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase client initialization
export const supabase = createClient(supabaseUrl, supabaseKey);

// User-related functions
export async function getOrCreateUser(clerkUserId: string, email: string): Promise<User> {
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError);
    throw fetchError;
  }

  if (existingUser) {
    return existingUser as User;
  }

  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ clerk_user_id: clerkUserId, email })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating user:', insertError);
    throw insertError;
  }

  return newUser as User;
}

export async function getSupabaseUserId(clerkUserId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error) {
    console.error('Error fetching Supabase user ID:', error);
    return null;
  }

  return data?.id || null;
}

// Tarot reading-related functions
export async function saveTarotReading(reading: Omit<TarotReading, 'id' | 'created_at'>): Promise<TarotReading> {
  const { data, error } = await supabase
    .from('tarot_readings')
    .insert(reading)
    .select();

  if (error) {
    console.error('Error saving tarot reading:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No data returned after saving reading');
  }

  return data[0] as TarotReading;
}

export async function getTarotReading(userId: string, predictionId: string): Promise<TarotReading | null> {
  const { data, error } = await supabase
    .from('tarot_readings')
    .select('*')
    .eq('user_id', userId)
    .eq('id', predictionId)
    .single();

  if (error) {
    console.error('Error fetching tarot reading:', error);
    throw error;
  }

  return data as TarotReading | null;
}


export async function getTarotReadings(userId: string): Promise<TarotReading[]> {
  const { data, error } = await supabase
    .from('tarot_readings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tarot readings:', error);
    throw error;
  }

  return data as TarotReading[];
}

// Chat message-related functions
export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select();

  if (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No data returned after saving chat message');
  }

  return data[0] as ChatMessage;
}

export async function getChatMessages(userId: string, predictionId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('prediction_id', predictionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }

  return data as ChatMessage[];
}
