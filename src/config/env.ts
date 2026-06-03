type ClientEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  usersTable: string;
  itemsTable: string;
  itemPhotosTable: string;
  itemBrandProofsTable: string;
  uploadErrorLogsTable: string;
  swapRequestsTable: string;
  awsUploadFunction: string;
  awsUploadFolderPrefix: string;
};

const getEnvValue = (key: string) => {
  const value = import.meta.env[key] as string | undefined;
  return value?.trim() || '';
};

export const clientEnv: ClientEnv = {
  supabaseUrl: getEnvValue('VITE_SUPABASE_URL').replace(/\/$/, ''),
  supabaseAnonKey: getEnvValue('VITE_SUPABASE_ANON_KEY'),
  usersTable: getEnvValue('VITE_SUPABASE_USERS_TABLE') || 'users',
  itemsTable: getEnvValue('VITE_SUPABASE_ITEMS_TABLE') || 'items',
  itemPhotosTable: getEnvValue('VITE_SUPABASE_ITEM_PHOTOS_TABLE') || 'item_photos',
  itemBrandProofsTable: getEnvValue('VITE_SUPABASE_ITEM_BRAND_PROOFS_TABLE') || 'item_brand_proofs',
  uploadErrorLogsTable: getEnvValue('VITE_SUPABASE_UPLOAD_ERROR_LOGS_TABLE') || 'upload_error_logs',
  swapRequestsTable: getEnvValue('VITE_SUPABASE_SWAP_REQUESTS_TABLE') || 'swap_requests',
  awsUploadFunction: getEnvValue('VITE_SUPABASE_AWS_UPLOAD_FUNCTION') || 'create-s3-upload-url',
  awsUploadFolderPrefix:
    getEnvValue('VITE_AWS_UPLOAD_FOLDER_PREFIX') || (import.meta.env.PROD ? 'ijol-prod' : 'ijol-dev'),
};

export const assertSupabaseEnv = () => {
  if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
    throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
  }
};
