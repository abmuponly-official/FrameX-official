# ✅ FRAMEX SETUP CHECKLIST

## 📋 Checklist để Deploy Phase 1 + 2 + 3

Sử dụng checklist này để đảm bảo mọi thứ hoạt động!

---

## PHASE 1 + 2: Featured Images System ✅

### ✅ Đã hoàn thành tự động:
- [x] Enhanced CSS với gradients
- [x] Category-specific colors
- [x] Default images uploaded
- [x] Smart fallback logic
- [x] Bilingual support
- [x] Responsive design

### ✨ Không cần làm gì!
Phase 1 & 2 hoạt động ngay sau khi merge PR!

---

## PHASE 3: Admin Upload System 🚀

### ⚠️ CẦN SETUP THỦ CÔNG:

#### BƯỚC 1: Supabase Storage Setup

##### 1.1 Vào Supabase Dashboard
```
URL: https://supabase.com/dashboard
Project: lyctpwhdskgkqebzreib
```

- [ ] Đăng nhập vào Supabase
- [ ] Chọn project FrameX

##### 1.2 Tạo Storage Bucket
- [ ] Click **Storage** (left sidebar)
- [ ] Click **Create a new bucket**
- [ ] Điền thông tin:
  - Name: `news-images`
  - Public bucket: ✅ **YES**
  - File size limit: `10` MB
- [ ] Click **Create bucket**

##### 1.3 Setup Policies
Tạo 4 policies cho bucket `news-images`:

**Policy #1: Public Read**
- [ ] Click **New Policy**
- [ ] Name: `Public Read Access`
- [ ] Operation: `SELECT`
- [ ] Definition: `true`
- [ ] Target roles: `public`
- [ ] Save policy

**Policy #2: Public Upload**
- [ ] Click **New Policy**
- [ ] Name: `Public Upload Access`
- [ ] Operation: `INSERT`
- [ ] Definition: `true`
- [ ] Target roles: `anon`
- [ ] Save policy

**Policy #3: Public Update**
- [ ] Click **New Policy**
- [ ] Name: `Public Update Access`
- [ ] Operation: `UPDATE`
- [ ] Definition: `true`
- [ ] Target roles: `anon`
- [ ] Save policy

**Policy #4: Public Delete**
- [ ] Click **New Policy**
- [ ] Name: `Public Delete Access`
- [ ] Operation: `DELETE`
- [ ] Definition: `true`
- [ ] Target roles: `anon`
- [ ] Save policy

##### 1.4 Verify Setup
- [ ] Check bucket `news-images` exists
- [ ] Check 4 policies active
- [ ] Check Public = Yes

---

#### BƯỚC 2: Test Upload Feature

##### 2.1 Vào Admin Panel
```
URL: https://framex.vn/admin-news.html
```

- [ ] Login với credentials:
  - Username: `admin`
  - Password: `framex2024`

##### 2.2 Test Upload
- [ ] Click **Thư Viện Media** tab
- [ ] Drag & drop một ảnh test
- [ ] Check upload thành công
- [ ] Check storage stats hiển thị
- [ ] Check ảnh xuất hiện trong library

##### 2.3 Test Select Image
- [ ] Click vào ảnh trong library
- [ ] Check ảnh tự động fill vào form
- [ ] Check preview hiển thị
- [ ] Check có nút xóa preview

##### 2.4 Test Delete Image
- [ ] Click nút trash trên ảnh
- [ ] Confirm deletion
- [ ] Check ảnh biến mất khỏi library
- [ ] Check storage stats update

---

#### BƯỚC 3: Test Article Creation Flow

##### 3.1 Create Article with Uploaded Image
- [ ] Vào **Editor** tab
- [ ] Điền thông tin bài viết
- [ ] Vào **Thư Viện Media**
- [ ] Upload ảnh mới (hoặc chọn có sẵn)
- [ ] Select ảnh
- [ ] Check preview hiển thị trong form
- [ ] Click **Lưu Bài Viết**

##### 3.2 Verify on Website
- [ ] Vào `/tin-tuc.html`
- [ ] Check bài viết mới hiển thị
- [ ] Check featured image hiển thị đúng
- [ ] Check hover effect hoạt động
- [ ] Check responsive trên mobile

---

## 🎯 VERIFICATION CHECKLIST

### ✅ Phase 1 & 2 Working:
- [ ] Default images hiển thị cho bài viết không có ảnh
- [ ] Category gradients đúng màu
- [ ] Hover zoom effect hoạt động
- [ ] Responsive trên mobile

### ✅ Phase 3 Working:
- [ ] Upload ảnh thành công
- [ ] Progress indicator hiển thị
- [ ] Auto-resize prompt (nếu ảnh >2MB)
- [ ] Preview trong form
- [ ] Delete ảnh hoạt động
- [ ] Storage stats hiển thị
- [ ] Images có public URL

---

## 🐛 TROUBLESHOOTING

### ❌ Upload không hoạt động

**Check:**
1. [ ] Bucket `news-images` exists
2. [ ] Bucket là public
3. [ ] 4 policies đã được tạo
4. [ ] Policy definitions = `true`
5. [ ] Browser console không có errors

**Fix:**
- Xem chi tiết trong `SUPABASE-SETUP-GUIDE.md`
- Hoặc run SQL script: `supabase-storage-setup.sql`

---

### ❌ Images không hiển thị

**Check:**
1. [ ] Featured image URL đúng format
2. [ ] Bucket public = Yes
3. [ ] Public Read policy active

**Fix:**
- Verify URL format:
  ```
  https://lyctpwhdskgkqebzreib.supabase.co/storage/v1/object/public/news-images/uploads/filename.jpg
  ```

---

### ❌ Delete không hoạt động

**Check:**
1. [ ] Public Delete policy exists
2. [ ] Target roles = `anon`

**Fix:**
- Recreate delete policy via UI
- Hoặc run SQL để drop và recreate

---

## 📊 SUCCESS CRITERIA

### ✅ Tất cả phải hoạt động:
- [ ] ✅ Upload ảnh qua drag & drop
- [ ] ✅ Upload ảnh qua click
- [ ] ✅ Multiple images upload
- [ ] ✅ Auto-resize large images
- [ ] ✅ Preview trong form
- [ ] ✅ Delete images
- [ ] ✅ Storage stats hiển thị
- [ ] ✅ Select image từ library
- [ ] ✅ Featured images trên website
- [ ] ✅ Default images fallback
- [ ] ✅ Responsive design

---

## 🎉 COMPLETED!

Khi tất cả checkboxes ✅, website đã sẵn sàng production!

**Next Steps:**
1. Merge PR #3
2. Deploy to production
3. Test live website
4. Upload real images cho content
5. Enjoy your professional CMS! 🚀

---

## 📞 NEED HELP?

- **Setup Guide:** Xem `SUPABASE-SETUP-GUIDE.md`
- **SQL Script:** Xem `supabase-storage-setup.sql`
- **GitHub PR:** https://github.com/abmuponly-official/FrameX-official/pull/3

---

**Last Updated:** Phase 3 Implementation
**Status:** Ready for Deployment ✅
