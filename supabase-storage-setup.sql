-- ===================================================
-- FRAMEX SUPABASE STORAGE SETUP
-- Phase 3: Image Upload System
-- UPDATED: Simplified for non-auth setup
-- ===================================================

-- ⚠️ IMPORTANT: Khuyến nghị setup qua UI (xem SUPABASE-SETUP-GUIDE.md)
-- Script này dùng khi UI không hoạt động

-- Step 1: Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  10485760, -- 10MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Public Access for Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- Step 3: Enable PUBLIC access for reading images (no auth required)
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- Step 4: Allow ANON users to upload images (no auth required)
-- This works with Supabase anon key
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'news-images');

-- Step 5: Allow ANON users to update their uploads
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'news-images')
WITH CHECK (bucket_id = 'news-images');

-- Step 6: Allow ANON users to delete their uploads
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'news-images');

-- ===================================================
-- VERIFICATION QUERIES
-- Run these to verify setup:
-- ===================================================

-- Check if bucket exists:
SELECT * FROM storage.buckets WHERE id = 'news-images';

-- Expected result:
-- id: news-images
-- name: news-images
-- public: true
-- file_size_limit: 10485760

-- Check policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND (policyname LIKE '%news-images%' OR policyname LIKE '%Public%');

-- Expected result: 4 policies
-- 1. Public Access for Images (SELECT)
-- 2. Public Upload (INSERT)
-- 3. Public Update (UPDATE)
-- 4. Public Delete (DELETE)

-- ===================================================
-- NOTES FOR ADMIN:
-- ===================================================
-- 1. ✅ Khuyến nghị: Setup qua Supabase UI (xem SUPABASE-SETUP-GUIDE.md)
-- 2. ⚠️ Nếu dùng SQL: Run từng section một, check for errors
-- 3. 📝 Bucket sẽ public (images accessible via URL)
-- 4. 🔓 No authentication required (sử dụng anon key)
-- 5. 📏 File size limit: 10MB per image
-- 6. 🖼️ Allowed formats: JPEG, PNG, WebP, GIF
-- 7. 🔗 Public URL format:
--    https://lyctpwhdskgkqebzreib.supabase.co/storage/v1/object/public/news-images/uploads/filename.jpg
-- ===================================================

-- ===================================================
-- TROUBLESHOOTING
-- ===================================================

-- If policies fail, check RLS is enabled:
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- If still issues, try recreating bucket via UI:
-- 1. Go to Storage section
-- 2. Delete news-images bucket (if exists)
-- 3. Create new bucket with same name
-- 4. Setup policies via UI (easier!)

-- ===================================================
