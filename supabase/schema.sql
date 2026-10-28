-- DJ RYM — Supabase schema
-- Phase 1: booking_requests (live), events + releases (optional CMS for the agenda/discography)
-- Phase 2: products, product_variants, orders (webshop)

create extension if not exists "pgcrypto";

-- ───────────────────────────── Phase 1 ─────────────────────────────

create table if not exists booking_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  status       text not null default 'new' check (status in ('new','in_talks','confirmed','declined')),
  event_type   text not null,
  event_date   date not null,
  start_time   time,
  set_length   text not null,
  venue        text,
  city         text not null,
  crowd_size   text,
  extra        text,
  genres       text[] not null default '{}',
  budget       text,
  name         text not null,
  email        text not null,
  phone        text,
  organisation text,
  message      text
);
-- Inserts happen server-side with the service role; no public access.
alter table booking_requests enable row level security;

create table if not exists events (
  id         uuid primary key default gen_random_uuid(),
  date       date not null,
  name       text not null,
  venue      text not null,
  city       text not null,
  kind       text not null check (kind in ('Club','Festival','Student','Bar')),
  ticket_url text,
  sold_out   boolean not null default false
);
alter table events enable row level security;
create policy "events are public" on events for select using (true);

create table if not exists releases (
  slug       text primary key,
  title      text not null,
  type       text not null check (type in ('Single','EP','Mix')),
  year       int  not null,
  bpm        int  not null,
  genre      text not null,
  cover      text,
  accent     text not null default '#00f0ff',
  spotify    text,
  soundcloud text
);
alter table releases enable row level security;
create policy "releases are public" on releases for select using (true);

-- ───────────────────────────── Phase 2 ─────────────────────────────

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text not null default '',
  category    text not null check (category in ('apparel','accessories','music')),
  accent      text not null default '#00f0ff',
  status      text not null default 'draft' check (status in ('draft','coming_soon','active')),
  images      jsonb not null default '[]',  -- [{src, alt, width, height}]
  created_at  timestamptz not null default now()
);

create table if not exists product_variants (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references products(id) on delete cascade,
  title           text not null,
  sku             text unique not null,
  price_cents     int  not null check (price_cents >= 0),
  currency        text not null default 'EUR',
  in_stock        boolean not null default true,
  stripe_price_id text
);

create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  stripe_session_id  text unique not null,
  email              text not null,
  status             text not null default 'paid' check (status in ('paid','fulfilled','refunded')),
  total_cents        int not null,
  currency           text not null default 'EUR',
  shipping           jsonb,
  line_items         jsonb not null  -- snapshot of [{variant_id, title, quantity, price_cents}]
);

alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
create policy "visible products are public" on products for select using (status <> 'draft');
create policy "variants of visible products are public" on product_variants for select
  using (exists (select 1 from products p where p.id = product_id and p.status <> 'draft'));
-- orders: service role only (written by the Stripe webhook).
