# Testing Guide: Agentic Docs POC Mock Website

This guide explains how to test and validate the mock website.

## Quick Start

### Option 1: Browser-Based Testing (Recommended)

1. Start a local web server:
   ```bash
   cd mock-site
   python3 -m http.server 8000
   ```

2. Open your browser and navigate to:
   - **Comprehensive Test Suite:** http://localhost:8000/comprehensive-test.html
   - **Page Validation:** http://localhost:8000/validate-pages.html
   - **Accessibility Check:** http://localhost:8000/accessibility-check.html

3. Click "Run All Tests" or "Run Tests" button

### Option 2: Command-Line Testing

Run the HTML validator:
```bash
cd mock-site
node validate-html.js
```

## Testing Tools

### 1. comprehensive-test.html
**Purpose:** Complete automated testing suite  
**What it tests:**
- Page existence and accessibility
- JavaScript module loading and syntax
- CSS file loading
- JSON data validity
- Browser feature support (localStorage, Fetch API, etc.)
- HTML structure (DOCTYPE, meta tags, lang attribute)
- Accessibility (images, headings, buttons, links)
- Keyboard navigation (focusable elements, tab order)
- Responsive design (viewport detection)
- Performance (page load times)

**How to use:**
1. Open http://localhost:8000/comprehensive-test.html
2. Click "▶️ Run All Tests"
3. Review results (green = pass, red = fail, yellow = warning)
4. Click "📥 Export Results" to save as JSON

**Expected results:** All tests should pass with 0 failures

### 2. validate-pages.html
**Purpose:** Quick validation of pages and resources  
**What it tests:**
- Page existence (index, attack-surface, workbench, endpoint-inventory)
- JavaScript module availability
- CSS file availability
- JSON data file validity
- Browser storage functionality
- DOM structure

**How to use:**
1. Open http://localhost:8000/validate-pages.html
2. Click "Run All Tests"
3. Review results

**Expected results:** All pages and resources should be accessible

### 3. accessibility-check.html
**Purpose:** Dedicated accessibility testing  
**What it tests:**
- HTML lang attribute
- Page title
- Viewport meta tag
- Image alt text
- Heading hierarchy (h1-h6)
- Skip links
- Button labels
- Link labels
- Form input labels
- ARIA landmarks
- Keyboard navigation
- Tab order (no positive tabindex)
- Color contrast guidance

**How to use:**
1. Open http://localhost:8000/accessibility-check.html
2. Click "Run Tests"
3. Review results
4. Follow manual testing recommendations

**Expected results:** All automated checks should pass

### 4. validate-html.js
**Purpose:** Automated HTML validation via Node.js  
**What it tests:**
- DOCTYPE declaration
- HTML lang attribute
- Charset meta tag (UTF-8)
- Viewport meta tag
- Page title
- Tag closure (basic check)
- Script tags
- Image alt attributes
- Button labels
- Link labels

**How to use:**
```bash
cd mock-site
node validate-html.js
```

**Expected results:**
```
✅ index.html: No issues found
✅ attack-surface.html: No issues found (minor warnings OK)
✅ workbench.html: No issues found (minor warnings OK)
✅ endpoint-inventory.html: No issues found (minor warnings OK)

📊 Summary:
   Total Issues: 0
   Total Warnings: 6 (self-closing tags - valid HTML5)
```

## Manual Testing Checklist

### Navigation Testing
- [ ] Click each link in the side navigation
- [ ] Verify active page is highlighted
- [ ] Use browser back/forward buttons
- [ ] Check that URLs update correctly

### User Type Selector Testing
- [ ] Click the user type dropdown in the header
- [ ] Select each user type (Admin, Analyst, CISO, Viewer)
- [ ] Verify the header shows the current user type
- [ ] Open help panel and verify content changes
- [ ] Refresh page and verify user type persists

### Help Panel Testing
- [ ] Click the ❓ help button in the header
- [ ] Verify panel slides in from the right
- [ ] Scroll through the content
- [ ] Click links to verify they work
- [ ] Click the X button to close
- [ ] Open again and press ESC key to close
- [ ] Switch user types and verify content changes
- [ ] Navigate to different pages and verify content changes

### Tooltip Testing
- [ ] Hover over help icons (❓) on tabs
- [ ] Verify tooltip appears near the icon
- [ ] Click outside to close
- [ ] Press ESC key to close
- [ ] Switch user types and verify content changes
- [ ] Check tooltips on different pages

### Keyboard Navigation Testing
- [ ] Press Tab key repeatedly
- [ ] Verify focus moves through interactive elements
- [ ] Verify focus indicators are visible (blue outline)
- [ ] Press Enter on buttons and links
- [ ] Press ESC to close panels and tooltips
- [ ] Verify no keyboard traps

### Responsive Design Testing
- [ ] Resize browser window to different widths
- [ ] Test at 1920px (desktop)
- [ ] Test at 1366px (laptop)
- [ ] Test at 768px (tablet)
- [ ] Test at 375px (mobile)
- [ ] Verify layout adapts appropriately
- [ ] Check that tables scroll horizontally if needed

### Browser Console Testing
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors (should be 0)
- [ ] Check Network tab for 404 errors (should be 0)
- [ ] Navigate between pages and check for errors
- [ ] Interact with features and check for errors

### Performance Testing
- [ ] Open DevTools Network tab
- [ ] Reload page and check load time (should be < 2 seconds)
- [ ] Check total page size (should be < 100KB)
- [ ] Open help panel and check content load time (should be < 1 second)
- [ ] Switch user types and check response time (should be instant)

## Automated Testing with Scripts

### Run All JavaScript Syntax Checks
```bash
cd mock-site/assets/js
node -c context-engine.js && echo "✅ context-engine.js"
node -c help-panel.js && echo "✅ help-panel.js"
node -c tooltip.js && echo "✅ tooltip.js"
node -c user-selector.js && echo "✅ user-selector.js"
node -c navigation.js && echo "✅ navigation.js"
node -c content-generator.js && echo "✅ content-generator.js"
```

### Validate JSON Data Files
```bash
cd mock-site/assets/data
node -e "JSON.parse(require('fs').readFileSync('help-content.json', 'utf8')); console.log('✅ help-content.json')"
node -e "JSON.parse(require('fs').readFileSync('tooltip-content.json', 'utf8')); console.log('✅ tooltip-content.json')"
```

### Check File Existence
```bash
cd mock-site
ls -la index.html attack-surface.html workbench.html endpoint-inventory.html
ls -la assets/css/*.css
ls -la assets/js/*.js
ls -la assets/data/*.json
```

## Troubleshooting

### Issue: Tests fail to load resources
**Solution:** Make sure you're running a local web server (python3 -m http.server 8000) and accessing via http://localhost:8000

### Issue: localStorage tests fail
**Solution:** Some browsers block localStorage in file:// protocol. Use http://localhost instead.

### Issue: CORS errors in console
**Solution:** Use a local web server instead of opening HTML files directly.

### Issue: Tests show warnings about self-closing tags
**Solution:** This is expected. HTML5 allows self-closing tags like `<meta>` and `<link>`. These warnings can be ignored.

### Issue: Performance tests show slow load times
**Solution:** 
- Check your network connection
- Clear browser cache
- Close other browser tabs
- Restart the local web server

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Mock Website

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Validate HTML
        run: |
          cd mock-site
          node validate-html.js
      
      - name: Validate JavaScript
        run: |
          cd mock-site/assets/js
          node -c context-engine.js
          node -c help-panel.js
          node -c tooltip.js
          node -c user-selector.js
          node -c navigation.js
          node -c content-generator.js
      
      - name: Validate JSON
        run: |
          cd mock-site/assets/data
          node -e "JSON.parse(require('fs').readFileSync('help-content.json', 'utf8'))"
          node -e "JSON.parse(require('fs').readFileSync('tooltip-content.json', 'utf8'))"
```

## Best Practices

### Before Committing Code
1. Run `node validate-html.js`
2. Check browser console for errors
3. Test keyboard navigation
4. Verify responsive design

### Before Deploying
1. Run all automated tests
2. Perform manual testing checklist
3. Test on multiple browsers
4. Check accessibility with browser DevTools
5. Verify performance metrics

### After Deployment
1. Test on production URL
2. Verify all assets load correctly
3. Check for console errors
4. Test on actual mobile devices
5. Run accessibility audit with WAVE or axe DevTools

## Additional Resources

### Accessibility Testing Tools
- **WAVE:** https://wave.webaim.org/
- **axe DevTools:** Browser extension for Chrome/Firefox
- **Lighthouse:** Built into Chrome DevTools
- **NVDA:** Free screen reader for Windows
- **VoiceOver:** Built-in screen reader for macOS

### Performance Testing Tools
- **Lighthouse:** Chrome DevTools > Lighthouse tab
- **WebPageTest:** https://www.webpagetest.org/
- **GTmetrix:** https://gtmetrix.com/

### HTML/CSS Validation
- **W3C HTML Validator:** https://validator.w3.org/
- **W3C CSS Validator:** https://jigsaw.w3.org/css-validator/

### Browser Testing
- **BrowserStack:** https://www.browserstack.com/
- **LambdaTest:** https://www.lambdatest.com/

## Support

For issues or questions:
1. Check the TEST-REPORT.md for known issues
2. Review the POLISH-CHECKLIST.md for testing status
3. Check browser console for error messages
4. Verify you're using a supported browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

---

**Last Updated:** 2025-01-13  
**Version:** 1.0
