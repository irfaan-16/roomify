// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ehxogawzuzfdttyvxsrs.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeG9nYXd6dXpmZHR0eXZ4c3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODc2NzIsImV4cCI6MjA1MzM2MzY3Mn0.BY3vYuW-K6Y_ckK9Kn472_ZC-evQpRoh1BJtdP1uRrY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
