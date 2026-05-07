-- ============================================================
-- Sparkle — database schema
-- Paste this entire file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ─── Profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text not null default 'new user',
  handle      text unique not null default '@newuser',
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are publicly readable"    on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_handle text;
  final_handle text;
  counter int := 0;
begin
  base_handle := '@' || regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g');
  final_handle := base_handle;
  loop
    exit when not exists (select 1 from public.profiles where handle = final_handle);
    counter := counter + 1;
    final_handle := base_handle || counter::text;
  end loop;
  insert into public.profiles (id, username, handle)
  values (new.id, split_part(new.email, '@', 1), final_handle);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Posts ───────────────────────────────────────────────────
create table if not exists public.posts (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  body        text not null,
  mood        text,
  created_at  timestamptz default now()
);

alter table public.posts enable row level security;
create policy "Posts are publicly readable" on public.posts for select using (true);
create policy "Users can create posts"      on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts"  on public.posts for delete using (auth.uid() = user_id);

-- ─── Post reactions ──────────────────────────────────────────
create table if not exists public.post_reactions (
  id          uuid default gen_random_uuid() primary key,
  post_id     uuid references public.posts(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  label       text not null,
  created_at  timestamptz default now(),
  unique(post_id, user_id, label)
);

alter table public.post_reactions enable row level security;
create policy "Reactions are publicly readable" on public.post_reactions for select using (true);
create policy "Users can add reactions"         on public.post_reactions for insert with check (auth.uid() = user_id);
create policy "Users can remove their reactions" on public.post_reactions for delete using (auth.uid() = user_id);

-- ─── Follows ─────────────────────────────────────────────────
create table if not exists public.follows (
  follower_id  uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at   timestamptz default now(),
  primary key(follower_id, following_id),
  check(follower_id <> following_id)
);

alter table public.follows enable row level security;
create policy "Follows are publicly readable" on public.follows for select using (true);
create policy "Users can follow"   on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

-- ─── Charities ───────────────────────────────────────────────
create table if not exists public.charities (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  category    text not null,
  mission     text,
  accent      text,
  soft_accent text,
  created_at  timestamptz default now()
);

alter table public.charities enable row level security;
create policy "Charities are publicly readable" on public.charities for select using (true);

-- ─── Charity posts ───────────────────────────────────────────
create table if not exists public.charity_posts (
  id               uuid default gen_random_uuid() primary key,
  charity_id       uuid references public.charities(id) on delete cascade not null,
  charity_name     text not null,
  category         text not null,
  accent           text,
  soft_accent      text,
  emoji            text,
  title            text not null,
  body             text not null,
  supporters_count int default 0,
  created_at       timestamptz default now()
);

alter table public.charity_posts enable row level security;
create policy "Charity posts are publicly readable" on public.charity_posts for select using (true);

-- ─── Charity sparks ──────────────────────────────────────────
create table if not exists public.charity_sparks (
  id               uuid default gen_random_uuid() primary key,
  charity_post_id  uuid references public.charity_posts(id) on delete cascade not null,
  user_id          uuid references public.profiles(id) on delete cascade not null,
  created_at       timestamptz default now(),
  unique(charity_post_id, user_id)
);

alter table public.charity_sparks enable row level security;
create policy "Sparks are publicly readable" on public.charity_sparks for select using (true);
create policy "Users can spark"   on public.charity_sparks for insert with check (auth.uid() = user_id);
create policy "Users can unspark" on public.charity_sparks for delete using (auth.uid() = user_id);

-- Increment supporters_count on spark
create or replace function public.increment_supporters()
returns trigger language plpgsql security definer as $$
begin
  update public.charity_posts set supporters_count = supporters_count + 1 where id = new.charity_post_id;
  return new;
end;
$$;

create trigger on_charity_spark
  after insert on public.charity_sparks
  for each row execute procedure public.increment_supporters();

-- ─── Activity ────────────────────────────────────────────────
create table if not exists public.activity (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references public.profiles(id) on delete cascade not null,
  actor_id       uuid references public.profiles(id) on delete set null,
  action_type    text not null, -- 'reaction' | 'follow' | 'reply' | 'charity_milestone'
  reference_id   uuid,
  reference_type text,          -- 'post' | 'charity_post'
  read           boolean default false,
  created_at     timestamptz default now()
);

alter table public.activity enable row level security;
create policy "Users see their own activity" on public.activity for select using (auth.uid() = user_id);
create policy "Activity can be inserted"     on public.activity for insert with check (true);
create policy "Users can mark activity read" on public.activity for update using (auth.uid() = user_id);

-- ─── Re-seed: clear old charity data first, then insert ──────
-- Run this block to replace the old 7 mock charities with 10 real ones.
-- Order matters: sparks → posts → charities (FK chain)
delete from public.charity_sparks;
delete from public.charity_posts;
delete from public.charities;

-- ─── Seed: charities ─────────────────────────────────────────
insert into public.charities (id, name, category, mission, accent, soft_accent) values
  ('aaaaaaaa-0001-0001-0001-000000000001', 'Doctors Without Borders', 'Humanitarian', 'Provides emergency medical care in conflict zones, epidemic hotspots, and natural disaster areas.', '#CC3A3A', '#FAEAEA'),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'WWF',                     'Environment',  'Protects wildlife and natural habitats by working with governments and local communities worldwide.', '#4A7C59', '#E3F0E8'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 'UNICEF',                  'Children',     'Delivers healthcare, education, and clean water to children in the most dangerous places on earth.', '#1A88B4', '#DEF0F8'),
  ('aaaaaaaa-0004-0004-0004-000000000004', 'American Red Cross',      'Humanitarian', 'Responds to disasters and delivers emergency relief, blood supply, and family reconnection services.', '#B34A2E', '#FAECE8'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 'Oxfam',                   'Poverty',      'Fights extreme poverty and inequality by challenging the systems and policies that keep people poor.', '#5E8C3D', '#E8F2E0'),
  ('aaaaaaaa-0006-0006-0006-000000000006', 'Save the Children',       'Children',     'Protects children from violence, disease, and hunger and keeps them learning even in a crisis.', '#D4541A', '#FAEADF'),
  ('aaaaaaaa-0007-0007-0007-000000000007', 'Greenpeace',              'Environment',  'Uses peaceful direct action to expose and challenge environmental destruction around the world.', '#1D8348', '#DAF0E5'),
  ('aaaaaaaa-0008-0008-0008-000000000008', 'Amnesty International',   'Human Rights', 'Investigates and exposes human rights abuses to pressure governments and corporations to change.', '#C8A020', '#FBF3DC'),
  ('aaaaaaaa-0009-0009-0009-000000000009', 'Feeding America',         'Food Access',  'Connects surplus food from farms and retailers to a network of 200+ food banks across the US.', '#E07830', '#FDEEE1'),
  ('aaaaaaaa-0010-0010-0010-000000000010', 'Habitat for Humanity',    'Housing',      'Brings people together to build homes and hope for families living in poverty around the world.', '#2C5F9E', '#DDE8F8')
on conflict (id) do nothing;

-- ─── Seed: charity posts ─────────────────────────────────────
insert into public.charity_posts (charity_id, charity_name, category, accent, soft_accent, emoji, title, body, supporters_count) values
  ('aaaaaaaa-0001-0001-0001-000000000001', 'Doctors Without Borders', 'Humanitarian', '#CC3A3A', '#FAEAEA', '🏥',
   'Emergency surgeries in 6 active conflict zones right now.',
   'MSF teams are operating in Sudan, Gaza, DRC, Myanmar, Haiti, and Ukraine. Each month they perform over 15,000 surgical procedures in places where hospitals have been bombed or abandoned. Attention keeps pressure on governments to allow access.',
   3200000),

  ('aaaaaaaa-0002-0002-0002-000000000002', 'WWF', 'Environment', '#4A7C59', '#E3F0E8', '🐾',
   'Wild tiger populations doubled since 2010 — now we need 5,000.',
   'Sustained conservation efforts brought tigers back from the brink. We''re in the final push to secure protected wildlife corridors in India, Nepal, and Bhutan before key habitats are lost to development.',
   5100000),

  ('aaaaaaaa-0003-0003-0003-000000000003', 'UNICEF', 'Children', '#1A88B4', '#DEF0F8', '🌍',
   '37 million children are out of school because of conflict.',
   'In Yemen, Syria, Mali, and South Sudan, a generation of children has grown up without classrooms. UNICEF runs learning centers in tents, shelters, and community halls so education doesn''t stop when schools do.',
   12500000),

  ('aaaaaaaa-0004-0004-0004-000000000004', 'American Red Cross', 'Humanitarian', '#B34A2E', '#FAECE8', '🩸',
   'Blood supply in 12 states is critically low — donation centers are open.',
   'The Red Cross is facing one of the most severe blood shortages in recent years. A single donation can save up to 3 lives. Walk-in donation centers operate daily with no appointment needed.',
   8700000),

  ('aaaaaaaa-0005-0005-0005-000000000005', 'Oxfam', 'Poverty', '#5E8C3D', '#E8F2E0', '✊',
   '1 in 5 people live on less than $2.15 a day.',
   'Oxfam works with farmers, women-led cooperatives, and local governments to build fair food systems, clean water access, and resilient livelihoods in over 60 countries. Systemic change starts with public awareness.',
   4300000),

  ('aaaaaaaa-0006-0006-0006-000000000006', 'Save the Children', 'Children', '#D4541A', '#FAEADF', '🤝',
   'Acute malnutrition is rising — 6 million children at risk.',
   'Malnutrition can cause permanent brain damage in children under 5. Save the Children is distributing therapeutic food, vitamins, and health screenings in Ethiopia, Niger, and South Sudan right now.',
   6800000),

  ('aaaaaaaa-0007-0007-0007-000000000007', 'Greenpeace', 'Environment', '#1D8348', '#DAF0E5', '🌊',
   'The Arctic is melting 4x faster than the global average.',
   'Greenpeace ships are documenting ice loss in real time and bringing the data directly to climate summits. Politicians move when the public is watching — your attention is part of the pressure.',
   3900000),

  ('aaaaaaaa-0008-0008-0008-000000000008', 'Amnesty International', 'Human Rights', '#C8A020', '#FBF3DC', '🕯️',
   '2,000 political prisoners need international attention this month.',
   'From Iran to Russia to Bangladesh, Amnesty''s Urgent Action network has helped free 68,000 prisoners of conscience since 1961. Writing letters still works — governments respond to international scrutiny.',
   10200000),

  ('aaaaaaaa-0009-0009-0009-000000000009', 'Feeding America', 'Food Access', '#E07830', '#FDEEE1', '🥘',
   '44 million Americans face hunger and food banks are running low.',
   'Summer is the hardest season: school lunch programs end, grocery prices stay high, and donations drop. Feeding America''s network of 200+ food banks serves meals daily. Every dollar donated buys 10 meals.',
   2100000),

  ('aaaaaaaa-0010-0010-0010-000000000010', 'Habitat for Humanity', 'Housing', '#2C5F9E', '#DDE8F8', '🏠',
   'A safe home changes everything — 10 families wait in your city.',
   'Families who move into Habitat homes see their children''s school attendance improve by 20% and healthcare costs drop by 30%. We''re 60% funded on our current build and need skilled volunteers and donations to finish.',
   1400000)
on conflict do nothing;
