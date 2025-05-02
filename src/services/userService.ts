import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface DBUser {
  id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}

export function saveUserToLocalStorage(user: DBUser) {
  console.log('Saving user to localStorage:', user);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUserFromLocalStorage(): DBUser | null {
  const str = localStorage.getItem('user');
  return str ? JSON.parse(str) : null;
}

export async function createOrUpdateUser(user: User): Promise<DBUser> {
  if (!user.id) throw new Error('Missing user ID');
  const payload = {
    id: user.id,
    full_name:
      user.user_metadata.full_name || user.email?.split('@')[0] || 'Anonymous',
    avatar_url: user.user_metadata.avatar_url || '',
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  saveUserToLocalStorage(data);
  return data;
}