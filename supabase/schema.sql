-- ============================================================
-- Gamified Classroom OS — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run (uses IF NOT EXISTS / idempotent policy + publication setup).
-- ============================================================

create table if not exists classes (
  id text primary key default 'default',
  name text, room text, teacher text, year text
);

create table if not exists students (
  id text primary key,
  no int,
  code text,
  name text not null,
  nick text,
  gender text,
  status text default 'present',
  live text default 'present',
  welfare jsonb default '{}',
  health jsonb default '{}',
  game jsonb default '{}',
  badges int default 0,
  guild text,
  custom boolean default false,
  deleted boolean default false,
  created_at timestamptz default now()
);

create table if not exists attendance (
  date text not null,
  student_id text not null references students(id) on delete cascade,
  status text,
  milk boolean,
  brush boolean,
  lunch boolean,
  primary key (date, student_id)
);

create table if not exists homework (
  id text primary key,
  subject text, title text, due text
);

create table if not exists homework_assignments (
  id text primary key,
  title text, subject text, score numeric, date text
);

create table if not exists homework_submissions (
  assignment_id text references homework_assignments(id) on delete cascade,
  student_id text references students(id) on delete cascade,
  submitted boolean default false,
  primary key (assignment_id, student_id)
);

create table if not exists announcements (
  id text primary key,
  title text, body text, date text, audience text
);

create table if not exists documents (
  id text primary key,
  name text, cat text, date text, size text, icon text
);

create table if not exists home_visits (
  id text primary key,
  student_id text references students(id) on delete set null,
  date text, purpose text, notes text, status text
);

create table if not exists finance_ledger (
  id text primary key,
  type text, category text, amount numeric, note text, date text
);

create table if not exists finance_savings_txns (
  id text primary key,
  student_id text references students(id) on delete cascade,
  kind text, amount numeric, at bigint
);

create table if not exists score_log (
  id text primary key,
  student_id text references students(id) on delete cascade,
  type text, amount numeric, reason text, at bigint
);

create table if not exists custom_rewards (
  id text primary key,
  th text, cat text, cost numeric, cur text, icon text, stock int
);

create table if not exists class_achievements_claimed (
  key text primary key
);

-- ============================================================
-- Row Level Security — only a signed-in (authenticated) user may
-- read or write. Anonymous visitors get nothing.
-- ============================================================
do $$
declare t text;
begin
  for t in select unnest(array[
    'classes','students','attendance','homework','homework_assignments',
    'homework_submissions','announcements','documents','home_visits',
    'finance_ledger','finance_savings_txns','score_log','custom_rewards',
    'class_achievements_claimed'
  ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "authenticated_full_access" on %I;', t);
    execute format(
      'create policy "authenticated_full_access" on %I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'');',
      t
    );
  end loop;
end $$;

-- ============================================================
-- Realtime — broadcast row changes so every open device/tab stays in sync.
-- ============================================================
do $$
declare t text;
begin
  for t in select unnest(array[
    'classes','students','attendance','homework','homework_assignments',
    'homework_submissions','announcements','documents','home_visits',
    'finance_ledger','finance_savings_txns','score_log','custom_rewards',
    'class_achievements_claimed'
  ])
  loop
    begin
      execute format('alter publication supabase_realtime add table %I;', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
