
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Inicializa o cliente apenas se as chaves existirem para evitar erro fatal "Uncaught Error"
// Se as chaves não existirem, o App usará o fallback de localStorage automaticamente
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("Supabase: Chaves de API não encontradas. O sistema está operando em modo Local Storage (Offline/Single Device).");
}
