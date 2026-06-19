/* ============================================================
   Supabase connection — publishable key only (safe for the browser,
   real access control happens via Row Level Security in Postgres).
   ============================================================ */
window.SB = window.supabase.createClient(
  'https://jjwwdtsyifdnrtfvoowo.supabase.co',
  'sb_publishable_Ei___VVavI6nQmgJgIbm6A_Qgkuph88'
);
