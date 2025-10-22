-- ===================================================
-- FRAMEX MEDIA LIBRARY TABLE SETUP
-- Create table to store uploaded media metadata
-- ===================================================

-- Create media_library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  size BIGINT NOT NULL,
  storage_path TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_at ON public.media_library(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_type ON public.media_library(type);

-- Enable Row Level Security
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access" ON public.media_library;
DROP POLICY IF EXISTS "Public insert access" ON public.media_library;
DROP POLICY IF EXISTS "Public update access" ON public.media_library;
DROP POLICY IF EXISTS "Public delete access" ON public.media_library;

-- Allow public READ access (anon users can view)
CREATE POLICY "Public read access"
ON public.media_library FOR SELECT
TO public
USING (true);

-- Allow anon users to INSERT (upload metadata)
CREATE POLICY "Public insert access"
ON public.media_library FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon users to UPDATE
CREATE POLICY "Public update access"
ON public.media_library FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow anon users to DELETE
CREATE POLICY "Public delete access"
ON public.media_library FOR DELETE
TO anon
USING (true);

-- ===================================================
-- VERIFICATION QUERIES
-- ===================================================

-- Check if table exists and structure is correct:
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'media_library'
ORDER BY ordinal_position;

-- Expected columns:
-- id (uuid, NOT NULL, default: gen_random_uuid())
-- filename (text, NOT NULL)
-- url (text, NOT NULL)
-- type (text, NOT NULL, default: 'image')
-- size (bigint, NOT NULL)
-- storage_path (text, NULL)
-- uploaded_at (timestamptz, NULL, default: NOW())
-- updated_at (timestamptz, NULL, default: NOW())

-- Check policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'media_library';

-- Expected result: 4 policies
-- 1. Public read access (SELECT)
-- 2. Public insert access (INSERT)
-- 3. Public update access (UPDATE)
-- 4. Public delete access (DELETE)

-- Test query - should return empty list initially:
SELECT * FROM public.media_library ORDER BY uploaded_at DESC LIMIT 10;

-- ===================================================
-- NOTES:
-- ===================================================
-- 1. ✅ Table tạo với RLS enabled
-- 2. ✅ Public access cho tất cả operations (no auth required)
-- 3. ✅ Indexes tối ưu cho queries
-- 4. 📝 Metadata fields:
--    - filename: Original or sanitized filename
--    - url: Full public URL to access image
--    - type: Media type (image/video)
--    - size: File size in bytes
--    - storage_path: Path in Supabase storage (for deletion)
--    - uploaded_at: Auto timestamp
--    - updated_at: Auto timestamp
-- ===================================================
