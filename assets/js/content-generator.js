/**
 * Content Generator - Generates context-aware documentation content
 * 
 * Features:
 * - Loads static content from JSON files
 * - Caches content for performance
 * - Provides fallback content for missing contexts
 * - Supports multiple content sources (static, API, LLM)
 */

class ContentGenerator {
    constructor() {
        // Content cache (Map for better performance)
        this.cache = new Map();
        
        // Content source mode: 'static', 'api', or 'llm'
        this.contentSource = 'static';
        
        // Base path for content files
        this.contentBasePath = 'assets/data/';
        
        // Cache expiration time (5 minutes)
        this.cacheExpiration = 5 * 60 * 1000;
        
        // Track loading state
        this.loadingPromises = new Map();
    }
    
    /**
     * Generate content for given context
     * @param {string} contextKey - Context key (e.g., "admin:attack-surface:overview")
     * @returns {Promise<Object>} Content object
     */
    async generateContent(contextKey) {
        // Check cache first
        const cached = this.getCached(contextKey);
        if (cached) {
            console.log(`Content cache hit for: ${contextKey}`);
            return cached;
        }
        
        // Check if already loading this content
        if (this.loadingPromises.has(contextKey)) {
            console.log(`Content already loading for: ${contextKey}`);
            return await this.loadingPromises.get(contextKey);
        }
        
        // Load content based on source mode
        let contentPromise;
        
        switch (this.contentSource) {
            case 'static':
                contentPromise = this.fetchStaticContent(contextKey);
                break;
                
            case 'api':
                contentPromise = this.fetchFromAPI(contextKey);
                break;
                
            case 'llm':
                contentPromise = this.generateWithLLM(contextKey);
                break;
                
            default:
                console.warn(`Unknown content source: ${this.contentSource}`);
                contentPromise = this.fetchStaticContent(contextKey);
        }
        
        // Store loading promise to prevent duplicate requests
        this.loadingPromises.set(contextKey, contentPromise);
        
        try {
            const content = await contentPromise;
            
            // Cache the result
            if (content) {
                this.setCached(contextKey, content);
            }
            
            return content;
        } catch (error) {
            console.error(`Error generating content for ${contextKey}:`, error);
            
            // Return fallback content
            return this.getFallbackContent(contextKey);
        } finally {
            // Clean up loading promise
            this.loadingPromises.delete(contextKey);
        }
    }
    
    /**
     * Fetch content from static JSON files
     * @param {string} contextKey - Context key
     * @returns {Promise<Object>} Content object
     */
    async fetchStaticContent(contextKey) {
        try {
            // Parse context key
            const [userType, page, section] = contextKey.split(':');
            
            // Try to load content file
            const contentFile = `${this.contentBasePath}help-content.json`;
            
            console.log(`Loading static content from: ${contentFile}`);
            
            const response = await fetch(contentFile);
            
            if (!response.ok) {
                throw new Error(`Failed to load content file: ${response.status} ${response.statusText}`);
            }
            
            const allContent = await response.json();
            
            // Look up content by context key
            let content = allContent[contextKey];
            
            // If exact match not found, try fallback strategies
            if (!content) {
                console.log(`Exact match not found for ${contextKey}, trying fallbacks...`);
                
                // Try without section
                const pageKey = `${userType}:${page}`;
                content = allContent[pageKey];
                
                // Try with default user type
                if (!content && userType !== 'admin') {
                    const defaultKey = `admin:${page}${section ? ':' + section : ''}`;
                    content = allContent[defaultKey];
                }
                
                // Try page-only key
                if (!content) {
                    content = allContent[page];
                }
            }
            
            if (content) {
                console.log(`Content found for: ${contextKey}`);
                
                // Add metadata
                return {
                    ...content,
                    metadata: {
                        ...content.metadata,
                        contextKey: contextKey,
                        loadedAt: new Date().toISOString(),
                        source: 'static'
                    }
                };
            }
            
            // No content found
            console.warn(`No content found for context: ${contextKey}`);
            return this.getFallbackContent(contextKey);
            
        } catch (error) {
            console.error('Error fetching static content:', error);
            throw error;
        }
    }
    
    /**
     * Fetch content from API (future implementation)
     * @param {string} contextKey - Context key
     * @returns {Promise<Object>} Content object
     */
    async fetchFromAPI(contextKey) {
        // Placeholder for future API integration
        console.log('API content generation not yet implemented');
        
        // For now, fall back to static content
        return this.fetchStaticContent(contextKey);
        
        /* Future implementation:
        const response = await fetch('/api/help-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contextKey })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return await response.json();
        */
    }
    
    /**
     * Generate content with LLM (future implementation)
     * @param {string} contextKey - Context key
     * @returns {Promise<Object>} Content object
     */
    async generateWithLLM(contextKey) {
        // Placeholder for future LLM integration
        console.log('LLM content generation not yet implemented');
        
        // For now, fall back to static content
        return this.fetchStaticContent(contextKey);
        
        /* Future implementation:
        const [userType, page, section] = contextKey.split(':');
        
        const prompt = `
            Generate help content for a ${userType} user 
            viewing the ${page} page${section ? ' in the ' + section + ' section' : ''}.
            
            Format: JSON with title, sections array, and actions array
        `;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }]
            })
        });
        
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
        */
    }
    
    /**
     * Get fallback content for missing context
     * @param {string} contextKey - Context key
     * @returns {Object} Fallback content object
     */
    getFallbackContent(contextKey) {
        const [userType, page, section] = contextKey.split(':');
        
        // Parse page name for display
        const pageName = this.formatPageName(page);
        const sectionName = section ? this.formatSectionName(section) : '';
        
        return {
            title: `Help: ${pageName}${sectionName ? ' - ' + sectionName : ''}`,
            badge: 'AI',
            sections: [
                {
                    type: 'what-is',
                    title: 'About This Page',
                    content: `You are viewing the ${pageName} page${sectionName ? ' in the ' + sectionName + ' section' : ''}. This page helps you manage and monitor your security environment.`
                },
                {
                    type: 'help-needed',
                    title: 'Need More Help?',
                    content: 'Detailed documentation for this feature is available in the full documentation site.'
                }
            ],
            actions: [
                {
                    type: 'link',
                    label: '📖 Open Full Documentation',
                    url: '/agentic-docs-poc/',
                    primary: true
                }
            ],
            metadata: {
                contextKey: contextKey,
                generatedAt: new Date().toISOString(),
                source: 'fallback',
                isFallback: true
            }
        };
    }
    
    /**
     * Format page name for display
     * @param {string} page - Page identifier
     * @returns {string} Formatted page name
     */
    formatPageName(page) {
        const pageNames = {
            'attack-surface': 'Attack Surface Discovery',
            'workbench': 'Workbench',
            'endpoint-inventory': 'Endpoint Inventory',
            'home': 'Home'
        };
        
        return pageNames[page] || page.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    /**
     * Format section name for display
     * @param {string} section - Section identifier
     * @returns {string} Formatted section name
     */
    formatSectionName(section) {
        return section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    /**
     * Get cached content
     * @param {string} key - Cache key
     * @returns {Object|null} Cached content or null
     */
    getCached(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return null;
        }
        
        // Check if cache has expired
        const now = Date.now();
        if (now - cached.timestamp > this.cacheExpiration) {
            console.log(`Cache expired for: ${key}`);
            this.cache.delete(key);
            return null;
        }
        
        return cached.content;
    }
    
    /**
     * Set cached content
     * @param {string} key - Cache key
     * @param {Object} content - Content to cache
     */
    setCached(key, content) {
        this.cache.set(key, {
            content: content,
            timestamp: Date.now()
        });
        
        console.log(`Content cached for: ${key}`);
        
        // Limit cache size (keep last 50 entries)
        if (this.cache.size > 50) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            console.log(`Cache size limit reached, removed: ${firstKey}`);
        }
    }
    
    /**
     * Clear all cached content
     */
    clearCache() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`Cache cleared (${size} entries removed)`);
    }
    
    /**
     * Clear expired cache entries
     */
    clearExpiredCache() {
        const now = Date.now();
        let cleared = 0;
        
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheExpiration) {
                this.cache.delete(key);
                cleared++;
            }
        }
        
        if (cleared > 0) {
            console.log(`Cleared ${cleared} expired cache entries`);
        }
    }
    
    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            oldestEntry: this.getOldestCacheEntry(),
            newestEntry: this.getNewestCacheEntry()
        };
    }
    
    /**
     * Get oldest cache entry timestamp
     * @returns {number|null} Timestamp or null
     */
    getOldestCacheEntry() {
        let oldest = null;
        
        for (const value of this.cache.values()) {
            if (!oldest || value.timestamp < oldest) {
                oldest = value.timestamp;
            }
        }
        
        return oldest;
    }
    
    /**
     * Get newest cache entry timestamp
     * @returns {number|null} Timestamp or null
     */
    getNewestCacheEntry() {
        let newest = null;
        
        for (const value of this.cache.values()) {
            if (!newest || value.timestamp > newest) {
                newest = value.timestamp;
            }
        }
        
        return newest;
    }
    
    /**
     * Set content source mode
     * @param {string} source - Source mode ('static', 'api', 'llm')
     */
    setContentSource(source) {
        const validSources = ['static', 'api', 'llm'];
        
        if (!validSources.includes(source)) {
            console.warn(`Invalid content source: ${source}. Using 'static' as default.`);
            source = 'static';
        }
        
        this.contentSource = source;
        console.log(`Content source set to: ${source}`);
        
        // Clear cache when switching sources
        this.clearCache();
    }
    
    /**
     * Get current content source
     * @returns {string} Current source mode
     */
    getContentSource() {
        return this.contentSource;
    }
    
    /**
     * Preload content for given context keys
     * @param {Array<string>} contextKeys - Array of context keys to preload
     * @returns {Promise<void>}
     */
    async preloadContent(contextKeys) {
        console.log(`Preloading content for ${contextKeys.length} contexts...`);
        
        const promises = contextKeys.map(key => this.generateContent(key));
        
        try {
            await Promise.all(promises);
            console.log('Content preloading complete');
        } catch (error) {
            console.error('Error preloading content:', error);
        }
    }
    
    /**
     * Get content synchronously from cache only
     * @param {string} contextKey - Context key
     * @returns {Object|null} Cached content or null
     */
    getContentSync(contextKey) {
        return this.getCached(contextKey);
    }
    
    /**
     * Fetch tooltip content for a specific element
     * @param {string} page - Page identifier (attack-surface, workbench, endpoint-inventory)
     * @param {string} elementId - Element identifier
     * @param {string} userType - User type for role-specific content (optional)
     * @returns {Promise<Object>} Tooltip content object
     */
    async fetchTooltipContent(page, elementId, userType = null) {
        try {
            const tooltipFile = `${this.contentBasePath}tooltip-content.json`;
            
            // Check cache first
            const cacheKey = `tooltip:${page}:${elementId}`;
            const cached = this.getCached(cacheKey);
            if (cached) {
                return this.formatTooltipForUser(cached, userType);
            }
            
            // Load tooltip content file
            const response = await fetch(tooltipFile);
            
            if (!response.ok) {
                throw new Error(`Failed to load tooltip file: ${response.status}`);
            }
            
            const allTooltips = await response.json();
            
            // Get tooltip for specific page and element
            const tooltip = allTooltips[page]?.[elementId];
            
            if (!tooltip) {
                console.warn(`No tooltip found for ${page}:${elementId}`);
                return this.getFallbackTooltip(elementId);
            }
            
            // Cache the tooltip
            this.setCached(cacheKey, tooltip);
            
            // Format for specific user type if provided
            return this.formatTooltipForUser(tooltip, userType);
            
        } catch (error) {
            console.error('Error fetching tooltip content:', error);
            return this.getFallbackTooltip(elementId);
        }
    }
    
    /**
     * Format tooltip content for specific user type
     * @param {Object} tooltip - Tooltip object
     * @param {string} userType - User type (admin, analyst, ciso, viewer)
     * @returns {Object} Formatted tooltip
     */
    formatTooltipForUser(tooltip, userType) {
        if (!userType || !tooltip.roles) {
            return tooltip;
        }
        
        // Add role-specific content if available
        const roleContent = tooltip.roles[userType];
        
        return {
            ...tooltip,
            roleSpecificContent: roleContent,
            currentRole: userType
        };
    }
    
    /**
     * Get fallback tooltip content
     * @param {string} elementId - Element identifier
     * @returns {Object} Fallback tooltip
     */
    getFallbackTooltip(elementId) {
        const formattedName = elementId
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        return {
            title: formattedName,
            content: `Information about ${formattedName}. See full documentation for details.`,
            isFallback: true
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentGenerator;
}
