/**
 * FrameX Authentication System
 * Quản lý đăng nhập, session, và bảo mật cho Admin Panel
 * Version: 1.0.0
 */

class AuthSystem {
    constructor() {
        // Session configuration
        this.SESSION_KEY = 'framex_admin_session';
        this.REMEMBER_KEY = 'framex_admin_remember';
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        this.REMEMBER_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
        
        // Default credentials (SHOULD BE CHANGED!)
        this.DEFAULT_CREDENTIALS = {
            username: 'admin',
            password: 'framex2024' // In production, use hashed passwords
        };
        
        // Activity tracking
        this.lastActivity = Date.now();
        this.activityCheckInterval = null;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize authentication system
     */
    init() {
        // Check for remembered login
        this.checkRememberedLogin();
        
        // Start activity monitoring if logged in
        if (this.isAuthenticated()) {
            this.startActivityMonitoring();
        }
        
        // NOTE: beforeunload removed to prevent auto-logout during navigation
        // Session will naturally expire after 30 minutes of inactivity
        // This is more user-friendly than force logout on page reload
        
        // Update activity on user interaction
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                this.updateActivity();
            }, { passive: true });
        });
    }

    /**
     * Login with username and password
     */
    async login(username, password, rememberMe = false) {
        try {
            // Validate credentials
            if (this.validateCredentials(username, password)) {
                const sessionData = {
                    username: username,
                    loginTime: Date.now(),
                    lastActivity: Date.now(),
                    isAdmin: true
                };
                
                // Store session
                sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                
                // Remember me functionality
                if (rememberMe) {
                    const rememberData = {
                        username: username,
                        token: this.generateToken(),
                        expiry: Date.now() + this.REMEMBER_DURATION
                    };
                    localStorage.setItem(this.REMEMBER_KEY, JSON.stringify(rememberData));
                }
                
                // Start activity monitoring
                this.startActivityMonitoring();
                
                // Log successful login
                this.logActivity('login', { username });
                
                return {
                    success: true,
                    message: 'Đăng nhập thành công'
                };
            } else {
                // Log failed attempt
                this.logActivity('login_failed', { username });
                
                return {
                    success: false,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Lỗi đăng nhập. Vui lòng thử lại.'
            };
        }
    }

    /**
     * Validate user credentials
     */
    validateCredentials(username, password) {
        // In production, this should validate against a secure backend
        // For now, we use default credentials
        return username === this.DEFAULT_CREDENTIALS.username &&
               password === this.DEFAULT_CREDENTIALS.password;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const sessionData = this.getSessionData();
        
        if (!sessionData) {
            return false;
        }
        
        // Check session timeout
        const now = Date.now();
        const timeSinceActivity = now - sessionData.lastActivity;
        
        if (timeSinceActivity > this.SESSION_TIMEOUT) {
            this.logout(false);
            return false;
        }
        
        return true;
    }

    /**
     * Get current session data
     */
    getSessionData() {
        try {
            const data = sessionStorage.getItem(this.SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting session data:', error);
            return null;
        }
    }

    /**
     * Update last activity timestamp
     */
    updateActivity() {
        if (!this.isAuthenticated()) return;
        
        const sessionData = this.getSessionData();
        if (sessionData) {
            sessionData.lastActivity = Date.now();
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            this.lastActivity = Date.now();
        }
    }

    /**
     * Start activity monitoring
     */
    startActivityMonitoring() {
        if (this.activityCheckInterval) {
            clearInterval(this.activityCheckInterval);
        }
        
        // Check every minute
        this.activityCheckInterval = setInterval(() => {
            if (!this.isAuthenticated()) {
                this.handleSessionTimeout();
            }
        }, 60000);
    }

    /**
     * Handle session timeout
     */
    handleSessionTimeout() {
        clearInterval(this.activityCheckInterval);
        
        alert('Phiên làm việc đã hết hạn do không có hoạt động. Vui lòng đăng nhập lại.');
        window.location.href = 'admin-login.html';
    }

    /**
     * Check for remembered login
     */
    checkRememberedLogin() {
        try {
            const rememberData = localStorage.getItem(this.REMEMBER_KEY);
            if (!rememberData) return;
            
            const data = JSON.parse(rememberData);
            const now = Date.now();
            
            // Check if remember token is still valid
            if (data.expiry > now) {
                // Auto-login
                const sessionData = {
                    username: data.username,
                    loginTime: now,
                    lastActivity: now,
                    isAdmin: true,
                    remembered: true
                };
                
                sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            } else {
                // Token expired, remove it
                localStorage.removeItem(this.REMEMBER_KEY);
            }
        } catch (error) {
            console.error('Error checking remembered login:', error);
            localStorage.removeItem(this.REMEMBER_KEY);
        }
    }

    /**
     * Check if user has remember me enabled
     */
    isRemembered() {
        return localStorage.getItem(this.REMEMBER_KEY) !== null;
    }

    /**
     * Logout user
     */
    logout(redirect = true) {
        // Clear session
        sessionStorage.removeItem(this.SESSION_KEY);
        
        // FIXED: Always clear remember token on logout to prevent auto-login loop
        localStorage.removeItem(this.REMEMBER_KEY);
        
        // Stop activity monitoring
        if (this.activityCheckInterval) {
            clearInterval(this.activityCheckInterval);
        }
        
        // Log activity
        this.logActivity('logout');
        
        // Redirect to login
        if (redirect) {
            window.location.href = 'admin-login.html';
        }
    }

    /**
     * Force logout and clear all data
     */
    forceLogout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.REMEMBER_KEY);
        
        if (this.activityCheckInterval) {
            clearInterval(this.activityCheckInterval);
        }
        
        window.location.href = 'admin-login.html';
    }

    /**
     * Get current user info
     */
    getCurrentUser() {
        const sessionData = this.getSessionData();
        return sessionData ? {
            username: sessionData.username,
            loginTime: sessionData.loginTime,
            isAdmin: sessionData.isAdmin
        } : null;
    }

    /**
     * Generate random token
     */
    generateToken() {
        return Math.random().toString(36).substring(2) + 
               Date.now().toString(36) +
               Math.random().toString(36).substring(2);
    }

    /**
     * Log user activity for security audit
     */
    logActivity(action, data = {}) {
        const log = {
            timestamp: new Date().toISOString(),
            action: action,
            username: this.getCurrentUser()?.username || 'unknown',
            ...data
        };
        
        // Store in localStorage (limited history)
        const logs = this.getActivityLogs();
        logs.unshift(log);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(100);
        }
        
        localStorage.setItem('framex_activity_logs', JSON.stringify(logs));
    }

    /**
     * Get activity logs
     */
    getActivityLogs() {
        try {
            const logs = localStorage.getItem('framex_activity_logs');
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Check HTTPS connection
     */
    isSecureConnection() {
        return window.location.protocol === 'https:' || 
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    }

    /**
     * Get security recommendations
     */
    getSecurityRecommendations() {
        const recommendations = [];
        
        if (!this.isSecureConnection()) {
            recommendations.push({
                level: 'critical',
                message: 'Bật HTTPS để bảo vệ mật khẩu và dữ liệu',
                icon: 'fa-exclamation-triangle'
            });
        }
        
        if (this.DEFAULT_CREDENTIALS.password === 'framex2024') {
            recommendations.push({
                level: 'high',
                message: 'Đổi mật khẩu mặc định ngay lập tức',
                icon: 'fa-key'
            });
        }
        
        recommendations.push({
            level: 'medium',
            message: 'Backup database định kỳ (mỗi tuần)',
            icon: 'fa-database'
        });
        
        recommendations.push({
            level: 'low',
            message: 'Kiểm tra activity logs thường xuyên',
            icon: 'fa-history'
        });
        
        return recommendations;
    }

    /**
     * Change password (placeholder for future implementation)
     */
    changePassword(currentPassword, newPassword) {
        // In production, this should send to backend API
        // For now, return error message
        return {
            success: false,
            message: 'Tính năng đổi mật khẩu cần kết nối với backend. Vui lòng liên hệ quản trị viên.'
        };
    }
}

// Create global Auth instance
const Auth = new AuthSystem();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
