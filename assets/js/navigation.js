/**
 * Navigation Module - Manages side navigation and page transitions
 * 
 * Features:
 * - Active page highlighting based on current URL
 * - Smooth page transitions
 * - Navigation state management
 * - Breadcrumb updates
 */

class Navigation {
    constructor(contextEngine) {
        this.contextEngine = contextEngine;
        this.currentPage = null;
        this.navLinks = [];
        this.initialized = false;
        
        // Page configuration
        this.pages = {
            'attack-surface': {
                title: 'Attack Surface Discovery',
                path: 'attack-surface.html',
                breadcrumbs: ['Home', 'Attack Surface Discovery']
            },
            'workbench': {
                title: 'Workbench',
                path: 'workbench.html',
                breadcrumbs: ['Home', 'Workbench']
            },
            'endpoint-inventory': {
                title: 'Endpoint Inventory',
                path: 'endpoint-inventory.html',
                breadcrumbs: ['Home', 'Endpoint Inventory']
            },
            'home': {
                title: 'Trend Vision One',
                path: 'index.html',
                breadcrumbs: ['Home']
            }
        };
    }
    
    /**
     * Initialize navigation
     * Sets up event listeners and highlights current page
     */
    init() {
        if (this.initialized) {
            console.warn('Navigation already initialized');
            return;
        }
        
        // Find all navigation links
        this.navLinks = Array.from(document.querySelectorAll('.side-nav a, nav a[href*=".html"]'));
        
        // Detect current page
        this.currentPage = this.detectCurrentPage();
        
        // Update context engine with current page
        if (this.contextEngine) {
            this.contextEngine.setCurrentPage(this.currentPage);
        }
        
        // Highlight active page
        this.highlightActivePage();
        
        // Set up click handlers for smooth transitions
        this.setupTransitions();
        
        // Update page title and breadcrumbs
        this.updatePageInfo();
        
        this.initialized = true;
        
        console.log(`Navigation initialized. Current page: ${this.currentPage}`);
    }
    
    /**
     * Detect current page from URL
     * @returns {string} Page identifier
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        // Match filename to page identifier
        if (filename.includes('attack-surface')) {
            return 'attack-surface';
        } else if (filename.includes('workbench')) {
            return 'workbench';
        } else if (filename.includes('endpoint-inventory')) {
            return 'endpoint-inventory';
        } else if (filename.includes('index') || filename === '') {
            return 'home';
        }
        
        return 'unknown';
    }
    
    /**
     * Highlight the active page in navigation
     */
    highlightActivePage() {
        // Remove existing active classes
        this.navLinks.forEach(link => {
            link.classList.remove('active', 'nav-active');
        });
        
        // Find and highlight current page link
        const currentPageConfig = this.pages[this.currentPage];
        if (!currentPageConfig) {
            return;
        }
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPageConfig.path)) {
                link.classList.add('active', 'nav-active');
                
                // Add visual indicator
                if (!link.querySelector('.active-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'active-indicator';
                    indicator.textContent = '▸';
                    link.prepend(indicator);
                }
            }
        });
    }
    
    /**
     * Set up smooth page transitions
     */
    setupTransitions() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only handle internal navigation
                if (!href || href.startsWith('http') || href.startsWith('#')) {
                    return;
                }
                
                // Add transition effect
                this.transitionToPage(href, e);
            });
        });
    }
    
    /**
     * Perform smooth transition to new page
     * @param {string} href - Target page URL
     * @param {Event} event - Click event (optional, for preventDefault)
     */
    transitionToPage(href, event = null) {
        // Get main content area
        const mainContent = document.querySelector('.main-content, main, body');
        
        if (!mainContent) {
            // No transition possible, just navigate
            return;
        }
        
        // Prevent default navigation if event provided
        if (event) {
            event.preventDefault();
        }
        
        // Add fade-out class
        mainContent.classList.add('page-transition-out');
        
        // Wait for transition, then navigate
        setTimeout(() => {
            window.location.href = href;
        }, 200); // 200ms transition duration
    }
    
    /**
     * Update page title and breadcrumbs
     */
    updatePageInfo() {
        const pageConfig = this.pages[this.currentPage];
        if (!pageConfig) {
            return;
        }
        
        // Update document title
        document.title = `${pageConfig.title} - Trend Vision One`;
        
        // Update page title element if exists
        const pageTitleEl = document.querySelector('.page-title, h1.title');
        if (pageTitleEl) {
            pageTitleEl.textContent = pageConfig.title;
        }
        
        // Update breadcrumbs if element exists
        const breadcrumbsEl = document.querySelector('.breadcrumbs, .breadcrumb');
        if (breadcrumbsEl) {
            this.renderBreadcrumbs(breadcrumbsEl, pageConfig.breadcrumbs);
        }
    }
    
    /**
     * Render breadcrumbs
     * @param {HTMLElement} container - Breadcrumb container element
     * @param {Array<string>} crumbs - Breadcrumb items
     */
    renderBreadcrumbs(container, crumbs) {
        container.innerHTML = '';
        
        crumbs.forEach((crumb, index) => {
            const span = document.createElement('span');
            span.className = 'breadcrumb-item';
            span.textContent = crumb;
            
            container.appendChild(span);
            
            // Add separator except for last item
            if (index < crumbs.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = ' / ';
                container.appendChild(separator);
            }
        });
    }
    
    /**
     * Navigate to a specific page programmatically
     * @param {string} pageId - Page identifier (e.g., 'attack-surface')
     */
    navigateTo(pageId) {
        const pageConfig = this.pages[pageId];
        if (!pageConfig) {
            console.error(`Unknown page: ${pageId}`);
            return;
        }
        
        this.transitionToPage(pageConfig.path);
    }
    
    /**
     * Get current page information
     * @returns {Object} Current page configuration
     */
    getCurrentPage() {
        return {
            id: this.currentPage,
            ...this.pages[this.currentPage]
        };
    }
    
    /**
     * Check if a page is the current page
     * @param {string} pageId - Page identifier
     * @returns {boolean} True if current page
     */
    isCurrentPage(pageId) {
        return this.currentPage === pageId;
    }
    
    /**
     * Add a custom page to navigation
     * @param {string} pageId - Page identifier
     * @param {Object} config - Page configuration
     */
    addPage(pageId, config) {
        this.pages[pageId] = {
            title: config.title || pageId,
            path: config.path || `${pageId}.html`,
            breadcrumbs: config.breadcrumbs || ['Home', config.title || pageId]
        };
    }
    
    /**
     * Refresh navigation (re-detect current page and update highlights)
     */
    refresh() {
        this.currentPage = this.detectCurrentPage();
        
        if (this.contextEngine) {
            this.contextEngine.setCurrentPage(this.currentPage);
        }
        
        this.highlightActivePage();
        this.updatePageInfo();
    }
    
    /**
     * Get all available pages
     * @returns {Object} Pages configuration
     */
    getPages() {
        return { ...this.pages };
    }
}

// Auto-initialize on DOM ready if context engine is available
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check if ContextEngine is available
        if (typeof ContextEngine !== 'undefined' && typeof window.contextEngine !== 'undefined') {
            window.navigation = new Navigation(window.contextEngine);
            window.navigation.init();
        } else {
            console.warn('Navigation: ContextEngine not found. Navigation will initialize without context tracking.');
            window.navigation = new Navigation(null);
            window.navigation.init();
        }
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
