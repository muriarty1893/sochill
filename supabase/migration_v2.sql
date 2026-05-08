-- ============================================================
-- Migration v2 — Add missing tables for social features
-- Run in: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run: IF NOT EXISTS + DROP POLICY IF EXISTS + ADD COLUMN IF NOT EXISTS
-- ============================================================

-- ─── Update profiles: add new fields ─────────────────────────
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists bio          text,
  add column if not exists website      text,
  add column if not exists verified     boolean default false;

-- ─── Update posts: add image fields ──────────────────────────
alter table public.posts
  add column if not exists image_url    text,
  add column if not exists image_width  int,
  add column if not exists image_height int;

-- ─── Post likes ──────────────────────────────────────────────
create table if not exists public.post_likes (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references public.posts(id) on delete cascade not null,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table public.post_likes enable row level security;
drop policy if exists "Likes are publicly readable" on public.post_likes;
drop policy if exists "Users can like"              on public.post_likes;
drop policy if exists "Users can unlike"            on public.post_likes;
create policy "Likes are publicly readable" on public.post_likes for select using (true);
create policy "Users can like"   on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.post_likes for delete using (auth.uid() = user_id);

-- ─── Reposts ─────────────────────────────────────────────────
create table if not exists public.reposts (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references public.posts(id) on delete cascade not null,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table public.reposts enable row level security;
drop policy if exists "Reposts are publicly readable" on public.reposts;
drop policy if exists "Users can repost"              on public.reposts;
drop policy if exists "Users can un-repost"           on public.reposts;
create policy "Reposts are publicly readable" on public.reposts for select using (true);
create policy "Users can repost"    on public.reposts for insert with check (auth.uid() = user_id);
create policy "Users can un-repost" on public.reposts for delete using (auth.uid() = user_id);

-- ─── Comments ────────────────────────────────────────────────
create table if not exists public.comments (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references public.posts(id) on delete cascade not null,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  body       text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;
drop policy if exists "Comments are publicly readable"  on public.comments;
drop policy if exists "Users can comment"               on public.comments;
drop policy if exists "Users can delete own comments"   on public.comments;
create policy "Comments are publicly readable"  on public.comments for select using (true);
create policy "Users can comment"               on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments"   on public.comments for delete using (auth.uid() = user_id);

-- ─── Conversations ───────────────────────────────────────────
create table if not exists public.conversations (
  id               uuid default gen_random_uuid() primary key,
  participant1_id  uuid references public.profiles(id) on delete cascade not null,
  participant2_id  uuid references public.profiles(id) on delete cascade not null,
  last_message_at  timestamptz default now(),
  created_at       timestamptz default now(),
  unique(participant1_id, participant2_id)
);

-- Add any columns that may be missing if table already existed
alter table public.conversations
  add column if not exists participant1_id uuid references public.profiles(id) on delete cascade,
  add column if not exists participant2_id uuid references public.profiles(id) on delete cascade,
  add column if not exists last_message_at timestamptz default now(),
  add column if not exists created_at      timestamptz default now();

alter table public.conversations enable row level security;
drop policy if exists "Participants can read conversation" on public.conversations;
drop policy if exists "Users can create conversations"     on public.conversations;
create policy "Participants can read conversation"
  on public.conversations for select
  using (auth.uid() = participant1_id or auth.uid() = participant2_id);
create policy "Users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = participant1_id or auth.uid() = participant2_id);

-- ─── Messages ────────────────────────────────────────────────
create table if not exists public.messages (
  id               uuid default gen_random_uuid() primary key,
  conversation_id  uuid references public.conversations(id) on delete cascade not null,
  sender_id        uuid references public.profiles(id) on delete cascade not null,
  body             text not null,
  image_url        text,
  read             boolean default false,
  created_at       timestamptz default now()
);

-- Add any columns that may be missing if table already existed
alter table public.messages
  add column if not exists conversation_id uuid references public.conversations(id) on delete cascade,
  add column if not exists sender_id       uuid references public.profiles(id) on delete cascade,
  add column if not exists body            text,
  add column if not exists image_url       text,
  add column if not exists read            boolean default false,
  add column if not exists created_at      timestamptz default now();

alter table public.messages enable row level security;
drop policy if exists "Conversation participants can read messages" on public.messages;
drop policy if exists "Users can send messages"                     on public.messages;
drop policy if exists "Users can mark messages read"                on public.messages;
create policy "Conversation participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = public.messages.conversation_id
        and (c.participant1_id = auth.uid() or c.participant2_id = auth.uid())
    )
  );
create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);
create policy "Users can mark messages read"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = public.messages.conversation_id
        and (c.participant1_id = auth.uid() or c.participant2_id = auth.uid())
    )
  );

-- ─── Enable realtime on messages ─────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- ─── Charity spark decrement trigger ────────────────────────
create or replace function public.decrement_supporters()
returns trigger language plpgsql security definer as $$
begin
  update public.charity_posts
    set supporters_count = greatest(0, supporters_count - 1)
  where id = old.charity_post_id;
  return old;
end;
$$;

drop trigger if exists on_charity_unspark on public.charity_sparks;
create trigger on_charity_unspark
  after delete on public.charity_sparks
  for each row execute procedure public.decrement_supporters();

-- ─── Storage: media bucket ───────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view media"                  on storage.objects;
drop policy if exists "Authenticated users can upload media"   on storage.objects;
drop policy if exists "Owners can delete media"                on storage.objects;

create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated users can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "Owners can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "Owners can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

-- ─── Update handle_new_user to use metadata ──────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_handle text;
  final_handle text;
  counter int := 0;
  username_val text;
  display_name_val text;
begin
  username_val := coalesce(
    new.raw_user_meta_data->>'username',
    regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
  );
  display_name_val := coalesce(new.raw_user_meta_data->>'display_name', username_val);
  base_handle := '@' || username_val;
  final_handle := base_handle;
  loop
    exit when not exists (select 1 from public.profiles where handle = final_handle);
    counter := counter + 1;
    final_handle := base_handle || counter::text;
  end loop;
  insert into public.profiles (id, username, handle, display_name)
  values (new.id, username_val, final_handle, display_name_val)
  on conflict (id) do update
    set username = excluded.username,
        handle = excluded.handle,
        display_name = excluded.display_name;
  return new;
end;
$$;

-- ─── View counts ──────────────────────────────────────────────────────────
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count bigint NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.posts SET views_count = views_count + 1 WHERE id = post_id;
$$;

-- ─── Nested replies ───────────────────────────────────────────────────────
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- ─── Image replies & likeable comments ───────────────────────────────────
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS image_url text;

CREATE TABLE IF NOT EXISTS public.comment_likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comment likes readable"   ON public.comment_likes;
DROP POLICY IF EXISTS "Users can like comments"  ON public.comment_likes;
DROP POLICY IF EXISTS "Users can unlike comments" ON public.comment_likes;
CREATE POLICY "Comment likes readable"    ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments"   ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);
