/* ============================================================
   Supabase connection — publishable key only (safe for the browser,
   real access control happens via Row Level Security in Postgres).
   ============================================================ */
window.SB = window.supabase.createClient(
  'https://sjqboxxgrvwnsmsydulb.supabase.co',
  'sb_publishable_DsWpkfNcvHz-GAI8G-e97g_KKV4Tikc'
);
