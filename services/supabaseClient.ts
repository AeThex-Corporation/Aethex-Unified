import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  Constants.expoConfig?.extra?.supabaseUrl || 
  '';

const supabaseAnonKey = 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  '';

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const hasCredentials = Boolean(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));

let supabaseInstance: SupabaseClient | null = null;

const createSupabaseClient = (): SupabaseClient | null => {
  if (!hasCredentials) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
    return null;
  }
};

export const supabase = (() => {
  if (!hasCredentials) {
    console.log('Supabase credentials not found. Using mock data mode.');
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
})();

export const isSupabaseConfigured = (): boolean => {
  return hasCredentials && supabase !== null;
};

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }
  return supabase!;
};
