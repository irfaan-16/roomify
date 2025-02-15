interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URl: string; // Example variable
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_GEMINI_KEY: string;
  // Add other environment variables here...
}
