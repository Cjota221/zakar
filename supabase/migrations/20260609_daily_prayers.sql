create table if not exists public.daily_prayers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  verse_reference text,
  verse_text  text,
  prayer      text not null,
  created_at  timestamptz default now(),
  unique(user_id, date)
);

alter table public.daily_prayers enable row level security;

create policy "Users manage own prayers"
  on public.daily_prayers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
