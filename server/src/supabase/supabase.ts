import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { STORAGE_BUCKET_NAME } from '../constants';

let supabase: SupabaseClient;

export const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase env vars: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }

  return supabase;
};

export const buildStorageFileUrl = (bucketName: STORAGE_BUCKET_NAME, filePath: string, filename: string) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Missing Supabase env var: SUPABASE_URL. Cannot build file storage url');
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`;
};
