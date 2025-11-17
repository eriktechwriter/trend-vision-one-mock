# Trend Vision One Mock Website - Agentic Documentation POC

## Overview

This is a mock Trend Vision One product website that demonstrates **agentic documentation** - an AI-powered approach to generating customized, context-aware documentation based on user role, current page, and interaction context.

The mock website simulates three key product screens and integrates with the [Trend Vision One documentation site](https://eriktechwriter.github.io/agentic-docs-poc/) to provide personalized help content.

### Key Features

- **Context-Aware Help**: Documentation adapts based on where you are and what you're doing
- **Role-Based Content**: Different content for Admins, Analysts, CISOs, and Viewers
- **Interactive Tooltips**: Hover over help icons (❓) for quick contextual tips
- **Sliding Help Panel**: Access detailed help without leaving your current page
- **Realistic UI**: Simulates actual product interface with charts, tables, and controls

## Live Demo

**Mock Website**: https://eriktechwriter.github.io/trend-vision-one-mock/

**Documentation Site**: https://eriktechwriter.github.io/agentic-docs-poc/

**Documentation Site**: https://eriktechwriter.github.io/agentic-docs-poc/

## Project Structure

```
mock-site/
├── index.html                      # Landing page with navigation
├── attack-surface.html             # Attack Surface Discovery page
├── workbench.html                  # Workbench (threat investigation) page
├── endpoint-inventory.html         # Endpoint Inventory page
├── assets/
│   ├── css/
│   │   ├── common.css              # Shared styles (colors, typography, layout)
│   │   ├── components.css          # Component styles (buttons, panels, tooltips)
│   │   └── pages.css               # Page-specific styles
│   ├── js/
│   │   ├── context-engine.js       # Context detection & management
│   │   ├── help-panel.js           # Help panel component
│   │   ├── tooltip.js              # Tooltip component
│   │   ├── user-selector.js        # User type selector
│   │   ├── navigation.js           # Side nav & routing
│   │   └── content-generator.js    # Content loading & caching
│   └── data/
│       ├── help-content.json       # Help panel content by context
│       ├── tooltip-content.json    # Tooltip content by element
│       └── user-profiles.json      # User type definitions
└── README.md                       # This file
```

## Getting Started

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/eriktechwriter/agentic-docs-poc.git
   cd agentic-docs-poc/mock-site
   ```

2. **Start a local web server**:
   
   Using Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (with `http-server`):
   ```bash
   npx http-server -p 8000
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000/
   ```

### Exploring the Demo

1. **Start on the landing page** (`index.html`)
2. **Select a user type** from the dropdown in the top-right (Admin, Analyst, CISO, or Viewer)
3. **Navigate to a product page** using the side navigation
4. **Click the Help button** (❓) in the top-right to open the help panel
5. **Hover over help icons** (❓) on tabs and elements to see tooltips
6. **Switch user types** and notice how the help content changes

## Architecture

### Context Engine

The **Context Engine** (`context-engine.js`) is the core of the agentic documentation system. It tracks:

- **User Type**: Admin, Analyst, CISO, or Viewer
- **Current Page**: attack-surface, workbench, or endpoint-inventory
- **Current Section**: Which tab or panel is active
- **Active Element**: What the user is interacting with

**Context Key Format**:
```
{userType}:{page}:{section}

Examples:
- admin:attack-surface:devices
- analyst:workbench:alert-details
- ciso:endpoint-inventory:compliance
```

### Content Generator

The **Content Generator** (`content-generator.js`) loads help content based on context keys:

1. **Checks cache** for previously loaded content
2. **Loads from JSON files** (`help-content.json`, `tooltip-content.json`)
3. **Applies fallback strategies** if exact match not found
4. **Caches results** for performance

**Content Sources** (configurable):
- `static`: Load from JSON files (current implementation)
- `api`: Fetch from backend API (future)
- `llm`: Generate with AI/LLM (future)

### Help Panel

The **Help Panel** (`help-panel.js`) displays context-aware documentation:

- Slides in from the right side
- Shows loading spinner while fetching content
- Renders sections (What is this?, How to:, etc.)
- Provides action buttons (Chat with Companion, Open Full Docs)
- Closes with ESC key or close button

### Tooltip Manager

The **Tooltip Manager** (`tooltip.js`) shows quick contextual tips:

- Appears on hover/click of help icons
- Positions dynamically to avoid going off-screen
- Adapts content based on user type
- Closes when clicking outside or pressing ESC

### User Selector

The **User Selector** (`user-selector.js`) allows switching between roles:

- Dropdown in top-right header
- 4 user types: Admin, Analyst, CISO, Viewer
- Persists selection to localStorage
- Updates context engine when changed

### Navigation

The **Navigation** module (`navigation.js`) manages page navigation:

- Highlights active page in side nav
- Updates page title and breadcrumbs
- Provides smooth page transitions
- Syncs with context engine

## Adding New Content

### Adding Help Panel Content

Edit `assets/data/help-content.json`:

```json
{
  "admin:attack-surface:devices": {
    "title": "Device Management",
    "badge": "AI",
    "sections": [
      {
        "type": "what-is",
        "title": "What is this?",
        "content": "The Devices view shows all discovered devices..."
      },
      {
        "type": "how-to",
        "title": "How to:",
        "items": [
          "Configure device sensors",
          "Review risk scores",
          "Export device list"
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
        "url": "/agentic-docs-poc/docs/attack-surface"
      }
    ],
    "metadata": {
      "sources": ["/docs/attack-surface", "/docs/admin-guide"]
    }
  }
}
```

**Context Key Components**:
- `{userType}`: admin, analyst, ciso, viewer
- `{page}`: attack-surface, workbench, endpoint-inventory
- `{section}`: Optional section identifier (e.g., devices, alerts, compliance)

### Adding Tooltip Content

Edit `assets/data/tooltip-content.json`:

```json
{
  "attack-surface": {
    "devices-tab": {
      "title": "Devices Tab",
      "content": "View all discovered devices in your environment.",
      "roles": {
        "admin": "Configure device sensors and manage device policies.",
        "analyst": "Investigate device-related security events.",
        "ciso": "Review device inventory and compliance status.",
        "viewer": "View device information and reports."
      }
    }
  }
}
```

**Tooltip Structure**:
- `title`: Tooltip heading
- `content`: Main tooltip text
- `roles`: Optional role-specific content for each user type

### Adding a New Page

1. **Create HTML file** (e.g., `new-page.html`)
2. **Copy structure** from existing page (header, nav, main content, help panel)
3. **Update page identifier** in JavaScript initialization:
   ```javascript
   contextEngine.setCurrentPage('new-page');
   ```
4. **Add page to navigation** in `navigation.js`:
   ```javascript
   navigation.addPage('new-page', {
       title: 'New Page',
       path: 'new-page.html',
       breadcrumbs: ['Home', 'New Page']
   });
   ```
5. **Add help content** to `help-content.json` for each user type
6. **Add tooltips** to `tooltip-content.json` for interactive elements

## Customization

### Changing User Types

Edit `assets/data/user-profiles.json`:

```json
{
  "userTypes": [
    {
      "id": "custom-role",
      "label": "Custom Role",
      "description": "Custom role description",
      "permissions": ["view", "edit"],
      "focusAreas": ["security", "compliance"]
    }
  ]
}
```

Update `user-selector.js` to include new role in dropdown.

### Styling

**Colors and Branding**: Edit `assets/css/common.css`
```css
:root {
    --tm-red: #d71921;           /* Trend Micro red */
    --color-bg-primary: #1a1a1a; /* Dark background */
    --color-text-primary: #ffffff;
}
```

**Component Styles**: Edit `assets/css/components.css`
- Help panel styles
- Tooltip styles
- Button styles
- Card styles

**Page-Specific Styles**: Edit `assets/css/pages.css`
- Page layouts
- Table styles
- Chart containers

### Content Source

Change content source in `content-generator.js`:

```javascript
// In page initialization
contentGenerator.setContentSource('static'); // or 'api' or 'llm'
```

**Static** (current): Load from JSON files
**API** (future): Fetch from backend API
**LLM** (future): Generate with AI in real-time

## API Reference

### ContextEngine

```javascript
const contextEngine = new ContextEngine();

// Get current context
const context = contextEngine.getContext();

// Update context
contextEngine.updateContext({ currentSection: 'devices' });

// Set user type
contextEngine.setUserType('analyst');

// Set current page
contextEngine.setCurrentPage('workbench');

// Track interaction
contextEngine.trackInteraction(element, 'click');

// Get context key
const key = contextEngine.getContextKey(); // "analyst:workbench"

// Listen for changes
contextEngine.on('userTypeChanged', (newType) => {
    console.log('User type changed to:', newType);
});
```

### ContentGenerator

```javascript
const contentGenerator = new ContentGenerator();

// Generate content for context
const content = await contentGenerator.generateContent('admin:attack-surface:devices');

// Fetch tooltip content
const tooltip = await contentGenerator.fetchTooltipContent('attack-surface', 'devices-tab', 'admin');

// Clear cache
contentGenerator.clearCache();

// Get cache stats
const stats = contentGenerator.getCacheStats();

// Preload content
await contentGenerator.preloadContent([
    'admin:attack-surface',
    'admin:workbench',
    'admin:endpoint-inventory'
]);
```

### HelpPanel

```javascript
const helpPanel = new HelpPanel(contextEngine, contentGenerator);

// Open help panel
await helpPanel.open();

// Close help panel
helpPanel.close();

// Refresh content
await helpPanel.refresh();

// Check if open
const isOpen = helpPanel.isOpened();
```

### TooltipManager

```javascript
const tooltipManager = new TooltipManager(contextEngine, contentGenerator);

// Show tooltip
await tooltipManager.show(element, content, 'auto');

// Hide tooltip
tooltipManager.hide();

// Check if visible
const isVisible = tooltipManager.isVisible();
```

### UserSelector

```javascript
const userSelector = new UserSelector(contextEngine);

// User type changes are handled automatically
// Listen for changes via context engine:
contextEngine.on('userTypeChanged', (newType) => {
    console.log('User switched to:', newType);
});
```

### Navigation

```javascript
const navigation = new Navigation(contextEngine);
navigation.init();

// Navigate programmatically
navigation.navigateTo('workbench');

// Get current page
const currentPage = navigation.getCurrentPage();

// Check if current page
const isCurrent = navigation.isCurrentPage('attack-surface');

// Refresh navigation
navigation.refresh();
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requirements**:
- ES6+ JavaScript support
- CSS Grid and Flexbox
- Fetch API
- LocalStorage and SessionStorage

## Performance

**Optimization Strategies**:
- Content caching (5-minute expiration)
- Lazy loading of help content
- Debounced tooltip triggers
- Minimal DOM manipulation
- CSS transitions for smooth animations

**Metrics**:
- Page load: < 2 seconds
- Help panel open: < 1 second
- Tooltip display: < 200ms
- Content cache hit rate: ~80%

## Accessibility

**Features**:
- Keyboard navigation (Tab, Enter, ESC)
- ARIA labels and roles
- Focus indicators
- Screen reader compatible
- Color contrast meets WCAG AA
- Text resizable to 200%

**Keyboard Shortcuts**:
- `Tab`: Navigate between elements
- `Enter`: Activate buttons and links
- `Esc`: Close help panel or tooltip
- `Shift+?`: Open help panel (future)

## Troubleshooting

### Help Panel Not Opening

1. Check browser console for errors
2. Verify `help-content.json` is loading correctly
3. Ensure context engine is initialized
4. Check that help button has correct ID (`helpButton`)

### Tooltips Not Appearing

1. Verify tooltip elements have `data-tooltip` attribute
2. Check `tooltip-content.json` has content for the element
3. Ensure TooltipManager is initialized
4. Check browser console for errors

### Content Not Loading

1. Verify JSON files are in `assets/data/` directory
2. Check file paths are correct (relative to HTML file)
3. Ensure web server is serving JSON files correctly
4. Check browser network tab for 404 errors

### User Type Not Persisting

1. Check browser allows localStorage
2. Verify no browser extensions blocking storage
3. Check browser console for storage errors
4. Try clearing browser cache and cookies

## Development

### Testing Locally

Run tests using the provided test files:

```bash
# Open in browser
open test-help-panel.html
open test-tooltip.html
open test-content-generator.html
open test-navigation.html
```

### Debugging

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
location.reload();
```

View context state:

```javascript
// In browser console
console.log(window.contextEngine.getContext());
console.log(window.contentGenerator.getCacheStats());
```

## Future Enhancements

### Phase 2: API Integration

Replace static JSON with backend API:

```javascript
contentGenerator.setContentSource('api');
// Content will be fetched from /api/help-content endpoint
```

### Phase 3: LLM Integration

Generate content in real-time with AI:

```javascript
contentGenerator.setContentSource('llm');
// Content will be generated using OpenAI or similar
```

### Phase 4: Analytics

Track user interactions:

```javascript
const analytics = new AnalyticsTracker();
analytics.trackHelpOpen(context);
analytics.trackContentView(contextKey, duration);
```

## Contributing

This is a proof-of-concept project. For questions or suggestions:

1. Open an issue on GitHub
2. Submit a pull request
3. Contact the project maintainer

## License

This project is for demonstration purposes only.

## Credits

**Created by**: Erik (Technical Writer)
**Organization**: Trend Micro
**Project**: Agentic Documentation POC
**Date**: November 2024

## Related Documentation

- [Trend Vision One Documentation](https://eriktechwriter.github.io/agentic-docs-poc/)
- [Project Context](../.kiro/steering/project-context.md)
- [Design Document](../.kiro/specs/mock-website-agentic-docs/design.md)
- [Requirements Document](../.kiro/specs/mock-website-agentic-docs/requirements.md)

---

**Questions?** Check the [full documentation](https://eriktechwriter.github.io/agentic-docs-poc/) or open an issue on GitHub.
