-- ===================================================
-- FRAMEX SUPABASE STORAGE SETUP
-- Phase 3: Image Upload System
-- ===================================================

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

-- Step 2: Enable public access for reading images
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- Step 3: Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'news-images' AND
  auth.role() = 'authenticated'
);

-- Step 4: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'news-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- Step 5: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

-- ===================================================
-- VERIFICATION QUERIES
-- Run these to verify setup:
-- ===================================================

-- Check if bucket exists:
-- SELECT * FROM storage.buckets WHERE id = 'news-images';

-- Check policies:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%news-images%';

-- ===================================================
-- NOTES FOR ADMIN:
-- ===================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Bucket will be public (images accessible via URL)
-- 3. Only authenticated users can upload/modify
-- 4. File size limit: 10MB per image
-- 5. Allowed formats: JPEG, PNG, WebP, GIF
-- ===================================================
