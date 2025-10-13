# 📖 HƯỚNG DẪN QUẢN TRỊ WEBSITE FRAMEX - DÀNH CHO NGƯỜI MỚI

**Dành cho**: Người không biết lập trình  
**Thời gian học**: 15 phút  
**Cập nhật**: 2025-01-13

---

## 🎯 MỤC LỤC

1. [Giới Thiệu Tổng Quan](#1-giới-thiệu-tổng-quan)
2. [Đăng Nhập Admin Panel](#2-đăng-nhập-admin-panel)
3. [Quản Lý Tin Tức](#3-quản-lý-tin-tức)
4. [Tạo Bài Viết Mới](#4-tạo-bài-viết-mới)
5. [Chỉnh Sửa Bài Viết](#5-chỉnh-sửa-bài-viết)
6. [Xóa Bài Viết](#6-xóa-bài-viết)
7. [Thay Đổi Mật Khẩu](#7-thay-đổi-mật-khẩu)
8. [Câu Hỏi Thường Gặp](#8-câu-hỏi-thường-gặp)

---

## 1. GIỚI THIỆU TỔNG QUAN

### Website FrameX có gì?

Website của bạn có **2 phiên bản ngôn ngữ**:

```
🇻🇳 Tiếng Việt:
   - Trang chủ: /index.html
   - Tin tức: /tin-tuc.html
   - Chi tiết bài: /article-view.html

🇬🇧 Tiếng Anh:
   - Trang chủ: /en/index.html
   - Tin tức: /en/news.html
   - Chi tiết bài: /en/article-view.html

🔐 Quản trị:
   - Đăng nhập: /admin-login.html
   - Quản lý tin: /admin-news.html
```

### Hệ thống tin tức hoạt động như thế nào?

```
┌─────────────────────────────────────────┐
│  Bạn tạo bài viết trong Admin Panel     │
│  (Viết cả 2 ngôn ngữ cùng lúc)         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Lưu vào Supabase Database              │
│  (Tự động đồng bộ)                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Hiển thị trên website                  │
│  - Trang VI: /tin-tuc.html              │
│  - Trang EN: /en/news.html              │
└─────────────────────────────────────────┘
```

**Không cần biết code!** Tất cả đều tự động!

---

## 2. ĐĂNG NHẬP ADMIN PANEL

### Bước 1: Truy cập trang đăng nhập

Vào địa chỉ:
```
https://your-username.github.io/framex-website/admin-login.html
```

*Thay `your-username` bằng tên GitHub của bạn*

### Bước 2: Nhập thông tin đăng nhập

```
👤 Tên đăng nhập: admin
🔒 Mật khẩu: framex2024
```

⚠️ **LƯU Ý**: Đổi mật khẩu ngay sau lần đăng nhập đầu tiên! (Xem [Phần 7](#7-thay-đổi-mật-khẩu))

### Bước 3: Chọn "Ghi nhớ đăng nhập" (tuỳ chọn)

- ✅ **Chọn**: Không cần đăng nhập lại trong 30 ngày
- ❌ **Không chọn**: Đăng nhập lại sau 30 phút không hoạt động

### Bước 4: Nhấn "Đăng Nhập"

Nếu thành công, bạn sẽ thấy trang quản lý tin tức.

---

## 3. QUẢN LÝ TIN TỨC

### Giao diện Admin Panel

Sau khi đăng nhập, bạn sẽ thấy 3 phần chính:

```
┌───────────────────────────────────────────────┐
│  [📝 Viết Bài]  [📋 Danh Sách]  [🖼️ Media]   │
└───────────────────────────────────────────────┘
        │              │              │
        │              │              └─ Quản lý ảnh (chưa có)
        │              └──────────────── Xem tất cả bài viết
        └─────────────────────────────── Tạo bài mới
```

### Tab "Viết Bài" (Editor)

Đây là nơi bạn tạo bài viết mới, gồm:

1. **Tab Ngôn Ngữ**:
   - `🇻🇳 Tiếng Việt` - Viết nội dung tiếng Việt
   - `🇬🇧 English` - Viết nội dung tiếng Anh

2. **Thông tin bài viết**:
   - Tiêu đề (Title)
   - Tóm tắt (Excerpt) - Hiển thị trên trang danh sách
   - Nội dung (Content) - Nội dung chi tiết

3. **Cài đặt**:
   - Danh mục (Category): Công Nghệ, Dự Án, Hướng Dẫn
   - Ảnh đại diện (Featured Image)
   - Tác giả (Author)
   - Thời gian đọc (Read Time)
   - Trạng thái (Status): Draft/Published

### Tab "Danh Sách" (List View)

Hiển thị tất cả bài viết đã tạo:

```
┌────────────────────────────────────────────┐
│ Tiêu đề bài viết               [Published] │
│ 📅 01/01/2025  📂 Công Nghệ  👤 Admin     │
│ [✏️ Sửa]  [🗑️ Xóa]                        │
└────────────────────────────────────────────┘
```

### Tab "Media" (Chưa sử dụng)

Tính năng này chưa được kích hoạt.

---

## 4. TẠO BÀI VIẾT MỚI

### Bước 1: Nhấn tab "Viết Bài"

Click vào **"📝 Viết Bài"** ở đầu trang.

### Bước 2: Viết nội dung tiếng Việt

1. Click tab **"🇻🇳 Tiếng Việt"**
2. Điền các thông tin:

```
┌─────────────────────────────────────────┐
│ Tiêu đề (bắt buộc):                     │
│ ┌─────────────────────────────────────┐ │
│ │ Giải pháp nhà thông minh FrameX     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Tóm tắt (bắt buộc):                     │
│ ┌─────────────────────────────────────┐ │
│ │ Khám phá giải pháp nhà thông minh   │ │
│ │ toàn diện với công nghệ hiện đại... │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Nội dung (bắt buộc):                    │
│ ┌─────────────────────────────────────┐ │
│ │ [WYSIWYG Editor - Như Microsoft Word]│
│ │                                     │ │
│ │ Viết nội dung ở đây...              │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

3. **Sử dụng Editor** (Giống Microsoft Word):
   - **Bold** (Đậm): Chọn chữ → Nhấn nút **B**
   - **Italic** (Nghiêng): Chọn chữ → Nhấn nút **I**
   - **Tiêu đề**: Dropdown "Normal" → Chọn "Heading 2" hoặc "Heading 3"
   - **Danh sách**: Nhấn nút **• List** hoặc **1. List**
   - **Link**: Chọn chữ → Nhấn **🔗** → Dán URL
   - **Ảnh**: Nhấn **🖼️** → Dán URL ảnh
   - **Video**: Nhấn **▶️** → Dán URL YouTube

### Bước 3: Viết nội dung tiếng Anh

1. Click tab **"🇬🇧 English"**
2. Điền **cùng nội dung** nhưng bằng tiếng Anh:

```
Title: FrameX Smart Home Solution
Excerpt: Discover comprehensive smart home...
Content: [Viết bằng tiếng Anh]
```

### Bước 4: Cài đặt thêm

Scroll xuống dưới, điền:

```
┌─────────────────────────────────────────┐
│ Danh mục: [Chọn một]                    │
│  ○ Công Nghệ                            │
│  ○ Dự Án                                │
│  ○ Hướng Dẫn                            │
│                                         │
│ URL Ảnh Đại Diện (tuỳ chọn):           │
│ https://example.com/image.jpg           │
│                                         │
│ Tác giả:                                │
│ FrameX Team                             │
│                                         │
│ Thời gian đọc:                          │
│ 5 phút                                  │
│                                         │
│ Trạng thái:                             │
│  ○ Draft (Nháp - chưa hiển thị)        │
│  ● Published (Xuất bản - hiển thị)      │
└─────────────────────────────────────────┘
```

### Bước 5: Lưu bài viết

1. Nhấn nút **"💾 Lưu Bài Viết"** màu xanh
2. Đợi thông báo: **"✅ Bài viết đã được lưu thành công!"**
3. Tự động chuyển sang tab "Danh Sách" sau 2 giây

### ✅ Xong! Bài viết đã online!

Kiểm tra tại:
- **Tiếng Việt**: https://your-site/tin-tuc.html
- **Tiếng Anh**: https://your-site/en/news.html

---

## 5. CHỈNH SỬA BÀI VIẾT

### Bước 1: Vào tab "Danh Sách"

Click **"📋 Danh Sách"** để xem tất cả bài viết.

### Bước 2: Tìm bài cần sửa

Scroll tìm bài viết cần chỉnh sửa.

### Bước 3: Click "Sửa"

Nhấn nút **"✏️ Sửa"** ở bài viết đó.

### Bước 4: Chỉnh sửa nội dung

- Trang sẽ tự động chuyển sang tab "Viết Bài"
- Thông tin bài viết đã được điền sẵn
- Chỉnh sửa bất kỳ phần nào bạn muốn

### Bước 5: Lưu lại

Nhấn **"💾 Lưu Bài Viết"** để cập nhật.

**Lưu ý**: Thay đổi sẽ hiển thị ngay trên website!

---

## 6. XÓA BÀI VIẾT

### ⚠️ CẢNH BÁO: Không thể hoàn tác!

Khi xóa bài viết, nó sẽ **mất vĩnh viễn** khỏi database!

### Bước 1: Vào tab "Danh Sách"

Click **"📋 Danh Sách"**.

### Bước 2: Tìm bài cần xóa

Scroll tìm bài viết cần xóa.

### Bước 3: Click "Xóa"

Nhấn nút **"🗑️ Xóa"** màu đỏ.

### Bước 4: Xác nhận

Hộp thoại sẽ hỏi:
```
Bạn có chắc muốn xóa bài viết "[Tên bài]"?
[Hủy]  [OK]
```

Nhấn **"OK"** để xác nhận xóa.

### Bước 5: Hoàn tất

Thông báo: **"🗑️ Đã xóa bài viết"**

Bài viết sẽ biến mất khỏi:
- Danh sách admin
- Trang tin tức website
- Database

---

## 7. THAY ĐỔI MẬT KHẨU

### ⚠️ CỰC KỲ QUAN TRỌNG!

Mật khẩu mặc định **`framex2024`** là công khai. Bất kỳ ai cũng có thể đăng nhập!

### Cách đổi mật khẩu:

**Bạn cần có quyền truy cập GitHub repository!**

#### Bước 1: Vào GitHub Repository

1. Truy cập: https://github.com/your-username/framex-website
2. Đăng nhập GitHub

#### Bước 2: Mở file `js/auth.js`

1. Click vào folder **`js/`**
2. Click vào file **`auth.js`**
3. Click icon **✏️ Edit** (bút chì) ở góc phải

#### Bước 3: Tìm dòng mật khẩu

Nhấn **Ctrl+F** (hoặc **Cmd+F** trên Mac), tìm:
```javascript
password: 'framex2024'
```

#### Bước 4: Thay đổi mật khẩu

Đổi thành:
```javascript
password: 'MatKhauMoiCuaBan123!'
```

**Mật khẩu mạnh nên có**:
- ✅ Ít nhất 12 ký tự
- ✅ Chữ hoa, chữ thường, số
- ✅ Ký tự đặc biệt (@, #, !, $...)
- ❌ Không dùng tên, ngày sinh

**Ví dụ tốt**: `FrameX@2025#Admin!Secure`

#### Bước 5: Lưu thay đổi

1. Scroll xuống dưới cùng
2. Commit message: `Change admin password`
3. Nhấn nút **"Commit changes"** màu xanh

#### Bước 6: Đợi 1-2 phút

GitHub Pages sẽ tự động cập nhật website.

#### Bước 7: Thử đăng nhập lại

1. Đăng xuất Admin Panel
2. Đăng nhập với mật khẩu mới
3. Nếu thành công → Xong!

---

## 8. CÂU HỎI THƯỜNG GẶP

### ❓ Tôi quên mật khẩu, làm sao?

**Trả lời**: 
1. Vào GitHub repository
2. Xem file `js/auth.js`
3. Dòng `password: '...'` chính là mật khẩu hiện tại
4. Hoặc đổi mật khẩu mới theo [Phần 7](#7-thay-đổi-mật-khẩu)

### ❓ Tôi tạo bài viết nhưng không hiển thị trên website?

**Nguyên nhân**:
- Trạng thái bài viết là **"Draft"** (nháp)

**Cách fix**:
1. Vào Admin Panel → Tab "Danh Sách"
2. Click **"✏️ Sửa"** bài viết đó
3. Đổi **Trạng thái** thành **"Published"**
4. Nhấn **"💾 Lưu"**

### ❓ Làm sao để thêm ảnh vào bài viết?

**Cách 1**: Dùng URL ảnh online
1. Upload ảnh lên dịch vụ như:
   - Imgur: https://imgur.com/
   - Cloudinary: https://cloudinary.com/
   - Google Drive (public link)
2. Copy URL ảnh
3. Trong Editor, nhấn nút **🖼️ Image**
4. Dán URL → OK

**Cách 2**: Dán code HTML trực tiếp
```html
<img src="https://example.com/image.jpg" alt="Mô tả ảnh">
```

### ❓ Làm sao để thêm video YouTube?

**Bước 1**: Lấy URL video
- Vào YouTube video
- Copy URL (ví dụ: `https://www.youtube.com/watch?v=ABC123`)

**Bước 2**: Trong Editor
1. Click nút **▶️ Video**
2. Dán URL YouTube
3. OK

### ❓ Tôi muốn đổi tên tác giả?

Trong form tạo/sửa bài, có ô **"Tác giả"**:
```
Tác giả: [____________________]
         FrameX Team (mặc định)
```

Đổi thành tên bạn muốn.

### ❓ Tôi có thể xem trước bài viết trước khi publish không?

**Hiện tại**: Không có tính năng preview.

**Giải pháp**:
1. Lưu với trạng thái **"Draft"**
2. Vào trang tin tức, bài viết sẽ **không hiển thị**
3. Sau khi kiểm tra nội dung trong Editor, đổi thành **"Published"**

### ❓ Làm sao biết có bao nhiêu bài viết?

Vào tab **"📋 Danh Sách"**, số lượng bài viết sẽ hiển thị ở đầu trang.

### ❓ Tôi có thể sắp xếp lại thứ tự bài viết không?

**Không cần!** Bài viết tự động sắp xếp theo **ngày xuất bản**, mới nhất lên đầu.

### ❓ Tôi muốn bài viết cũ lên đầu?

Chỉnh sửa bài viết đó, hệ thống sẽ tự động cập nhật **ngày sửa đổi** → Lên đầu.

### ❓ Website hỗ trợ bao nhiêu ngôn ngữ?

**2 ngôn ngữ**:
- 🇻🇳 Tiếng Việt (mặc định)
- 🇬🇧 Tiếng Anh (folder `/en/`)

**Lưu ý**: Khi tạo bài, phải viết **CẢ 2 NGÔN NGỮ** cùng lúc!

### ❓ Tôi chỉ muốn viết tiếng Việt, không viết tiếng Anh được không?

**Không!** Hệ thống yêu cầu **cả 2 ngôn ngữ**.

**Giải pháp tạm thời**:
- Viết tiếng Việt đầy đủ
- Copy sang tab English
- Dùng Google Translate dịch nhanh

### ❓ Làm sao đăng xuất khỏi Admin Panel?

Click nút **"🚪 Đăng Xuất"** ở góc trên bên phải.

### ❓ Tôi có thể tạo bao nhiêu bài viết?

**Giới hạn Supabase Free Tier**:
- Database: 500MB
- Khoảng **~500 bài viết** (trung bình 1MB/bài)

Nếu hết, cần upgrade lên plan trả phí ($25/tháng).

### ❓ Ai có thể truy cập Admin Panel?

**Chỉ người có mật khẩu!**

**Lưu ý bảo mật**:
- ❌ Không chia sẻ mật khẩu
- ❌ Không đăng nhập trên máy công cộng
- ✅ Đăng xuất sau khi dùng xong
- ✅ Đổi mật khẩu định kỳ (3-6 tháng)

---

## 📞 HỖ TRỢ

### Nếu gặp lỗi:

1. **Mở Browser Console** (F12):
   - Chrome: F12 → Tab "Console"
   - Xem lỗi màu đỏ
   - Screenshot và gửi cho IT support

2. **Kiểm tra kết nối mạng**:
   - Đảm bảo có internet
   - Thử tải lại trang (Ctrl+R)

3. **Xóa cache trình duyệt**:
   - Chrome: Ctrl+Shift+Delete
   - Chọn "Cached images and files"
   - Clear data

4. **Thử trình duyệt khác**:
   - Chrome (khuyên dùng)
   - Edge
   - Firefox

### Liên hệ:

- 📧 Email: support@framex.vn
- 📱 Hotline: [Số điện thoại]
- 💬 Zalo: [Zalo ID]

---

## ✅ CHECKLIST QUẢN TRỊ VIÊN

In ra và đánh dấu khi hoàn thành:

### Lần đầu sử dụng:
- [ ] Đăng nhập thành công
- [ ] Đổi mật khẩu mặc định
- [ ] Tạo bài viết test (cả VI + EN)
- [ ] Kiểm tra bài viết hiển thị trên website
- [ ] Thử chỉnh sửa bài viết
- [ ] Thử xóa bài viết test

### Hàng tuần:
- [ ] Tạo 2-3 bài viết mới
- [ ] Kiểm tra bài viết cũ (cập nhật nếu cần)
- [ ] Kiểm tra website hoạt động tốt

### Hàng tháng:
- [ ] Review tất cả bài viết
- [ ] Xóa bài viết lỗi thời (nếu có)
- [ ] Backup database (vào Supabase Dashboard)
- [ ] Đổi mật khẩu (mỗi 3-6 tháng)

---

## 🎓 MẸO VÀ THỦ THUẬT

### Mẹo 1: Viết bài nhanh

1. Chuẩn bị nội dung trong **Microsoft Word** trước
2. Copy-paste vào Editor
3. Format lại (bold, heading, list...)
4. Lưu

### Mẹo 2: Sử dụng template

Tạo 1 bài viết "template" với:
- Cấu trúc chuẩn (tiêu đề, giới thiệu, nội dung, kết luận)
- Copy template này khi tạo bài mới
- Chỉ cần đổi nội dung

### Mẹo 3: Đặt tên danh mục rõ ràng

```
✅ Tốt:
- Công Nghệ Nhà Thông Minh
- Dự Án Hoàn Thành 2024
- Hướng Dẫn Sử Dụng Sản Phẩm

❌ Tránh:
- Tech
- Project
- Guide
```

### Mẹo 4: Viết excerpt hấp dẫn

Excerpt (tóm tắt) sẽ hiển thị trên trang danh sách.

**Tốt**: "Khám phá 5 xu hướng nhà thông minh hot nhất năm 2025 giúp tiết kiệm 30% chi phí điện..."

**Tránh**: "Bài viết này nói về nhà thông minh."

### Mẹo 5: Tối ưu SEO

- Tiêu đề: 50-60 ký tự
- Excerpt: 150-160 ký tự
- Nội dung: Ít nhất 300 từ
- Dùng heading (H2, H3) để chia phần
- Thêm ảnh (tốt cho SEO)

---

## 🎉 KẾT LUẬN

Bạn đã học xong cách quản trị website FrameX!

**Những gì bạn có thể làm**:
- ✅ Đăng nhập Admin Panel
- ✅ Tạo bài viết mới (2 ngôn ngữ)
- ✅ Chỉnh sửa bài viết
- ✅ Xóa bài viết
- ✅ Đổi mật khẩu

**Không cần biết code!** Tất cả đều thông qua giao diện đơn giản!

---

**Chúc bạn quản trị website thành công!** 🚀

*Tài liệu này được cập nhật thường xuyên. Phiên bản hiện tại: 1.0 (2025-01-13)*
