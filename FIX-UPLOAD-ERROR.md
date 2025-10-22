# 🔧 HƯỚNG DẪN SỬA LỖI UPLOAD ẢNH

## ⚠️ VẤN ĐỀ

Khi upload ảnh lên admin-news.html, ảnh đã upload thành công lên Supabase Storage, nhưng trang báo lỗi:

```
⚠️ Ảnh đã upload nhưng lỗi lưu database
```

## 🔍 NGUYÊN NHÂN

Table `media_library` chưa được tạo trong Supabase database. Hiện tại chỉ có storage bucket nhưng thiếu table để lưu metadata của ảnh.

## ✅ GIẢI PHÁP

### Bước 1: Truy cập Supabase Dashboard

1. Mở trình duyệt và đăng nhập: https://supabase.com/dashboard
2. Chọn project: `lyctpwhdskgkqebzreib.supabase.co`

### Bước 2: Tạo Table `media_library`

#### Cách 1: Dùng SQL Editor (Khuyến nghị - Nhanh nhất)

1. **Vào SQL Editor:**
   - Click menu bên trái: `SQL Editor`
   - Click `New Query`

2. **Copy và paste toàn bộ code SQL sau:**

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_at ON public.media_library(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_type ON public.media_library(type);

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access"
ON public.media_library FOR SELECT
TO public
USING (true);

CREATE POLICY "Public insert access"
ON public.media_library FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Public update access"
ON public.media_library FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete access"
ON public.media_library FOR DELETE
TO anon
USING (true);
```

3. **Chạy SQL:**
   - Click nút `Run` (hoặc nhấn Ctrl+Enter)
   - Đợi 2-3 giây
   - Kiểm tra kết quả hiện `Success`

4. **Verify:**
```sql
-- Chạy query này để kiểm tra table đã tạo thành công:
SELECT * FROM public.media_library LIMIT 10;
```

#### Cách 2: Dùng Table Editor (Dễ dàng hơn cho người mới)

1. **Vào Table Editor:**
   - Click menu bên trái: `Table Editor`
   - Click `New table`

2. **Cấu hình table:**
   - **Name:** `media_library`
   - **Enable Row Level Security (RLS):** ✅ CHECK
   - Click `Save`

3. **Thêm các columns:**

| Column Name | Type | Default Value | Nullable | Primary |
|------------|------|---------------|----------|---------|
| `id` | `uuid` | `gen_random_uuid()` | ❌ | ✅ |
| `filename` | `text` | - | ❌ | ❌ |
| `url` | `text` | - | ❌ | ❌ |
| `type` | `text` | `'image'` | ❌ | ❌ |
| `size` | `int8` (bigint) | - | ❌ | ❌ |
| `storage_path` | `text` | - | ✅ | ❌ |
| `uploaded_at` | `timestamptz` | `now()` | ✅ | ❌ |
| `updated_at` | `timestamptz` | `now()` | ✅ | ❌ |

4. **Tạo Policies (RLS):**
   - Click tab `Policies`
   - Click `New Policy`
   - **Tạo 4 policies sau:**

**Policy 1: Public read access**
```
Name: Public read access
Policy command: SELECT
Target roles: public
USING expression: true
```

**Policy 2: Public insert access**
```
Name: Public insert access
Policy command: INSERT
Target roles: anon
WITH CHECK expression: true
```

**Policy 3: Public update access**
```
Name: Public update access
Policy command: UPDATE
Target roles: anon
USING expression: true
WITH CHECK expression: true
```

**Policy 4: Public delete access**
```
Name: Public delete access
Policy command: DELETE
Target roles: anon
USING expression: true
```

### Bước 3: Kiểm tra Upload

1. **Quay lại trang admin:** https://framex.vn/admin-news.html
2. **Đăng nhập** (nếu chưa đăng nhập)
3. **Click tab "Thư Viện Media"**
4. **Drag & drop hoặc click để upload ảnh test**
5. **Kết quả mong đợi:**
   ```
   ✅ Upload thành công: test-image.jpg (245KB)
   ```

### Bước 4: Verify Database

Chạy query này trong SQL Editor để xem ảnh đã lưu thành công:

```sql
SELECT 
  id,
  filename,
  url,
  type,
  size,
  storage_path,
  uploaded_at
FROM public.media_library
ORDER BY uploaded_at DESC
LIMIT 10;
```

Kết quả sẽ hiển thị list các ảnh đã upload.

---

## 📊 CẤU TRÚC TABLE `media_library`

### Schema:

```
media_library
├── id (uuid, primary key) - Auto generated
├── filename (text, required) - Tên file đã sanitized
├── url (text, required) - Public URL để truy cập ảnh
├── type (text, required) - Loại media: 'image' hoặc 'video'
├── size (bigint, required) - Kích thước file (bytes)
├── storage_path (text, optional) - Path trong Supabase storage
├── uploaded_at (timestamptz, auto) - Thời gian upload
└── updated_at (timestamptz, auto) - Thời gian cập nhật
```

### Indexes:
- `idx_media_library_uploaded_at` - Tối ưu sort by date
- `idx_media_library_type` - Tối ưu filter by type

### Row Level Security (RLS):
- ✅ Enabled
- ✅ Public read (SELECT)
- ✅ Anon insert (INSERT)
- ✅ Anon update (UPDATE)
- ✅ Anon delete (DELETE)

---

## 🧪 TEST CHECKLIST

Sau khi setup xong, test các chức năng sau:

### ✅ Upload
- [ ] Drag & drop ảnh vào upload area
- [ ] Click để chọn file
- [ ] Upload nhiều ảnh cùng lúc
- [ ] Upload ảnh > 2MB (sẽ có tùy chọn resize)
- [ ] Thông báo thành công hiển thị

### ✅ Media Library
- [ ] Danh sách ảnh hiển thị
- [ ] Thumbnail ảnh load
- [ ] Hiển thị tên file + kích thước
- [ ] Click vào ảnh để chọn (copy URL)
- [ ] Storage stats hiển thị (tổng dung lượng)

### ✅ Select & Use
- [ ] Click chọn ảnh từ thư viện
- [ ] URL được fill vào Featured Image field
- [ ] Preview ảnh hiển thị
- [ ] Lưu bài viết với ảnh đã chọn

### ✅ Delete
- [ ] Click nút xóa ảnh
- [ ] Confirm dialog hiển thị
- [ ] Ảnh bị xóa khỏi database
- [ ] Ảnh bị xóa khỏi storage
- [ ] Thư viện reload tự động

---

## 🔥 TROUBLESHOOTING

### Lỗi: "Table does not exist"

**Giải pháp:**
```sql
-- Verify table tồn tại:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'media_library';

-- Nếu không tồn tại, chạy lại script tạo table
```

### Lỗi: "Permission denied"

**Giải pháp:**
```sql
-- Check RLS enabled:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'media_library';

-- Check policies:
SELECT * FROM pg_policies WHERE tablename = 'media_library';

-- Nếu thiếu policies, chạy lại section tạo policies
```

### Lỗi: "Upload thành công nhưng không hiển thị"

**Giải pháp:**
1. Reload trang admin
2. Clear browser cache (Ctrl+Shift+R)
3. Check console (F12) xem có lỗi gì
4. Verify query:
```sql
SELECT COUNT(*) FROM public.media_library;
```

### Lỗi: "Storage path not found"

**Giải pháp:**
1. Verify storage bucket đã tạo
2. Check policies của storage bucket
3. Xem file `SUPABASE-SETUP-GUIDE.md` để setup lại storage

---

## 📁 FILE LIÊN QUAN

- `supabase-media-library-setup.sql` - SQL script tạo table
- `SUPABASE-SETUP-GUIDE.md` - Hướng dẫn setup storage bucket
- `js/admin-news.js` - Code xử lý upload
- `js/supabase-storage.js` - Storage client module

---

## 📞 HỖ TRỢ

Nếu vẫn gặp lỗi sau khi làm theo hướng dẫn:

1. Check browser console (F12) để xem error details
2. Check Supabase logs: Dashboard → Logs → API Logs
3. Verify Supabase connection:
```javascript
// Paste vào browser console:
const SUPABASE_URL = 'https://lyctpwhdskgkqebzreib.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
fetch(`${SUPABASE_URL}/rest/v1/media_library?select=*&limit=1`, {
  headers: { 'apikey': SUPABASE_KEY }
}).then(r => r.json()).then(console.log);
```

---

**✅ Sau khi hoàn thành, upload ảnh sẽ hoạt động bình thường!**

**Version:** 1.0  
**Last Updated:** 2025-10-22  
**Status:** Fix Ready ✅
