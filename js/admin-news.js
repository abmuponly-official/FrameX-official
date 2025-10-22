// FrameX News Management System
// WYSIWYG Editor với Quill.js - Dễ sử dụng như Microsoft Word

// Supabase Configuration
const SUPABASE_URL = 'https://lyctpwhdskgkqebzreib.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Y3Rwd2hkc2tna3FlYnpyZWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNjMyMzksImV4cCI6MjA3NTkzOTIzOX0.vQE07u5WYJIf8R5XqBfcEAcxygnRzy0n2_NetC9IhMk';

// Initialize Supabase Storage Client
let storageClient;
if (typeof SupabaseStorageClient !== 'undefined') {
    storageClient = new SupabaseStorageClient(SUPABASE_URL, SUPABASE_KEY);
}

let quillVi, quillEn;
let currentArticleId = null;

// Initialize Quill Editors
function initEditors() {
    const toolbarOptions = [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    quillVi = new Quill('#editorVi', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Viết nội dung bài viết ở đây... Sử dụng các công cụ phía trên giống như Microsoft Word.'
    });

    quillEn = new Quill('#editorEn', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Write your article content here... Use the tools above like Microsoft Word.'
    });
}

// Language Tab Switching
function initLanguageTabs() {
    const tabs = document.querySelectorAll('.lang-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const lang = tab.dataset.lang;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            document.querySelectorAll('.lang-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelector(`.lang-content[data-lang="${lang}"]`).classList.add('active');
        });
    });
}

// View Management
function showView(view) {
    const views = {
        editor: document.getElementById('editorView'),
        list: document.getElementById('listView'),
        media: document.getElementById('mediaView')
    };

    Object.values(views).forEach(v => v.classList.add('hidden'));
    views[view].classList.remove('hidden');

    if (view === 'list') {
        loadArticlesList();
    } else if (view === 'media') {
        loadMediaLibrary();
    }
}

// Alert System
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Generate Slug from Title
function generateSlug(text) {
    const vietnameseMap = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D'
    };

    let slug = text.toLowerCase();
    
    // Replace Vietnamese characters
    for (const [key, value] of Object.entries(vietnameseMap)) {
        slug = slug.replace(new RegExp(key, 'g'), value);
    }
    
    // Remove special characters and replace spaces with hyphens
    slug = slug
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    return slug;
}

// Form Submission
document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titleVi = document.getElementById('titleVi').value.trim();
    const titleEn = document.getElementById('titleEn').value.trim();
    const excerptVi = document.getElementById('excerptVi').value.trim();
    const excerptEn = document.getElementById('excerptEn').value.trim();
    const contentVi = quillVi.root.innerHTML;
    const contentEn = quillEn.root.innerHTML;
    const category = document.getElementById('category').value;
    const featuredImage = document.getElementById('featuredImage').value.trim();
    const author = document.getElementById('author').value.trim();
    const readTime = parseInt(document.getElementById('readTime').value);
    const status = document.getElementById('status').value;

    // Validation with detailed error messages
    const missingFields = [];
    if (!titleVi) missingFields.push('Tiêu đề (Tiếng Việt)');
    if (!titleEn) missingFields.push('Title (English)');
    if (!excerptVi) missingFields.push('Tóm tắt (Tiếng Việt)');
    if (!excerptEn) missingFields.push('Excerpt (English)');
    if (!category) missingFields.push('Danh mục');
    
    if (missingFields.length > 0) {
        showAlert(`❌ Thiếu thông tin: ${missingFields.join(', ')}`, 'danger');
        return;
    }

    const viContentLength = quillVi.getText().trim().length;
    const enContentLength = quillEn.getText().trim().length;
    
    if (viContentLength < 50) {
        showAlert(`❌ Nội dung Tiếng Việt quá ngắn (${viContentLength}/50 ký tự). Vui lòng viết thêm!`, 'danger');
        return;
    }
    
    if (enContentLength < 50) {
        showAlert(`❌ Nội dung English quá ngắn (${enContentLength}/50 ký tự). Vui lòng viết thêm!`, 'danger');
        return;
    }

    // Generate slugs
    const slugVi = generateSlug(titleVi);
    const slugEn = generateSlug(titleEn);

    // Category names
    const categoryNames = {
        'cong-nghe': { vi: 'Công Nghệ', en: 'Technology' },
        'du-an': { vi: 'Dự Án', en: 'Projects' },
        'huong-dan': { vi: 'Hướng Dẫn', en: 'Guides' }
    };

    const articleData = {
        title_vi: titleVi,
        title_en: titleEn,
        slug_vi: slugVi,
        slug_en: slugEn,
        category: category,
        category_vi: categoryNames[category].vi,
        category_en: categoryNames[category].en,
        excerpt_vi: excerptVi,
        excerpt_en: excerptEn,
        content_vi: contentVi,
        content_en: contentEn,
        featured_image: featuredImage || '',
        media_gallery: [],
        author: author || 'FrameX Team',
        read_time: readTime || 5,
        published_date: new Date().toISOString(),
        status: status,
        meta_description_vi: excerptVi.substring(0, 160),
        meta_description_en: excerptEn.substring(0, 160)
    };

    console.log('📝 Saving article:', {
        titleVi,
        titleEn,
        category,
        status,
        contentViLength: viContentLength,
        contentEnLength: enContentLength
    });
    console.log('📦 Article data to save:', articleData);

    try {
        let response;
        if (currentArticleId) {
            console.log('✏️ Updating article ID:', currentArticleId);
            // Update existing article with Supabase
            response = await fetch(`${SUPABASE_URL}/rest/v1/news_articles?id=eq.${currentArticleId}`, {
                method: 'PATCH',
                headers: { 
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(articleData)
            });
        } else {
            console.log('➕ Creating new article');
            // Create new article with Supabase
            response = await fetch(`${SUPABASE_URL}/rest/v1/news_articles`, {
                method: 'POST',
                headers: { 
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(articleData)
            });
        }

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Supabase response:', result);
            // Supabase returns array, get first item
            const savedArticle = Array.isArray(result) ? result[0] : result;
            console.log('📄 Saved article details:', {
                id: savedArticle.id,
                title_vi: savedArticle.title_vi,
                status: savedArticle.status,
                published_date: savedArticle.published_date
            });
            showAlert(`✅ Bài viết "${titleVi}" đã được lưu thành công! Status: ${savedArticle.status}`, 'success');
            
            // Generate static HTML files
            await generateStaticPages(savedArticle);
            
            resetForm();
            setTimeout(() => {
                showView('list');
                loadArticlesList(); // Force reload articles list
            }, 1500);
        } else {
            // Get detailed error message
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('❌ Supabase Error:', response.status, errorData);
            showAlert(`❌ Lỗi Supabase (${response.status}): ${errorData.message || errorData.hint || 'Kiểm tra Console (F12) để xem chi tiết'}`, 'danger');
        }
    } catch (error) {
        console.error('Error saving article:', error);
        showAlert(`❌ Lỗi: ${error.message || 'Không thể lưu bài viết. Kiểm tra kết nối mạng!'}`, 'danger');
    }
});

// Generate Static HTML Pages
async function generateStaticPages(article) {
    // This function will be called after saving
    // In a real implementation, you would generate static HTML files here
    console.log('Generated static pages for:', article.title_vi);
    
    showAlert(`📄 Đã tạo trang: tin-tuc/${article.slug_vi}.html và en/news/${article.slug_en}.html`, 'info');
}

// Reset Form
function resetForm() {
    document.getElementById('articleForm').reset();
    quillVi.setContents([]);
    quillEn.setContents([]);
    currentArticleId = null;
}

// Load Articles List
async function loadArticlesList() {
    const container = document.getElementById('articlesList');
    container.innerHTML = '<div class="spinner"></div>';

    try {
        // Chỉ lấy fields cần thiết cho danh sách (không lấy content_vi, content_en để tăng tốc)
        const response = await fetch(`${SUPABASE_URL}/rest/v1/news_articles?select=id,title_vi,title_en,category,status,published_date,read_time&order=published_date.desc&limit=50`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('❌ Supabase Load Error:', response.status, errorData);
            throw new Error(`Supabase Error ${response.status}: ${errorData.message || errorData.hint || 'Kiểm tra tên bảng và RLS settings'}`);
        }
        
        const data = await response.json();
        console.log('📰 Loaded articles:', data.length, 'articles');

        if (data && data.length > 0) {
            const articlesHTML = data.map(article => {
                const statusBadge = {
                    'published': 'badge-published',
                    'draft': 'badge-draft',
                    'archived': 'badge-archived'
                }[article.status] || 'badge-draft';

                const date = new Date(article.published_date).toLocaleDateString('vi-VN');

                return `
                    <div class="article-item" data-id="${article.id}">
                        <div class="article-item-title">${article.title_vi}</div>
                        <div class="article-item-meta">
                            <span class="badge ${statusBadge}">${article.status}</span>
                            <span><i class="far fa-calendar"></i> ${date}</span>
                            <span><i class="far fa-clock"></i> ${article.read_time} phút</span>
                        </div>
                        <div class="article-item-actions">
                            <button class="btn btn-sm btn-primary" onclick="editArticle('${article.id}')">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteArticle('${article.id}', '${article.title_vi}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                            <a href="article-view.html?id=${article.id}" class="btn btn-sm btn-secondary" target="_blank" title="Xem preview bài viết">
                                <i class="fas fa-eye"></i> Xem
                            </a>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = `<div class="articles-list">${articlesHTML}</div>`;
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <h3>Chưa có bài viết nào</h3>
                    <p>Hãy bắt đầu viết bài viết đầu tiên của bạn!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error loading articles:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <strong>Lỗi khi tải danh sách bài viết</strong><br>
                ${error.message}<br>
                <small>Kiểm tra Console (F12) để xem chi tiết</small>
            </div>
        `;
    }
}

// Edit Article
async function editArticle(articleId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/news_articles?id=eq.${articleId}&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const article = data[0]; // Supabase returns array

        currentArticleId = articleId;

        // Fill form
        document.getElementById('titleVi').value = article.title_vi;
        document.getElementById('titleEn').value = article.title_en;
        document.getElementById('excerptVi').value = article.excerpt_vi;
        document.getElementById('excerptEn').value = article.excerpt_en;
        document.getElementById('category').value = article.category;
        document.getElementById('featuredImage').value = article.featured_image;
        document.getElementById('author').value = article.author;
        document.getElementById('readTime').value = article.read_time;
        document.getElementById('status').value = article.status;

        // Set editor content
        quillVi.root.innerHTML = article.content_vi;
        quillEn.root.innerHTML = article.content_en;

        // Show editor view
        showView('editor');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        showAlert(`✏️ Đang chỉnh sửa bài: "${article.title_vi}"`, 'info');
    } catch (error) {
        console.error('Error loading article:', error);
        showAlert('❌ Lỗi khi tải bài viết', 'danger');
    }
}

// Delete Article
async function deleteArticle(articleId, title) {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/news_articles?id=eq.${articleId}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showAlert(`🗑️ Đã xóa bài viết "${title}"`, 'success');
            loadArticlesList();
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        showAlert('❌ Lỗi khi xóa bài viết', 'danger');
    }
}

// Media Library
async function loadMediaLibrary() {
    const container = document.getElementById('mediaLibrary');
    container.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/media_library?select=*&order=uploaded_at.desc&limit=100`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            const mediaHTML = data.map(media => {
                const isVideo = media.type === 'video';
                const icon = isVideo ? 'fa-video' : 'fa-image';
                const preview = isVideo ? 
                    `<div style="display: flex; align-items: center; justify-content: center; height: 150px; background: #f0f0f0;"><i class="fas ${icon}" style="font-size: 3rem; color: #999;"></i></div>` :
                    `<img src="${media.url}" alt="${media.filename}" loading="lazy">`;

                const sizeKB = (media.size / 1024).toFixed(0);
                const storagePath = media.storage_path || '';
                
                // Escape attributes to prevent injection
                const escapedFilename = media.filename.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                const escapedUrl = media.url.replace(/"/g, '&quot;');
                const escapedPath = storagePath.replace(/"/g, '&quot;');

                return `
                    <div class="media-item" data-url="${escapedUrl}" data-id="${media.id}" data-path="${escapedPath}" data-filename="${escapedFilename}">
                        <div onclick="selectMedia('${media.url}', '${media.filename}')" style="cursor: pointer;">
                            ${preview}
                        </div>
                        <div class="media-item-info">
                            <div style="flex: 1; overflow: hidden;">
                                <div style="font-size: 0.875rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    <i class="fas ${icon}"></i> ${media.filename}
                                </div>
                                <div style="font-size: 0.75rem; color: #6c757d;">${sizeKB} KB</div>
                            </div>
                            <button class="delete-media-btn"
                                data-media-id="${media.id}"
                                data-storage-path="${escapedPath}"
                                data-filename="${escapedFilename}"
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    padding: 0.4rem 0.6rem;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 0.75rem;
                                    transition: all 0.3s;
                                " 
                                onmouseover="this.style.background='#c82333'" 
                                onmouseout="this.style.background='#dc3545'"
                                title="Xóa ảnh">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = `<div class="media-grid">${mediaHTML}</div>`;
            
            // Add event listeners to delete buttons
            container.querySelectorAll('.delete-media-btn').forEach(btn => {
                btn.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    const mediaId = btn.dataset.mediaId;
                    const storagePath = btn.dataset.storagePath;
                    const filename = btn.dataset.filename;
                    await deleteMedia(event, mediaId, storagePath, filename);
                });
            });
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>Thư viện trống</h3>
                    <p>Upload ảnh hoặc video để bắt đầu</p>
                </div>
            `;
        }
        
        // Show storage stats after loading media
        await showStorageStats();
        
    } catch (error) {
        console.error('Error loading media:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                Lỗi khi tải thư viện media
            </div>
        `;
    }
}

// Select Media - Enhanced with preview
function selectMedia(url, filename = '') {
    const inputField = document.getElementById('featuredImage');
    inputField.value = url;
    
    // Show image preview
    showImagePreview(url);
    
    showAlert(`✅ Đã chọn ảnh: ${filename || 'Featured Image'}`, 'success');
    showView('editor');
}

// Show image preview in form
function showImagePreview(url) {
    // Find or create preview container
    let previewContainer = document.getElementById('imagePreviewContainer');
    
    if (!previewContainer) {
        const featuredImageInput = document.getElementById('featuredImage');
        previewContainer = document.createElement('div');
        previewContainer.id = 'imagePreviewContainer';
        previewContainer.style.cssText = 'margin-top: 1rem;';
        featuredImageInput.parentNode.appendChild(previewContainer);
    }
    
    if (url) {
        previewContainer.innerHTML = `
            <div style="
                border: 2px solid #e1e8ed;
                border-radius: 8px;
                padding: 0.5rem;
                background: #f8f9fa;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                ">
                    <span style="font-size: 0.875rem; font-weight: 600; color: #2c3e50;">
                        <i class="fas fa-image"></i> Preview
                    </span>
                    <button type="button" onclick="clearImagePreview()" style="
                        background: none;
                        border: none;
                        color: #dc3545;
                        cursor: pointer;
                        font-size: 0.875rem;
                        padding: 0.25rem 0.5rem;
                    ">
                        <i class="fas fa-times"></i> Xóa
                    </button>
                </div>
                <img src="${url}" alt="Preview" style="
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 4px;
                    display: block;
                ">
            </div>
        `;
    } else {
        previewContainer.innerHTML = '';
    }
}

// Clear image preview
function clearImagePreview() {
    document.getElementById('featuredImage').value = '';
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }
    showAlert('✅ Đã xóa ảnh', 'info');
}

// Delete media from storage and database
async function deleteMedia(event, mediaId, storagePath, filename) {
    event.stopPropagation(); // Prevent triggering selectMedia
    
    // Confirm deletion
    const confirmed = confirm(
        `Bạn có chắc muốn xóa ảnh này?\n\n` +
        `File: ${filename}\n` +
        `Lưu ý: Các bài viết đang dùng ảnh này sẽ bị ảnh hưởng.`
    );
    
    if (!confirmed) return;
    
    try {
        // Delete from Supabase Storage if path exists
        if (storagePath && storageClient) {
            const deleteResult = await storageClient.deleteFile(storagePath);
            if (!deleteResult.success) {
                console.warn('Could not delete from storage:', deleteResult.error);
            }
        }
        
        // Delete from database
        const response = await fetch(`${SUPABASE_URL}/rest/v1/media_library?id=eq.${mediaId}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (response.ok) {
            showAlert(`✅ Đã xóa: ${filename}`, 'success');
            // Reload library
            await loadMediaLibrary();
        } else {
            throw new Error('Delete from database failed');
        }
        
    } catch (error) {
        console.error('Delete media error:', error);
        showAlert(`❌ Lỗi xóa ảnh: ${filename}`, 'danger');
    }
}

// Upload Area
const uploadArea = document.getElementById('uploadArea');
const mediaUpload = document.getElementById('mediaUpload');

uploadArea.addEventListener('click', () => {
    mediaUpload.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#FF6B35';
    uploadArea.style.background = '#fff5f2';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#e1e8ed';
    uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e1e8ed';
    uploadArea.style.background = 'transparent';
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
});

mediaUpload.addEventListener('change', (e) => {
    handleFileUpload(e.target.files);
});

// Handle File Upload - Phase 3: Full Implementation
async function handleFileUpload(files) {
    if (!files || files.length === 0) return;

    // Check if storage client is available
    if (!storageClient) {
        showAlert('❌ Storage client chưa được khởi tạo', 'danger');
        return;
    }

    for (const file of files) {
        try {
            // Skip non-image files
            if (!file.type.startsWith('image/')) {
                showAlert(`❌ Chỉ hỗ trợ file ảnh: ${file.name}`, 'danger');
                continue;
            }

            // Option to resize large images
            let fileToUpload = file;
            if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
                const shouldResize = confirm(
                    `File "${file.name}" có dung lượng ${(file.size / 1024 / 1024).toFixed(1)}MB.\n` +
                    `Bạn có muốn tự động tối ưu để giảm dung lượng không?`
                );
                
                if (shouldResize) {
                    try {
                        fileToUpload = await storageClient.resizeImage(file, 1200, 800);
                        const savedSize = ((file.size - fileToUpload.size) / 1024 / 1024).toFixed(1);
                        showAlert(`✅ Đã tối ưu: Tiết kiệm ${savedSize}MB`, 'success');
                    } catch (resizeError) {
                        console.warn('Resize failed, using original:', resizeError);
                        fileToUpload = file;
                    }
                }
            }

            // Upload to Supabase Storage
            const uploadResult = await storageClient.uploadFile(fileToUpload, 'news-images');

            if (uploadResult.success) {
                // Save metadata to database
                const mediaData = {
                    filename: uploadResult.filename,
                    url: uploadResult.url,
                    type: 'image',
                    size: uploadResult.size,
                    storage_path: uploadResult.path
                };

                const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/media_library`, {
                    method: 'POST',
                    headers: { 
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(mediaData)
                });

                if (dbResponse.ok) {
                    const sizeKB = (uploadResult.size / 1024).toFixed(0);
                    showAlert(`✅ Upload thành công: ${file.name} (${sizeKB}KB)`, 'success');
                } else {
                    showAlert(`⚠️ Ảnh đã upload nhưng lỗi lưu database`, 'warning');
                }
            } else {
                showAlert(`❌ ${uploadResult.error}`, 'danger');
            }

        } catch (error) {
            console.error('Upload error:', error);
            showAlert(`❌ Lỗi upload: ${file.name}`, 'danger');
        }
    }

    // Reload media library to show new uploads
    await loadMediaLibrary();
}

// Show storage statistics
async function showStorageStats() {
    if (!storageClient) return;
    
    try {
        const stats = await storageClient.getStorageStats();
        
        const statsHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">Storage Usage</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${stats.totalSizeMB} MB</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.875rem; opacity: 0.9;">Total Files</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${stats.totalFiles}</div>
                    </div>
                </div>
                <div style="
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid rgba(255,255,255,0.2);
                    font-size: 0.75rem;
                    opacity: 0.9;
                ">
                    <i class="fas fa-info-circle"></i> Free tier: 1GB storage limit
                </div>
            </div>
        `;
        
        const mediaLibrary = document.getElementById('mediaLibrary');
        if (mediaLibrary && !document.getElementById('storageStats')) {
            const statsDiv = document.createElement('div');
            statsDiv.id = 'storageStats';
            mediaLibrary.parentNode.insertBefore(statsDiv, mediaLibrary);
        }
        
        const statsContainer = document.getElementById('storageStats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHTML;
        }
        
    } catch (error) {
        console.error('Error loading storage stats:', error);
    }
}

// Storage stats are now integrated directly into loadMediaLibrary() function above

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initEditors();
    initLanguageTabs();
    showView('editor');
    
    // Show Phase 3 success message
    if (storageClient) {
        console.log('✅ FrameX News Management System initialized!');
        console.log('📝 Sử dụng editor như Microsoft Word để viết bài');
        console.log('🚀 Phase 3: Image Upload System - ACTIVE');
        console.log('📸 Supabase Storage - CONNECTED');
    } else {
        console.warn('⚠️ Storage client not loaded - upload features disabled');
    }
});
