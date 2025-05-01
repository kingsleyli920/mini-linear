import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface DBUser {
  id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}

export async function createOrUpdateUser(user: User) {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        full_name: user.user_metadata.full_name || user.email?.split('@')[0],
        avatar_url: user.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving user:', error);
    throw error;
  }

  return data;
}

export async function getUser(userId: string): Promise<DBUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}
