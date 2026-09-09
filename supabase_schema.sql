-- ==============================================================================
-- MediT — AI-Based Medicine Delivery Platform Database Schema
-- Run this in Supabase SQL Editor to initialize full production database
-- ==============================================================================

-- 1. Create custom enums
CREATE TYPE user_role AS ENUM ('customer', 'delivery', 'pharmacist');
CREATE TYPE order_status AS ENUM (
  'placed',
  'prescription_verified',
  'assigned_to_pharmacy',
  'picked_up',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'flagged_prescription'
);
CREATE TYPE delivery_type AS ENUM ('normal', 'emergency');
CREATE TYPE prescription_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  age INTEGER NOT NULL DEFAULT 30,
  role user_role NOT NULL DEFAULT 'customer',
  addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_medications TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Pharmacies table
CREATE TABLE IF NOT EXISTS public.pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  license_no TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  contact TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.8,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Medicines catalog table
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  salt_composition TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
  stock_qty INTEGER NOT NULL DEFAULT 50,
  dosage_form TEXT NOT NULL DEFAULT 'Tablet',
  pack_size TEXT NOT NULL DEFAULT '10 Tablets',
  manufacturer TEXT NOT NULL,
  pharmacy_id UUID REFERENCES public.pharmacies(id) ON DELETE SET NULL,
  generic_alternative_name TEXT,
  generic_savings_price NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_age INTEGER NOT NULL,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 30.00,
  status order_status NOT NULL DEFAULT 'placed',
  delivery_type delivery_type NOT NULL DEFAULT 'normal',
  prescription_image_url TEXT,
  ai_extracted_data JSONB,
  assigned_pharmacy_id UUID REFERENCES public.pharmacies(id),
  assigned_delivery_partner_id UUID REFERENCES public.users(id),
  payment_method TEXT NOT NULL DEFAULT 'upi',
  payment_status TEXT NOT NULL DEFAULT 'paid',
  estimated_delivery_minutes INTEGER NOT NULL DEFAULT 20,
  pharmacist_notes TEXT,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  doctor_name TEXT,
  clinic_hospital TEXT,
  prescription_date TEXT,
  extracted_medicines JSONB,
  ocr_result JSONB,
  verified_by UUID REFERENCES public.users(id),
  verification_status prescription_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Chat history table
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Chronic Refill Reminders
CREATE TABLE IF NOT EXISTS public.refill_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  frequency_days INTEGER NOT NULL DEFAULT 30,
  last_ordered_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_reminder_date TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Storage Bucket setup (Run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', false);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refill_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access on medicines & pharmacies for catalogue
CREATE POLICY "Public medicines catalogue" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Public pharmacies directory" ON public.pharmacies FOR SELECT USING (true);
CREATE POLICY "Public orders access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public prescriptions access" ON public.prescriptions FOR ALL USING (true);
