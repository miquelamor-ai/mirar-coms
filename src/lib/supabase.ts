import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SessionState = {
    current_slide_id: string;
    is_voting_open: boolean;
};

export type ProposalStatus = 'activar' | 'pilotar' | 'preparar' | 'reflexionar' | 'desestimar';
export type PollChoice = 'confirmar' | 'dubtar' | 'denegar';
