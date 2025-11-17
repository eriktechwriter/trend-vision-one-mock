# Context Key Format Reference

## Overview

Context keys are the foundation of the agentic documentation system. They uniquely identify a user's current state and are used to look up appropriate help content.

## Format

```
{userType}:{page}:{section}
```

### Components

1. **userType** (required): The user's role
   - `admin` - Administrator with full system access
   - `analyst` - Security Analyst focused on threat investigation
   - `ciso` - CISO/Executive focused on risk and compliance
   - `viewer` - Report Viewer with read-only access

2. **page** (required): The current product page
   - `attack-surface` - Attack Surface Discovery page
   - `workbench` - Workbench (threat investigation) page
   - `endpoint-inventory` - Endpoint Inventory page
   - `home` - Landing/home page

3. **section** (optional): The current section, tab, or feature
   - Examples: `devices`, `alerts`, `compliance`, `risk-score`, etc.
   - Can be omitted for page-level help

## Examples

### Page-Level Context Keys

```
admin:attack-surface
analyst:workbench
ciso:endpoint-inventory
viewer:home
```

**Usage**: General help for the entire page, not specific to any section.

### Section-Level Context Keys

```
admin:attack-surface:devices
analyst:workbench:alerts
ciso:endpoint-inventory:compliance
viewer:attack-surface:risk-score
```

**Usage**: Specific help for a particular tab, panel, or feature on the page.

### Element-Level Context Keys (Future)

```
admin:attack-surface:devices:risk-filter
analyst:workbench:alerts:severity-dropdown
ciso:endpoint-inventory:compliance:export-button
```

**Usage**: Very specific help for individual UI elements (future enhancement).

## Content Lookup Strategy

When looking up content for a context key, the system uses a fallback strategy:

1. **Exact Match**: Try the full context key
   ```
   analyst:workbench:alerts
   ```

2. **Page-Level Fallback**: Try without section
   ```
   analyst:workbench
   ```

3. **Default User Fallback**: Try with default user type (admin)
   ```
   admin:workbench:alerts
   admin:workbench
   ```

4. **Page-Only Fallback**: Try page identifier only
   ```
   workbench
   ```

5. **Generic Fallback**: Use generic help content
   ```
   (Generated fallback content)
   ```

## Adding New Content

### Step 1: Determine Context Key

Identify the context for your new content:
- What user role needs this content?
- What page is it for?
- What section (if any)?

Example: Admin users need help with the "Data Sources" section on the Attack Surface Discovery page.

**Context Key**: `admin:attack-surface:data-sources`

### Step 2: Add to help-content.json

```json
{
  "admin:attack-surface:data-sources": {
    "title": "Data Sources Configuration",
    "badge": "AI",
    "sections": [
      {
        "type": "what-is",
        "title": "What is this?",
        "content": "Data sources provide visibility into your attack surface..."
      },
      {
        "type": "how-to",
        "title": "How to:",
        "items": [
          "Add a new data source",
          "Configure data source settings",
          "Troubleshoot connection issues"
        ]
      }
    ],
    "actions": [
      {
        "type": "chat",
        "label": "💬 Chat with Companion",
        "primary": true
      },
      {
        "type": "link",
        "label": "📖 Open Full Documentation",
        "url": "/agentic-docs-poc/docs/data-sources"
      }
    ],
    "metadata": {
      "sources": ["/docs/data-sources", "/docs/admin-guide"]
    }
  }
}
```

### Step 3: Test

1. Navigate to the page
2. Select the user type
3. Set the section (if applicable)
4. Open help panel
5. Verify content appears correctly

## Context Key Naming Conventions

### User Types

- Use lowercase
- Use single words or hyphens
- Be consistent across the application
- Examples: `admin`, `analyst`, `ciso`, `viewer`, `power-user`

### Pages

- Use lowercase
- Use hyphens for multi-word names
- Match the page filename (without .html)
- Examples: `attack-surface`, `workbench`, `endpoint-inventory`

### Sections

- Use lowercase
- Use hyphens for multi-word names
- Be descriptive but concise
- Match the section/tab identifier in the UI
- Examples: `devices`, `risk-score`, `data-sources`, `alert-details`

## Special Context Keys

### Wildcard Keys (Future)

```
*:attack-surface:devices
```
Matches any user type for the devices section.

```
admin:*:compliance
```
Matches admin user on any page viewing compliance section.

### Regex Keys (Future)

```
analyst:workbench:alert-.*
```
Matches any alert-related section for analysts on workbench.

## Context Key Validation

### Valid Context Keys

✅ `admin:attack-surface`  
✅ `analyst:workbench:alerts`  
✅ `ciso:endpoint-inventory:compliance-report`  
✅ `viewer:home`

### Invalid Context Keys

❌ `Admin:Attack-Surface` (uppercase not allowed)  
❌ `admin/attack-surface` (use colons, not slashes)  
❌ `admin:attack_surface` (use hyphens, not underscores)  
❌ `attack-surface` (missing user type)  
❌ `admin:` (incomplete key)

## Programmatic Usage

### JavaScript

```javascript
// Get current context key
const contextKey = contextEngine.getContextKey();
// Returns: "analyst:workbench:alerts"

// Parse context key
const [userType, page, section] = contextKey.split(':');
console.log(userType); // "analyst"
console.log(page);     // "workbench"
console.log(section);  // "alerts"

// Build context key
const key = `${userType}:${page}:${section}`;

// Load content for context key
const content = await contentGenerator.generateContent(contextKey);
```

### JSON Structure

```json
{
  "admin:attack-surface": { /* page-level content */ },
  "admin:attack-surface:devices": { /* section-level content */ },
  "analyst:attack-surface": { /* different user, same page */ },
  "analyst:attack-surface:devices": { /* different user, same section */ }
}
```

## Best Practices

### 1. Start Broad, Then Specific

Create page-level content first, then add section-specific content as needed.

```
✅ First:  admin:attack-surface
✅ Then:   admin:attack-surface:devices
✅ Then:   admin:attack-surface:data-sources
```

### 2. Reuse Common Content

If multiple user types need similar content, create a base version and reference it:

```json
{
  "attack-surface:devices": {
    "title": "Devices Overview",
    "content": "Common content for all users..."
  },
  "admin:attack-surface:devices": {
    "extends": "attack-surface:devices",
    "additionalContent": "Admin-specific content..."
  }
}
```

### 3. Use Descriptive Section Names

Section names should match the UI and be immediately recognizable:

```
✅ admin:attack-surface:devices
✅ admin:attack-surface:risk-score
❌ admin:attack-surface:tab1
❌ admin:attack-surface:panel-left
```

### 4. Document Your Context Keys

Maintain a list of all context keys in use:

```markdown
## Attack Surface Discovery
- admin:attack-surface
- admin:attack-surface:devices
- admin:attack-surface:accounts
- analyst:attack-surface
- analyst:attack-surface:devices
```

### 5. Test Fallback Behavior

Ensure content is available at multiple levels:

```
✅ admin:attack-surface:devices (most specific)
✅ admin:attack-surface (fallback)
✅ attack-surface (generic fallback)
```

## Troubleshooting

### Content Not Loading

**Problem**: Help panel shows "No content available"

**Solutions**:
1. Check context key format (lowercase, colons, no spaces)
2. Verify content exists in `help-content.json`
3. Check browser console for errors
4. Verify JSON syntax is valid

### Wrong Content Appearing

**Problem**: Content doesn't match current context

**Solutions**:
1. Check context engine is initialized
2. Verify user type is set correctly
3. Check page detection logic
4. Verify section is being set when expected

### Fallback Content Always Showing

**Problem**: Generic fallback content appears instead of specific content

**Solutions**:
1. Verify exact context key exists in JSON
2. Check for typos in context key
3. Ensure JSON file is loading correctly
4. Check fallback strategy is working as expected

## Future Enhancements

### Dynamic Context Keys

Generate context keys based on URL parameters:

```
admin:attack-surface:devices?filter=high-risk
analyst:workbench:alert-12345
```

### Context Key Aliases

Allow multiple keys to map to the same content:

```json
{
  "aliases": {
    "admin:asd": "admin:attack-surface",
    "admin:wb": "admin:workbench"
  }
}
```

### Context Key Inheritance

Define parent-child relationships:

```json
{
  "inheritance": {
    "admin:attack-surface:devices": {
      "inherits": ["admin:attack-surface", "attack-surface:devices"]
    }
  }
}
```

## Related Documentation

- [README.md](README.md) - Main documentation
- [DEMO-SCRIPT.md](DEMO-SCRIPT.md) - Demo walkthrough
- [help-content.json](assets/data/help-content.json) - Content definitions
- [context-engine.js](assets/js/context-engine.js) - Context detection code

---

**Last Updated**: November 2024  
**Version**: 1.0  
**Maintainer**: Erik (Technical Writer)
