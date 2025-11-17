#!/usr/bin/env node

/**
 * HTML Validation Script
 * Checks all HTML files for common issues
 */

const fs = require('fs');
const path = require('path');

const pages = [
    'index.html',
    'attack-surface.html',
    'workbench.html',
    'endpoint-inventory.html'
];

let totalIssues = 0;
let totalWarnings = 0;

console.log('🔍 HTML Validation Starting...\n');

pages.forEach(page => {
    console.log(`\n📄 Checking ${page}...`);
    
    try {
        const content = fs.readFileSync(page, 'utf8');
        let issues = [];
        let warnings = [];
        
        // Check 1: DOCTYPE
        if (!content.trim().startsWith('<!DOCTYPE html>')) {
            issues.push('Missing or incorrect DOCTYPE declaration');
        }
        
        // Check 2: HTML lang attribute
        if (!/<html[^>]+lang=["'][^"']+["']/.test(content)) {
            issues.push('Missing lang attribute on <html> tag');
        }
        
        // Check 3: Charset
        if (!/<meta[^>]+charset=["']UTF-8["']/.test(content)) {
            warnings.push('Missing or incorrect charset meta tag');
        }
        
        // Check 4: Viewport
        if (!/<meta[^>]+name=["']viewport["']/.test(content)) {
            warnings.push('Missing viewport meta tag');
        }
        
        // Check 5: Title
        if (!/<title>[^<]+<\/title>/.test(content)) {
            issues.push('Missing or empty <title> tag');
        }
        
        // Check 6: Unclosed tags (basic check)
        const openTags = (content.match(/<(?!\/|!)[a-z][^>]*>/gi) || []).length;
        const closeTags = (content.match(/<\/[a-z][^>]*>/gi) || []).length;
        if (Math.abs(openTags - closeTags) > 5) {
            warnings.push(`Possible unclosed tags (${openTags} open, ${closeTags} close)`);
        }
        
        // Check 7: Script tags
        const scriptTags = content.match(/<script[^>]*>/gi) || [];
        scriptTags.forEach(tag => {
            if (!tag.includes('src=') && !tag.includes('</script>')) {
                warnings.push('Inline script without closing tag');
            }
        });
        
        // Check 8: Images without alt
        const imgTags = content.match(/<img[^>]*>/gi) || [];
        let imgsWithoutAlt = 0;
        imgTags.forEach(tag => {
            if (!tag.includes('alt=')) {
                imgsWithoutAlt++;
            }
        });
        if (imgsWithoutAlt > 0) {
            warnings.push(`${imgsWithoutAlt} image(s) without alt attribute`);
        }
        
        // Check 9: Buttons without text or aria-label
        const buttonTags = content.match(/<button[^>]*>.*?<\/button>/gi) || [];
        let buttonsWithoutLabel = 0;
        buttonTags.forEach(tag => {
            const hasText = /<button[^>]*>([^<]+)<\/button>/.test(tag);
            const hasAriaLabel = /aria-label=/.test(tag);
            if (!hasText && !hasAriaLabel) {
                buttonsWithoutLabel++;
            }
        });
        if (buttonsWithoutLabel > 0) {
            warnings.push(`${buttonsWithoutLabel} button(s) without text or aria-label`);
        }
        
        // Check 10: Links without text or aria-label
        const linkTags = content.match(/<a[^>]*>.*?<\/a>/gi) || [];
        let linksWithoutLabel = 0;
        linkTags.forEach(tag => {
            const hasText = /<a[^>]*>([^<]+)<\/a>/.test(tag);
            const hasAriaLabel = /aria-label=/.test(tag);
            if (!hasText && !hasAriaLabel) {
                linksWithoutLabel++;
            }
        });
        if (linksWithoutLabel > 0) {
            warnings.push(`${linksWithoutLabel} link(s) without text or aria-label`);
        }
        
        // Report results
        if (issues.length === 0 && warnings.length === 0) {
            console.log('  ✅ No issues found');
        } else {
            if (issues.length > 0) {
                console.log('  ❌ Issues:');
                issues.forEach(issue => console.log(`     - ${issue}`));
                totalIssues += issues.length;
            }
            if (warnings.length > 0) {
                console.log('  ⚠️  Warnings:');
                warnings.forEach(warning => console.log(`     - ${warning}`));
                totalWarnings += warnings.length;
            }
        }
        
    } catch (error) {
        console.log(`  ❌ Error reading file: ${error.message}`);
        totalIssues++;
    }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`   Total Issues: ${totalIssues}`);
console.log(`   Total Warnings: ${totalWarnings}`);

if (totalIssues === 0 && totalWarnings === 0) {
    console.log('\n✅ All HTML files validated successfully!');
    process.exit(0);
} else if (totalIssues === 0) {
    console.log('\n⚠️  Validation complete with warnings.');
    process.exit(0);
} else {
    console.log('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
}
