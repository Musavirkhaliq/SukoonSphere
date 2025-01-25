// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ybqucvdpavncsisbjsoo.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXVjdmRwYXZuY3Npc2Jqc29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODQ1OTksImV4cCI6MjA0NzA2MDU5OX0.eKTXrV3ZHm0JZkB4Ay3dEUfEOdxqbbFrl4fCFz-7SxY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
