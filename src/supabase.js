import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tturruxdxpphgpgczzsg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXJydXhkeHBwaGdwZ2N6enNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY0NDM4ODUsImV4cCI6MTk4MjAxOTg4NX0.mh5FdpvsZQolc1GlfVHwfgAGO8h-nFF0bnM0Stf7ePQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

