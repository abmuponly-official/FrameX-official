// FrameX News Loader
// Dynamically load news articles from database

class NewsLoader {
    constructor(lang = 'vi') {
        this.lang = lang;
        this.articles = [];
        this.currentCategory = 'all';
        this.displayLimit = 4; // Giới hạn hiển thị ban đầu
        this.currentDisplayCount = 4; // Số bài đang hiển thị
    }

    async loadArticles() {
        const startTime = performance.now();
        console.log('⏳ Loading articles from Supabase...');
        
        try {
            // Supabase Configuration
            const SUPABASE_URL = 'https://lyctpwhdskgkqebzreib.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Y3Rwd2hkc2tna3FlYnpyZWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNjMyMzksImV4cCI6MjA3NTkzOTIzOX0.vQE07u5WYJIf8R5XqBfcEAcxygnRzy0n2_NetC9IhMk';
            
            // Supabase REST API endpoint - chỉ lấy fields cần thiết để tăng tốc độ
            const apiPath = `${SUPABASE_URL}/rest/v1/news_articles?select=id,title_vi,title_en,excerpt_vi,excerpt_en,category,category_vi,category_en,slug_vi,slug_en,featured_image,author,read_time,published_date,status&status=eq.published&order=published_date.desc&limit=100`;
            
            const response = await fetch(apiPath, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ Loaded ${data.length} articles in ${loadTime}s`);
            console.log('📰 Supabase news data:', data);
            
            if (data && Array.isArray(data)) {
                // Supabase returns array directly, already filtered by status=published
                this.articles = data.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
                console.log(`📊 Total articles with status=published: ${this.articles.length}`);
                
                this.renderArticles();
                this.initCategoryFilter();
            } else {
                console.error('❌ Invalid data format from Supabase:', data);
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showError();
        }
    }

    renderArticles() {
        const grid = document.querySelector('.news-grid');
        if (!grid) return;

        const filteredArticles = this.currentCategory === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.category === this.currentCategory);

        if (filteredArticles.length === 0) {
            const emptyMessage = this.lang === 'vi' 
                ? 'Không có bài viết nào trong danh mục này.'
                : 'No articles in this category.';
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6c757d;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>${emptyMessage}</p>
                </div>
            `;
            return;
        }

        // Giới hạn số bài hiển thị
        const displayArticles = filteredArticles.slice(0, this.currentDisplayCount);
        const hasMore = filteredArticles.length > this.currentDisplayCount;
        
        console.log('🎨 Rendering articles:', displayArticles.length);

        const articlesHTML = displayArticles.map(article => {
            const title = this.lang === 'vi' ? article.title_vi : article.title_en;
            const excerpt = this.lang === 'vi' ? article.excerpt_vi : article.excerpt_en;
            const categoryLabel = this.lang === 'vi' ? article.category_vi : article.category_en;
            const slug = this.lang === 'vi' ? article.slug_vi : article.slug_en;
            
            // Article view URL - adjust for language folder
            const articleViewUrl = this.lang === 'vi' 
                ? `article-view.html?id=${article.id}`
                : `article-view.html?id=${article.id}`;
            
            const date = new Date(article.published_date);
            const formattedDate = this.lang === 'vi' 
                ? date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
                : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            const readTimeLabel = this.lang === 'vi' ? 'phút đọc' : 'min read';

            // Featured image or icon - với fallback nếu ảnh lỗi
            const fallbackIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>`;
            const imageHTML = article.featured_image 
                ? `<img src="${article.featured_image}" alt="${title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='${fallbackIcon}'">`
                : fallbackIcon;

            return `
                <article class="news-card" data-category="${article.category}">
                    <div class="news-card__image">
                        ${imageHTML}
                    </div>
                    <div class="news-card__content">
                        <h3 class="news-card__title">
                            <a href="${articleViewUrl}">${title}</a>
                        </h3>
                        <p class="news-card__excerpt">
                            ${excerpt}
                        </p>
                        <div class="news-card__meta">
                            <span class="news-card__date">${formattedDate}</span>
                            <span class="news-card__read-time">${article.read_time} ${readTimeLabel}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
        
        console.log('📝 Articles HTML length:', articlesHTML.length, 'characters');

        grid.innerHTML = articlesHTML;
        
        console.log('✅ Articles rendered to DOM');

        // Thêm nút "Xem thêm" nếu còn bài viết
        this.renderLoadMoreButton(hasMore, filteredArticles.length);
    }

    renderLoadMoreButton(hasMore, totalCount) {
        // Tìm hoặc tạo container cho nút "Xem thêm"
        let loadMoreContainer = document.querySelector('.load-more-container');
        
        if (!loadMoreContainer) {
            loadMoreContainer = document.createElement('div');
            loadMoreContainer.className = 'load-more-container';
            loadMoreContainer.style.cssText = 'text-align: center; margin-top: 2rem; grid-column: 1 / -1;';
            document.querySelector('.news-grid').parentElement.appendChild(loadMoreContainer);
        }

        if (hasMore) {
            const remainingCount = totalCount - this.currentDisplayCount;
            const buttonText = this.lang === 'vi' 
                ? `Xem thêm (${remainingCount} bài)` 
                : `Load More (${remainingCount} articles)`;
            
            loadMoreContainer.innerHTML = `
                <button class="load-more-btn" style="
                    padding: 0.8rem 2rem;
                    background: #FF6B35;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
                " onmouseover="this.style.background='#E55A25'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(255, 107, 53, 0.3)';" 
                   onmouseout="this.style.background='#FF6B35'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(255, 107, 53, 0.2)';">
                    ${buttonText}
                </button>
            `;

            // Thêm event listener cho nút
            loadMoreContainer.querySelector('.load-more-btn').addEventListener('click', () => {
                this.loadMore();
            });
        } else {
            loadMoreContainer.innerHTML = '';
        }
    }

    loadMore() {
        // Tăng số bài hiển thị thêm 4
        this.currentDisplayCount += 4;
        this.renderArticles();
    }

    initCategoryFilter() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter articles
                this.currentCategory = btn.dataset.category;
                
                // Reset display count khi chuyển category
                this.currentDisplayCount = 4;
                
                this.renderArticles();
            });
        });
    }

    showError() {
        const grid = document.querySelector('.news-grid');
        if (grid) {
            const errorMessage = this.lang === 'vi'
                ? 'Không thể tải bài viết. Vui lòng thử lại sau.'
                : 'Unable to load articles. Please try again later.';
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #dc3545;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>${errorMessage}</p>
                </div>
            `;
        }
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Detect language from URL
    const isEnglish = window.location.pathname.includes('/en/');
    const lang = isEnglish ? 'en' : 'vi';
    
    // Initialize loader
    const loader = new NewsLoader(lang);
    loader.loadArticles();
});
