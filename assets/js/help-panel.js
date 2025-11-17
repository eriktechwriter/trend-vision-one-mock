/**
 * Help Panel Component - Displays context-aware documentation
 * 
 * Features:
 * - Sliding panel from right side
 * - Context-aware content loading
 * - Loading and error states
 * - ESC key to close
 * - Smooth animations
 */

class HelpPanel {
    constructor(contextEngine, contentGenerator) {
        this.contextEngine = contextEngine;
        this.contentGenerator = contentGenerator;
        this.isOpen = false;
        
        // Get existing panel elements from HTML
        this.panelElement = document.getElementById('helpPanel');
        this.contentElement = document.getElementById('helpContent');
        this.titleElement = document.getElementById('helpTitle');
        
        if (!this.panelElement || !this.contentElement || !this.titleElement) {
            console.error('Help panel elements not found in DOM');
            return;
        }
        
        this.attachEventListeners();
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        const closeButton = document.getElementById('closeHelp');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Listen for context changes
        this.contextEngine.on('contextUpdated', () => {
            if (this.isOpen) {
                // Optionally reload content when context changes
                // this.loadContent();
            }
        });
    }
    
    /**
     * Open the help panel and load content
     */
    async open() {
        if (this.isOpen) {
            return;
        }
        
        this.isOpen = true;
        this.panelElement.classList.add('help-panel-open');
        this.panelElement.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll when panel is open
        document.body.style.overflow = 'hidden';
        
        // Load content
        await this.loadContent();
        
        // Focus on close button for accessibility
        const closeButton = document.getElementById('closeHelp');
        if (closeButton) {
            setTimeout(() => closeButton.focus(), 300);
        }
    }
    
    /**
     * Close the help panel
     */
    close() {
        if (!this.isOpen) {
            return;
        }
        
        this.isOpen = false;
        this.panelElement.classList.remove('help-panel-open');
        this.panelElement.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    /**
     * Load content based on current context
     */
    async loadContent() {
        this.showLoading();
        
        try {
            const contextKey = this.contextEngine.getContextKey();
            
            // Get content from content generator
            const content = await this.contentGenerator.generateContent(contextKey);
            
            if (content) {
                this.renderContent(content);
            } else {
                this.showError('No help content available for this context.');
            }
        } catch (error) {
            console.error('Error loading help content:', error);
            this.showError('Failed to load help content. Please try again.');
        }
    }
    
    /**
     * Render content in the panel
     * @param {Object} content - Content object with title, sections, etc.
     */
    renderContent(content) {
        // Update title
        if (content.title) {
            this.titleElement.textContent = content.title;
        }
        
        // Clear existing content
        this.contentElement.innerHTML = '';
        
        // Create content container
        const container = document.createElement('div');
        container.className = 'help-content-container';
        
        // Render context info (for transparency)
        if (content.metadata && content.metadata.contextKey) {
            const contextInfo = document.createElement('div');
            contextInfo.className = 'help-context-info';
            contextInfo.innerHTML = `
                <span class="help-context-label">Context:</span>
                <code>${content.metadata.contextKey}</code>
            `;
            container.appendChild(contextInfo);
        }
        
        // Render sections
        if (content.sections && Array.isArray(content.sections)) {
            content.sections.forEach(section => {
                const sectionEl = this.renderSection(section);
                if (sectionEl) {
                    container.appendChild(sectionEl);
                }
            });
        }
        
        // Render actions
        if (content.actions && Array.isArray(content.actions)) {
            const actionsEl = this.renderActions(content.actions);
            if (actionsEl) {
                container.appendChild(actionsEl);
            }
        }
        
        // Render related topics
        if (content.relatedTopics && Array.isArray(content.relatedTopics)) {
            const relatedEl = this.renderRelatedTopics(content.relatedTopics);
            if (relatedEl) {
                container.appendChild(relatedEl);
            }
        }
        
        // Add to content area
        this.contentElement.appendChild(container);
    }
    
    /**
     * Render a content section
     * @param {Object} section - Section object
     * @returns {HTMLElement|null} Section element
     */
    renderSection(section) {
        if (!section || !section.type) {
            return null;
        }
        
        const sectionEl = document.createElement('div');
        sectionEl.className = `help-section help-section-${section.type}`;
        
        // Section title
        if (section.title) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'help-section-title';
            titleEl.textContent = section.title;
            sectionEl.appendChild(titleEl);
        }
        
        // Section content
        if (section.content) {
            const contentEl = document.createElement('div');
            contentEl.className = 'help-section-content';
            
            // Support markdown-like formatting
            if (typeof section.content === 'string') {
                contentEl.innerHTML = this.formatContent(section.content);
            } else {
                contentEl.textContent = section.content;
            }
            
            sectionEl.appendChild(contentEl);
        }
        
        // Section items (for lists)
        if (section.items && Array.isArray(section.items)) {
            const listEl = document.createElement('ul');
            listEl.className = 'help-section-list';
            
            section.items.forEach(item => {
                const itemEl = document.createElement('li');
                itemEl.textContent = item;
                listEl.appendChild(itemEl);
            });
            
            sectionEl.appendChild(listEl);
        }
        
        return sectionEl;
    }
    
    /**
     * Render action buttons
     * @param {Array} actions - Array of action objects
     * @returns {HTMLElement} Actions container
     */
    renderActions(actions) {
        const actionsEl = document.createElement('div');
        actionsEl.className = 'help-actions';
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'help-action-button';
            
            if (action.primary) {
                button.classList.add('help-action-primary');
            }
            
            if (action.icon) {
                button.innerHTML = `${action.icon} ${action.label}`;
            } else {
                button.textContent = action.label;
            }
            
            // Handle action click
            button.addEventListener('click', () => {
                this.handleAction(action);
            });
            
            actionsEl.appendChild(button);
        });
        
        return actionsEl;
    }
    
    /**
     * Render related topics
     * @param {Array} topics - Array of topic objects
     * @returns {HTMLElement} Related topics container
     */
    renderRelatedTopics(topics) {
        const container = document.createElement('div');
        container.className = 'help-related-topics';
        
        const title = document.createElement('h3');
        title.className = 'help-section-title';
        title.textContent = 'Related Topics';
        container.appendChild(title);
        
        const list = document.createElement('ul');
        list.className = 'help-related-list';
        
        topics.forEach(topic => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = topic.url;
            link.textContent = topic.title;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            item.appendChild(link);
            list.appendChild(item);
        });
        
        container.appendChild(list);
        return container;
    }
    
    /**
     * Handle action button click
     * @param {Object} action - Action object
     */
    handleAction(action) {
        switch (action.type) {
            case 'chat':
                // Open chat interface (future implementation)
                console.log('Opening chat with Companion...');
                alert('Chat with Companion feature coming soon!');
                break;
                
            case 'link':
                // Open documentation link
                if (action.url) {
                    window.open(action.url, '_blank', 'noopener,noreferrer');
                }
                break;
                
            case 'custom':
                // Custom action handler
                if (action.handler && typeof action.handler === 'function') {
                    action.handler();
                }
                break;
                
            default:
                console.warn('Unknown action type:', action.type);
        }
    }
    
    /**
     * Format content with basic markdown-like syntax
     * @param {string} content - Raw content
     * @returns {string} Formatted HTML
     */
    formatContent(content) {
        // Simple formatting (can be enhanced)
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.contentElement.innerHTML = `
            <div class="help-loading">
                <div class="spinner"></div>
                <p>Loading help content...</p>
            </div>
        `;
    }
    
    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        this.contentElement.innerHTML = `
            <div class="help-error">
                <div class="help-error-icon">⚠️</div>
                <h3>Unable to Load Help</h3>
                <p>${message}</p>
                <div class="help-error-actions">
                    <button class="help-action-button" onclick="window.open('/agentic-docs-poc/', '_blank')">
                        📖 Open Full Documentation
                    </button>
                    <button class="help-action-button" onclick="location.reload()">
                        🔄 Retry
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Toggle panel open/close
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    /**
     * Check if panel is open
     * @returns {boolean} True if open
     */
    isOpened() {
        return this.isOpen;
    }
    
    /**
     * Refresh content (reload with current context)
     */
    async refresh() {
        if (this.isOpen) {
            await this.loadContent();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpPanel;
}
