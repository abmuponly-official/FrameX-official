# 🔧 SUPABASE STORAGE SETUP GUIDE

## ⚠️ QUAN TRỌNG: Setup MANUAL qua Supabase UI

**Lý do:** Website dùng simple admin auth (không phải Supabase Auth), nên cần setup qua UI thay vì SQL.

---

## 📋 BƯỚC 1: TẠO STORAGE BUCKET

### 1.1 Vào Supabase Dashboard:
```
URL: https://supabase.com/dashboard
Project: https://supabase.com/dashboard/project/lyctpwhdskgkqebzreib
```

### 1.2 Mở Storage Section:
- Click **Storage** trong left sidebar
- Click **Create a new bucket**

### 1.3 Điền thông tin bucket:

| Field | Value |
|-------|-------|
| **Name** | `news-images` |
| **Public bucket** | ✅ **YES** (checked) |
| **File size limit** | `10` MB |
| **Allowed MIME types** | Leave empty (accept all images) |

### 1.4 Click **Create bucket**

✅ **Kết quả:** Bucket `news-images` đã được tạo!

---

## 📋 BƯỚC 2: SETUP STORAGE POLICIES

### 2.1 Vào Policies:
- Trong Storage section
- Click vào bucket `news-images`
- Click tab **Policies**

### 2.2 Tạo Policy #1: Public Read

Click **New Policy** → **For full customization**

**Policy Name:** `Public Read Access`

**Allowed operation:** `SELECT`

**Policy definition:**
```sql
true
```

**Target roles:** `public`

Click **Review** → **Save policy**

---

### 2.3 Tạo Policy #2: Public Insert (Upload)

Click **New Policy** → **For full customization**

**Policy Name:** `Public Upload Access`

**Allowed operation:** `INSERT`

**Policy definition:**
```sql
true
```

**Target roles:** `anon`

Click **Review** → **Save policy**

---

### 2.4 Tạo Policy #3: Public Update

Click **New Policy** → **For full customization**

**Policy Name:** `Public Update Access`

**Allowed operation:** `UPDATE`

**Policy definition:**
```sql
true
```

**Target roles:** `anon`

Click **Review** → **Save policy**

---

### 2.5 Tạo Policy #4: Public Delete

Click **New Policy** → **For full customization**

**Policy Name:** `Public Delete Access`

**Allowed operation:** `DELETE`

**Policy definition:**
```sql
true
```

**Target roles:** `anon`

Click **Review** → **Save policy**

---

## 📋 BƯỚC 3: VERIFY SETUP

### 3.1 Check Bucket Configuration:

Trong Storage section, verify:
- ✅ Bucket name: `news-images`
- ✅ Public: **Yes**
- ✅ File size limit: **10 MB**
- ✅ Policies: **4 policies** (SELECT, INSERT, UPDATE, DELETE)

### 3.2 Test Upload:

1. Vào Admin Panel: `/admin-news.html`
2. Login với credentials
3. Click **Thư Viện Media**
4. Try upload một ảnh test
5. Check nếu upload thành công!

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "Failed to upload"

**Nguyên nhân:** Policies chưa được setup đúng

**Giải pháp:**
1. Check lại 4 policies trong bucket
2. Ensure all policies have `true` as definition
3. Ensure target roles = `anon` hoặc `public`

---

### ❌ Error: "Bucket not found"

**Nguyên nhân:** Bucket name sai

**Giải pháp:**
1. Check bucket name = `news-images` (chính xác)
2. Không có space, không có typo

---

### ❌ Error: "File too large"

**Nguyên nhân:** File > 10MB

**Giải pháp:**
1. Resize image trước khi upload
2. Hoặc tăng file size limit trong bucket settings

---

## 📊 ALTERNATIVE: SQL SCRIPT (Nếu UI không work)

Nếu UI không hoạt động, có thể dùng SQL:

### Vào SQL Editor:

```sql
-- Step 1: Create bucket (if not exists via UI)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Public Access for Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Step 3: Create PUBLIC policies (no auth required)
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'news-images');

CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'news-images');
```

Run từng command một, check for errors.

---

## ✅ VERIFICATION COMMANDS

Run these in SQL Editor để verify:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'news-images';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%news-images%'
OR policyname LIKE '%Public%';
```

Bạn should see:
- 1 bucket với name = `news-images`
- 4 policies cho SELECT, INSERT, UPDATE, DELETE

---

## 🎯 EXPECTED RESULTS

### Bucket Configuration:
```
✅ Name: news-images
✅ Public: true
✅ File size limit: 10485760 bytes (10MB)
✅ Status: Active
```

### Policies:
```
✅ Public Access for Images (SELECT)
✅ Public Upload (INSERT)
✅ Public Update (UPDATE)
✅ Public Delete (DELETE)
```

---

## 📞 NEED HELP?

Nếu vẫn gặp vấn đề:

1. **Check Supabase Dashboard:**
   - Storage → news-images → Policies
   - Ensure 4 policies exist

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for error messages khi upload

3. **Check Network Tab:**
   - F12 → Network tab
   - Filter: Fetch/XHR
   - Look for failed requests to `/storage/v1/`

---

## 🎉 SUCCESS!

Khi setup xong, bạn sẽ thấy:
- ✅ Bucket hiển thị trong Storage section
- ✅ 4 policies active
- ✅ Upload working trong admin panel
- ✅ Images accessible via public URL

**Test URL format:**
```
https://lyctpwhdskgkqebzreib.supabase.co/storage/v1/object/public/news-images/uploads/filename.jpg
```

Good luck! 🚀
