// ===================================================
// FRAMEX SUPABASE STORAGE MODULE
// Phase 3: Image Upload System
// ===================================================

class SupabaseStorageClient {
    constructor(supabaseUrl, supabaseKey) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.bucketName = 'news-images';
        this.storageUrl = `${supabaseUrl}/storage/v1`;
    }

    /**
     * Upload file to Supabase Storage
     * @param {File} file - The file to upload
     * @param {string} folder - Optional folder path (default: 'uploads')
     * @returns {Promise<Object>} - {success, url, error}
     */
    async uploadFile(file, folder = 'uploads') {
        try {
            // Validate file
            const validation = this.validateFile(file);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // Generate unique filename
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop();
            const safeFileName = this.sanitizeFileName(file.name.split('.')[0]);
            const uniqueFileName = `${safeFileName}_${timestamp}_${randomStr}.${extension}`;
            const filePath = `${folder}/${uniqueFileName}`;

            // Show upload progress
            const uploadProgress = this.createProgressIndicator(file.name);

            // Upload to Supabase Storage
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(
                `${this.storageUrl}/object/${this.bucketName}/${filePath}`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    },
                    body: file
                }
            );

            uploadProgress.remove();

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            // Get public URL
            const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${filePath}`;

            return {
                success: true,
                url: publicUrl,
                path: filePath,
                filename: uniqueFileName,
                size: file.size,
                type: file.type
            };

        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                error: error.message || 'Upload failed'
            };
        }
    }

    /**
     * Upload multiple files
     * @param {FileList} files - Files to upload
     * @param {string} folder - Optional folder path
     * @returns {Promise<Array>} - Array of upload results
     */
    async uploadMultiple(files, folder = 'uploads') {
        const results = [];
        for (const file of files) {
            const result = await this.uploadFile(file, folder);
            results.push(result);
        }
        return results;
    }

    /**
     * Delete file from Supabase Storage
     * @param {string} filePath - Path to file in storage
     * @returns {Promise<Object>} - {success, error}
     */
    async deleteFile(filePath) {
        try {
            const response = await fetch(
                `${this.storageUrl}/object/${this.bucketName}/${filePath}`,
                {
                    method: 'DELETE',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            return { success: true };
        } catch (error) {
            console.error('Delete error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * List files in storage bucket
     * @param {string} folder - Folder path
     * @returns {Promise<Array>} - List of files
     */
    async listFiles(folder = '') {
        try {
            const response = await fetch(
                `${this.storageUrl}/object/list/${this.bucketName}?prefix=${folder}`,
                {
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('List files failed');
            }

            const files = await response.json();
            return files;
        } catch (error) {
            console.error('List files error:', error);
            return [];
        }
    }

    /**
     * Validate file before upload
     * @param {File} file - File to validate
     * @returns {Object} - {valid, error}
     */
    validateFile(file) {
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Giới hạn: 10MB`
            };
        }

        // Check file type
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif'
        ];

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Định dạng không hỗ trợ: ${file.type}. Chỉ chấp nhận: JPG, PNG, WebP, GIF`
            };
        }

        return { valid: true };
    }

    /**
     * Sanitize filename - remove special characters
     * @param {string} filename - Original filename
     * @returns {string} - Sanitized filename
     */
    sanitizeFileName(filename) {
        return filename
            .toLowerCase()
            .replace(/[àáảãạăằắẳẵặâầấẩẫậ]/g, 'a')
            .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
            .replace(/[ìíỉĩị]/g, 'i')
            .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
            .replace(/[ùúủũụưừứửữự]/g, 'u')
            .replace(/[ỳýỷỹỵ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Create visual progress indicator
     * @param {string} filename - Name of file being uploaded
     * @returns {HTMLElement} - Progress element
     */
    createProgressIndicator(filename) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'upload-progress';
        progressDiv.innerHTML = `
            <div style="
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
            ">
                <div class="spinner" style="width: 24px; height: 24px; border-width: 3px;"></div>
                <div>
                    <div style="font-weight: 600; color: #2c3e50;">Đang upload...</div>
                    <div style="font-size: 0.875rem; color: #6c757d;">${filename}</div>
                </div>
            </div>
        `;
        document.body.appendChild(progressDiv);
        return progressDiv;
    }

    /**
     * Resize image before upload (client-side optimization)
     * @param {File} file - Image file
     * @param {number} maxWidth - Maximum width
     * @param {number} maxHeight - Maximum height
     * @returns {Promise<File>} - Resized image file
     */
    async resizeImage(file, maxWidth = 1200, maxHeight = 800) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(resizedFile);
                    }, file.type, 0.85); // 85% quality
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get storage usage stats
     * @returns {Promise<Object>} - Storage statistics
     */
    async getStorageStats() {
        try {
            const files = await this.listFiles();
            const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
            const totalFiles = files.length;

            return {
                totalFiles,
                totalSize,
                totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
                files
            };
        } catch (error) {
            console.error('Get storage stats error:', error);
            return { totalFiles: 0, totalSize: 0, totalSizeMB: '0.00', files: [] };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseStorageClient;
}
