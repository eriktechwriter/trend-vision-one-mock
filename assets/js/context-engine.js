/**
 * Context Engine - Manages user context for personalized documentation
 * 
 * Captures and tracks:
 * - User type (admin, analyst, ciso, viewer)
 * - Current page (attack-surface, workbench, endpoint-inventory)
 * - Current section/element being interacted with
 * - Session state
 */

class ContextEngine {
    constructor() {
        this.context = {
            userType: this.loadUserType() || 'admin',
            currentPage: this.detectCurrentPage(),
            currentSection: '',
            activeElement: null,
            timestamp: Date.now(),
            sessionId: this.getOrCreateSessionId()
        };
        
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'trendvision_usertype') {
                this.context.userType = e.newValue || 'admin';
                this.notifyListeners('userTypeChanged', this.context.userType);
            }
        });
        
        // Event listeners for context changes
        this.listeners = {
            userTypeChanged: [],
            pageChanged: [],
            sectionChanged: [],
            contextUpdated: []
        };
    }
    
    /**
     * Get current context snapshot
     * @returns {Object} Current context object
     */
    getContext() {
        return {
            ...this.context,
            timestamp: Date.now()
        };
    }
    
    /**
     * Update context with new values
     * @param {Object} updates - Properties to update
     */
    updateContext(updates) {
        const oldContext = { ...this.context };
        
        Object.assign(this.context, updates);
        this.context.timestamp = Date.now();
        
        // Notify listeners of specific changes
        if (updates.userType && updates.userType !== oldContext.userType) {
            this.notifyListeners('userTypeChanged', updates.userType);
        }
        if (updates.currentPage && updates.currentPage !== oldContext.currentPage) {
            this.notifyListeners('pageChanged', updates.currentPage);
        }
        if (updates.currentSection && updates.currentSection !== oldContext.currentSection) {
            this.notifyListeners('sectionChanged', updates.currentSection);
        }
        
        this.notifyListeners('contextUpdated', this.context);
    }
    
    /**
     * Set user type and persist to storage
     * @param {string} type - User type (admin, analyst, ciso, viewer)
     */
    setUserType(type) {
        const validTypes = ['admin', 'analyst', 'ciso', 'viewer'];
        if (!validTypes.includes(type)) {
            console.warn(`Invalid user type: ${type}. Using 'admin' as default.`);
            type = 'admin';
        }
        
        this.context.userType = type;
        this.context.timestamp = Date.now();
        
        // Persist to localStorage
        try {
            localStorage.setItem('trendvision_usertype', type);
        } catch (e) {
            console.warn('Could not save user type to localStorage:', e);
        }
        
        this.notifyListeners('userTypeChanged', type);
        this.notifyListeners('contextUpdated', this.context);
    }
    
    /**
     * Set current page
     * @param {string} page - Page identifier
     */
    setCurrentPage(page) {
        this.context.currentPage = page;
        this.context.timestamp = Date.now();
        
        this.notifyListeners('pageChanged', page);
        this.notifyListeners('contextUpdated', this.context);
    }
    
    /**
     * Track user interaction with an element
     * @param {HTMLElement|string} element - Element or element ID
     * @param {string} action - Action type (hover, click, focus)
     */
    trackInteraction(element, action = 'click') {
        const elementId = typeof element === 'string' ? element : element.id;
        const elementType = typeof element === 'string' ? 'unknown' : element.tagName.toLowerCase();
        
        this.context.activeElement = {
            id: elementId,
            type: elementType,
            action: action,
            timestamp: Date.now()
        };
        
        this.context.timestamp = Date.now();
        this.notifyListeners('contextUpdated', this.context);
    }
    
    /**
     * Set current section (e.g., tab, panel, modal)
     * @param {string} section - Section identifier
     */
    setCurrentSection(section) {
        this.context.currentSection = section;
        this.context.timestamp = Date.now();
        
        this.notifyListeners('sectionChanged', section);
        this.notifyListeners('contextUpdated', this.context);
    }
    
    /**
     * Generate context key for content lookup
     * Format: {userType}:{page}:{section}
     * @returns {string} Context key
     */
    getContextKey() {
        const parts = [
            this.context.userType,
            this.context.currentPage
        ];
        
        if (this.context.currentSection) {
            parts.push(this.context.currentSection);
        }
        
        return parts.join(':');
    }
    
    /**
     * Load user type from localStorage
     * @returns {string|null} Saved user type or null
     */
    loadUserType() {
        try {
            return localStorage.getItem('trendvision_usertype');
        } catch (e) {
            console.warn('Could not load user type from localStorage:', e);
            return null;
        }
    }
    
    /**
     * Detect current page from URL
     * @returns {string} Page identifier
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('attack-surface')) {
            return 'attack-surface';
        } else if (path.includes('workbench')) {
            return 'workbench';
        } else if (path.includes('endpoint-inventory')) {
            return 'endpoint-inventory';
        } else if (path.includes('index')) {
            return 'home';
        }
        
        return 'unknown';
    }
    
    /**
     * Get or create session ID
     * @returns {string} Session ID
     */
    getOrCreateSessionId() {
        try {
            let sessionId = sessionStorage.getItem('trendvision_session');
            if (!sessionId) {
                sessionId = this.generateSessionId();
                sessionStorage.setItem('trendvision_session', sessionId);
            }
            return sessionId;
        } catch (e) {
            console.warn('Could not access sessionStorage:', e);
            return this.generateSessionId();
        }
    }
    
    /**
     * Generate a simple session ID
     * @returns {string} Session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Register event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }
    
    /**
     * Unregister event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
    
    /**
     * Notify all listeners of an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error in ${event} listener:`, e);
                }
            });
        }
    }
    
    /**
     * Get context summary for debugging
     * @returns {string} Context summary
     */
    toString() {
        return `Context: ${this.getContextKey()} (${this.context.userType} on ${this.context.currentPage})`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextEngine;
}
