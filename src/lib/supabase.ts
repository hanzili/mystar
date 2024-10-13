import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
}

export interface TarotReading {
  id?: number;
  user_id: string;
  question: string;
  cards: string;
  prediction: string;
  created_at?: string;
}

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