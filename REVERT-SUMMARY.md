# Revert Summary - Back to PR#8

## Action Taken
Reverted main branch from PR#10 back to PR#8 state.

## Reason
User reported display issues with news pages after PR#9 and PR#10 merges.

## Current State (PR#8)

### ✅ What's Included:
- **Security**: SHA-256 password hashing (auth.js)
- **Performance**: .htaccess with browser caching and Gzip compression
- **Files**: Using non-minified versions (style.css, news.css, main.js, news-loader.js)

### ❌ What's Reverted (PR#9 & PR#10):
- Minified CSS/JS usage in HTML files
- QA-QC cleanup (removed documentation files)
- News loader minification fixes

## Files Status

### tin-tuc.html (Vietnamese News)
```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/news.css">
<script src="js/main.js"></script>
<script src="js/news-loader.js"></script>
```

### en/news.html (English News)
```html
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/news.css">
<script src="../js/main.js"></script>
<script src="../js/news-loader.js"></script>
```

## Test Results (After Revert)

### Vietnamese News Page (/tin-tuc.html)
- ✅ Loaded 6 articles in 0.53s
- ✅ Rendered 4 articles successfully
- ✅ No JavaScript errors
- ✅ Page title: "Tin Tức - FrameX"

### English News Page (/en/news.html)
- ✅ Loaded 6 articles in 0.26s
- ✅ Rendered 4 articles successfully
- ✅ No JavaScript errors
- ✅ Page title: "News - FrameX"

## Git History
```
Current HEAD: 3b012d5 (PR#8 merge)
Reverted from: ef8ac6f (PR#10 merge)
```

## Next Steps
Website is now at PR#8 stable state. User should:
1. Test the news pages on production
2. Report if issues persist
3. Identify specific display problem for targeted fix

---
**Reverted by**: AI Assistant
**Date**: 2025-10-22
**Method**: `git reset --hard 3b012d5 && git push --force`
