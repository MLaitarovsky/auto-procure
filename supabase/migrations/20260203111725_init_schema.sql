-- Enable UUID extension for robust primary keys
create extension if not exists "uuid-ossp";
-- 1. ENUMS: Defining our State Machine
create type order_status as enum (
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'fulfilled'
);
create type priority_level as enum ('low', 'medium', 'critical');
-- 2. VENDORS: Who we buy from
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_email text not null,
  api_endpoint text,
  lead_time_days int default 7,
  created_at timestamp with time zone default now()
);
-- 3. PRODUCTS: The Inventory
create table products (
  id uuid primary key default uuid_generate_v4(),
  sku text unique not null,
  name text not null,
  vendor_id uuid references vendors(id),
  current_stock int default 0,
  min_stock_threshold int default 10,
  max_stock_capacity int default 100,
  unit_price decimal(10, 2),
  last_checked_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
-- 4. PURCHASE ORDERS (The HITL Queue)
create table purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references vendors(id) not null,
  status order_status default 'draft',
  ai_confidence_score float,
  ai_reasoning text,
  total_amount decimal(10, 2),
  priority priority_level default 'medium',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
-- 5. PO ITEMS (Line items for the orders)
create table po_items (
  id uuid primary key default uuid_generate_v4(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity_suggested int not null,
  quantity_approved int,
  unit_price_at_time decimal(10, 2)
);
-- 6. STOCK MOVEMENTS (The AI's Brain Food)
create table stock_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id),
  change_amount int not null,
  reason text,
  recorded_at timestamp with time zone default now()
);