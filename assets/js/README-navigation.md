# Navigation Module

## Overview

The Navigation module manages side navigation functionality, active page highlighting, and smooth page transitions for the Trend Vision One mock website.

## Features

- **Automatic Page Detection**: Detects current page from URL and updates navigation state
- **Active Page Highlighting**: Visually highlights the current page in the side navigation
- **Smooth Transitions**: Provides fade-out/fade-in effects when navigating between pages
- **Breadcrumb Management**: Automatically updates breadcrumbs based on current page
- **Context Integration**: Works with ContextEngine to track page changes
- **Programmatic Navigation**: Allows navigation via JavaScript API

## Usage

### Basic Setup

```html
<!-- Include required scripts -->
<script src="assets/js/context-engine.js"></script>
<script src="assets/js/navigation.js"></script>

<!-- Navigation will auto-initialize on DOMContentLoaded -->
```

### Manual Initialization

```javascript
// Create context engine first
const contextEngine = new ContextEngine();

// Create and initialize navigation
const navigation = new Navigation(contextEngine);
navigation.init();
```

### HTML Structure

The navigation module expects the following HTML structure:

```html
<!-- Side Navigation -->
<nav class="side-nav">
    <a href="index.html">Home</a>
    <a href="attack-surface.html">Attack Surface Discovery</a>
    <a href="workbench.html">Workbench</a>
    <a href="endpoint-inventory.html">Endpoint Inventory</a>
</nav>

<!-- Breadcrumbs (optional) -->
<div class="breadcrumbs"></div>

<!-- Page Title (optional) -->
<h1 class="page-title"></h1>

<!-- Main Content -->
<main class="main-content">
    <!-- Page content -->
</main>
```

## API Reference

### Constructor

```javascript
new Navigation(contextEngine)
```

**Parameters:**
- `contextEngine` (ContextEngine, optional): Context engine instance for tracking page changes

### Methods

#### `init()`

Initialize the navigation module. Sets up event listeners, detects current page, and highlights active navigation item.

```javascript
navigation.init();
```

#### `detectCurrentPage()`

Detect the current page from the URL.

```javascript
const pageId = navigation.detectCurrentPage();
// Returns: 'attack-surface', 'workbench', 'endpoint-inventory', 'home', or 'unknown'
```

#### `highlightActivePage()`

Highlight the active page in the navigation menu.

```javascript
navigation.highlightActivePage();
```

#### `navigateTo(pageId)`

Navigate to a specific page programmatically with smooth transition.

```javascript
navigation.navigateTo('attack-surface');
navigation.navigateTo('workbench');
navigation.navigateTo('endpoint-inventory');
```

**Parameters:**
- `pageId` (string): Page identifier ('attack-surface', 'workbench', 'endpoint-inventory', 'home')

#### `getCurrentPage()`

Get information about the current page.

```javascript
const pageInfo = navigation.getCurrentPage();
// Returns: { id: 'attack-surface', title: '...', path: '...', breadcrumbs: [...] }
```

#### `isCurrentPage(pageId)`

Check if a specific page is the current page.

```javascript
if (navigation.isCurrentPage('attack-surface')) {
    console.log('On Attack Surface page');
}
```

**Parameters:**
- `pageId` (string): Page identifier to check

**Returns:** `boolean`

#### `refresh()`

Refresh the navigation state (re-detect current page and update highlights).

```javascript
navigation.refresh();
```

#### `addPage(pageId, config)`

Add a custom page to the navigation system.

```javascript
navigation.addPage('custom-page', {
    title: 'Custom Page',
    path: 'custom-page.html',
    breadcrumbs: ['Home', 'Custom Page']
});
```

**Parameters:**
- `pageId` (string): Unique page identifier
- `config` (object): Page configuration
  - `title` (string): Page title
  - `path` (string): Page file path
  - `breadcrumbs` (array): Breadcrumb items

#### `getPages()`

Get all registered pages.

```javascript
const pages = navigation.getPages();
// Returns: { 'attack-surface': {...}, 'workbench': {...}, ... }
```

## Page Configuration

Each page has the following configuration:

```javascript
{
    title: 'Attack Surface Discovery',      // Page title
    path: 'attack-surface.html',            // File path
    breadcrumbs: ['Home', 'Attack Surface'] // Breadcrumb trail
}
```

### Default Pages

The navigation module comes with four pre-configured pages:

1. **Home** (`home`)
   - Path: `index.html`
   - Title: "Trend Vision One"

2. **Attack Surface Discovery** (`attack-surface`)
   - Path: `attack-surface.html`
   - Title: "Attack Surface Discovery"

3. **Workbench** (`workbench`)
   - Path: `workbench.html`
   - Title: "Workbench"

4. **Endpoint Inventory** (`endpoint-inventory`)
   - Path: `endpoint-inventory.html`
   - Title: "Endpoint Inventory"

## CSS Classes

The navigation module uses and manages the following CSS classes:

### Navigation Links

- `.side-nav a` - Base navigation link style
- `.active` - Applied to active navigation link
- `.nav-active` - Alternative active class
- `.active-indicator` - Visual indicator (▸) for active page

### Page Transitions

- `.page-transition-out` - Applied during page exit (fade out)
- `.page-transition-in` - Applied during page entry (fade in)

### Breadcrumbs

- `.breadcrumbs` or `.breadcrumb` - Breadcrumb container
- `.breadcrumb-item` - Individual breadcrumb item
- `.breadcrumb-separator` - Separator between items

## Styling

The navigation styles are defined in `assets/css/components.css`. Key styles include:

```css
/* Active navigation item */
.side-nav a.active {
    color: var(--color-text-primary);
    background-color: var(--color-bg-tertiary);
    border-left-color: var(--tm-red);
    font-weight: var(--font-weight-semibold);
}

/* Page transitions */
.page-transition-out {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
```

## Integration with Context Engine

The navigation module integrates with the ContextEngine to track page changes:

```javascript
// Navigation automatically updates context engine
contextEngine.on('pageChanged', (page) => {
    console.log('Page changed to:', page);
});

// Context is updated when navigation occurs
const context = contextEngine.getContext();
console.log(context.currentPage); // 'attack-surface'
```

## Examples

### Example 1: Basic Page with Navigation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Attack Surface Discovery</title>
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
    <nav class="side-nav">
        <a href="index.html">Home</a>
        <a href="attack-surface.html">Attack Surface Discovery</a>
        <a href="workbench.html">Workbench</a>
        <a href="endpoint-inventory.html">Endpoint Inventory</a>
    </nav>
    
    <main class="main-content">
        <div class="breadcrumbs"></div>
        <h1 class="page-title">Attack Surface Discovery</h1>
        <!-- Page content -->
    </main>
    
    <script src="assets/js/context-engine.js"></script>
    <script src="assets/js/navigation.js"></script>
</body>
</html>
```

### Example 2: Programmatic Navigation

```javascript
// Navigate to different pages
document.getElementById('goToWorkbench').addEventListener('click', () => {
    navigation.navigateTo('workbench');
});

// Check current page
if (navigation.isCurrentPage('attack-surface')) {
    console.log('Currently on Attack Surface page');
}

// Get page info
const pageInfo = navigation.getCurrentPage();
console.log(`Current page: ${pageInfo.title}`);
```

### Example 3: Custom Page Registration

```javascript
// Add a custom page
navigation.addPage('reports', {
    title: 'Reports',
    path: 'reports.html',
    breadcrumbs: ['Home', 'Reports']
});

// Navigate to custom page
navigation.navigateTo('reports');
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires ES6+ support (classes, arrow functions, template literals).

## Dependencies

- **ContextEngine** (optional): For context tracking and page change events
- **CSS Variables**: Defined in `common.css` for theming

## Testing

A test page is available at `test-navigation.html` that demonstrates:

- Current page detection
- Active page highlighting
- Programmatic navigation
- Page information display
- Navigation refresh

## Troubleshooting

### Navigation not highlighting active page

**Problem**: The active page is not highlighted in the navigation.

**Solution**: Ensure your navigation links have the correct `href` attributes that match the page paths defined in the configuration.

### Page transitions not working

**Problem**: Smooth transitions are not visible when navigating.

**Solution**: 
1. Ensure `components.css` is loaded
2. Check that `.main-content` or `main` element exists
3. Verify CSS transition properties are not overridden

### Context engine not updating

**Problem**: Context engine doesn't reflect page changes.

**Solution**: 
1. Ensure ContextEngine is initialized before Navigation
2. Pass the context engine instance to Navigation constructor
3. Check browser console for errors

### Breadcrumbs not appearing

**Problem**: Breadcrumbs are not displayed.

**Solution**: Add a breadcrumb container element with class `.breadcrumbs` or `.breadcrumb` to your page.

## Future Enhancements

Potential improvements for future versions:

1. **History API Integration**: Use pushState/popState for SPA-like navigation
2. **Loading States**: Show loading indicators during page transitions
3. **Navigation Guards**: Add hooks to prevent/confirm navigation
4. **Nested Navigation**: Support for hierarchical navigation structures
5. **Mobile Menu**: Collapsible navigation for mobile devices
6. **Keyboard Navigation**: Enhanced keyboard shortcuts for navigation

## Related Modules

- **ContextEngine**: Tracks user context including current page
- **HelpPanel**: Uses navigation context for contextual help
- **UserSelector**: Works with navigation for role-based content

## License

Part of the Trend Vision One Agentic Documentation POC project.
