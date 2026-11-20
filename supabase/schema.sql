-- Radhe Boutique: database schema for Supabase (Postgres).
-- Run in the Supabase SQL editor, then run seed.sql for the sample catalogue.
-- The website talks to the database only from the server, with the service-role key,
-- so Row Level Security is switched on with no public policies (nobody else can read or write).

create extension if not exists "pgcrypto";

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  category    text not null check (category in ('korean-earrings','anti-tarnish','earrings','necklace-sets','hasli','bracelets','rings','kurtis')),
  price       numeric(10,2) not null check (price >= 0),
  mrp         numeric(10,2),
  description text not null default '',
  tags        text[] not null default '{}',
  images      jsonb not null default '[]',      -- [{url, kind: photo|cutout|lifestyle, alt}]
  try_on      text check (try_on in ('earrings','necklace')),
  try_on_image text,                            -- transparent PNG for live try-on
  active      boolean not null default true,
  featured    boolean not null default false,
  reel_url    text,
  created_at  timestamptz not null default now()
);
create index if not exists products_category_idx on products (category) where active;

-- One row per colour/size. Stock here is ONLINE stock only (shop counter stock lives in the billing software).
create table if not exists variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  name        text not null,
  swatch      text,
  sku         text not null unique,            -- use the same code as the billing software later
  stock       integer not null default 0 check (stock >= 0),
  position    integer not null default 0,
  try_on_image text                             -- per-colour try-on PNG (optional)
);
create index if not exists variants_product_idx on variants (product_id);

create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  number              text not null unique,
  items               jsonb not null,
  subtotal            numeric(10,2) not null,
  discount            numeric(10,2) not null default 0,
  shipping            numeric(10,2) not null default 0,
  cod_fee             numeric(10,2) not null default 0,
  total               numeric(10,2) not null,
  payment_method      text not null check (payment_method in ('razorpay','cod','whatsapp')),
  status              text not null,
  stock_applied       boolean not null default false,
  customer            jsonb not null,
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  note                text,
  created_at          timestamptz not null default now()
);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists restock_requests (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  variant_id  uuid not null references variants(id) on delete cascade,
  phone       text not null,
  created_at  timestamptz not null default now()
);

-- Take stock for every line in one transaction, or none.
-- Returns NULL on success, or the id of the first variant that was short.
create or replace function take_stock(p_lines jsonb) returns uuid
language plpgsql as $$
declare
  line jsonb;
  updated int;
begin
  for line in select * from jsonb_array_elements(p_lines) loop
    update variants
       set stock = stock - (line->>'qty')::int
     where id = (line->>'variant_id')::uuid
       and stock >= (line->>'qty')::int;
    get diagnostics updated = row_count;
    if updated = 0 then
      raise exception 'short:%', line->>'variant_id' using errcode = 'P0001';
    end if;
  end loop;
  return null;
exception when sqlstate 'P0001' then
  return substring(sqlerrm from 7)::uuid;
end;
$$;

create or replace function return_stock(p_lines jsonb) returns void
language plpgsql as $$
declare line jsonb;
begin
  for line in select * from jsonb_array_elements(p_lines) loop
    update variants set stock = stock + (line->>'qty')::int where id = (line->>'variant_id')::uuid;
  end loop;
end;
$$;

alter table products enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;
alter table restock_requests enable row level security;

-- Public bucket for product photos (uploads go through the server).
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

-- Upgrade path for databases created before live try-on existed (safe to re-run).
alter table products add column if not exists try_on_image text;
alter table variants add column if not exists try_on_image text;

-- The website's server key (service_role) needs table access. Newer Supabase projects
-- don't grant it automatically for tables created in the SQL editor.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant execute on functions to service_role;
