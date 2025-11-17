/**
 * TooltipManager - Manages contextual tooltips that appear on hover/click
 * 
 * Features:
 * - Dynamic positioning to avoid going off-screen
 * - Click-outside listener to close tooltips
 * - Context-aware content loading
 * - Smooth fade-in/fade-out animations
 * 
 * @class TooltipManager
 */
class TooltipManager {
    /**
     * Create a TooltipManager instance
     * @param {ContextEngine} contextEngine - The context engine for context-aware content
     * @param {ContentGenerator} contentGenerator - The content generator for loading tooltip content (optional)
     */
    constructor(contextEngine, contentGenerator = null) {
        this.contextEngine = contextEngine;
        this.contentGenerator = contentGenerator;
        this.activeTooltip = null;
        this.tooltipElement = null;
        this.triggerElement = null;
        
        // Bind methods to maintain context
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleEscapeKey = this.handleEscapeKey.bind(this);
        
        // Initialize tooltip element
        this.initializeTooltip();
    }
    
    /**
     * Initialize the tooltip DOM element
     * @private
     */
    initializeTooltip() {
        // Check if tooltip already exists
        let tooltip = document.getElementById('tooltipBubble');
        
        if (!tooltip) {
            // Create tooltip structure
            tooltip = document.createElement('div');
            tooltip.id = 'tooltipBubble';
            tooltip.className = 'tooltip-bubble';
            tooltip.style.display = 'none';
            
            tooltip.innerHTML = `
                <div class="tooltip-header">
                    <span id="tooltipTitle" class="tooltip-title"></span>
                    <button id="tooltipClose" class="tooltip-close" aria-label="Close tooltip">×</button>
                </div>
                <div id="tooltipContent" class="tooltip-content"></div>
            `;
            
            document.body.appendChild(tooltip);
        }
        
        this.tooltipElement = tooltip;
        
        // Add close button listener
        const closeButton = tooltip.querySelector('#tooltipClose');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }
    }
    
    /**
     * Show tooltip for a specific element
     * @param {HTMLElement} element - The trigger element
     * @param {Object|string} content - Tooltip content (object with title/text or string)
     * @param {string} position - Preferred position ('top', 'bottom', 'left', 'right', 'auto')
     */
    async show(element, content, position = 'auto') {
        if (!element || !this.tooltipElement) {
            console.warn('TooltipManager: Invalid element or tooltip not initialized');
            return;
        }
        
        // Store trigger element
        this.triggerElement = element;
        
        // Load content if it's a context key
        let tooltipContent = content;
        if (typeof content === 'string' && content.includes(':')) {
            // Looks like a context key, try to load content
            tooltipContent = await this.loadTooltipContent(content);
        }
        
        // Render content
        this.renderContent(tooltipContent);
        
        // Show tooltip
        this.tooltipElement.style.display = 'block';
        this.tooltipElement.style.opacity = '0';
        
        // Position tooltip
        this.position(this.tooltipElement, element, position);
        
        // Fade in
        requestAnimationFrame(() => {
            this.tooltipElement.style.opacity = '1';
        });
        
        // Set active tooltip
        this.activeTooltip = {
            element: element,
            content: tooltipContent,
            position: position
        };
        
        // Add event listeners
        this.addEventListeners();
    }
    
    /**
     * Hide the active tooltip
     */
    hide() {
        if (!this.tooltipElement || !this.activeTooltip) {
            return;
        }
        
        // Fade out
        this.tooltipElement.style.opacity = '0';
        
        // Hide after animation
        setTimeout(() => {
            if (this.tooltipElement) {
                this.tooltipElement.style.display = 'none';
            }
        }, 200);
        
        // Clear active tooltip
        this.activeTooltip = null;
        this.triggerElement = null;
        
        // Remove event listeners
        this.removeEventListeners();
    }
    
    /**
     * Position tooltip relative to trigger element
     * @param {HTMLElement} tooltipEl - The tooltip element
     * @param {HTMLElement} triggerEl - The trigger element
     * @param {string} preferredPosition - Preferred position
     * @private
     */
    position(tooltipEl, triggerEl, preferredPosition) {
        if (!tooltipEl || !triggerEl) {
            return;
        }
        
        // Get trigger element position
        const triggerRect = triggerEl.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate available space in each direction
        const spaceAbove = triggerRect.top;
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceLeft = triggerRect.left;
        const spaceRight = viewportWidth - triggerRect.right;
        
        // Determine best position
        let position = preferredPosition;
        
        if (position === 'auto') {
            // Choose position with most space
            const spaces = {
                top: spaceAbove,
                bottom: spaceBelow,
                left: spaceLeft,
                right: spaceRight
            };
            
            position = Object.keys(spaces).reduce((a, b) => 
                spaces[a] > spaces[b] ? a : b
            );
        }
        
        // Calculate position
        let top, left;
        const offset = 8; // Gap between trigger and tooltip
        
        switch (position) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - offset;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
                
            case 'bottom':
                top = triggerRect.bottom + offset;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
                
            case 'left':
                top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.left - tooltipRect.width - offset;
                break;
                
            case 'right':
                top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.right + offset;
                break;
                
            default:
                // Default to bottom
                top = triggerRect.bottom + offset;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        }
        
        // Ensure tooltip stays within viewport
        const margin = 8;
        
        // Horizontal bounds
        if (left < margin) {
            left = margin;
        } else if (left + tooltipRect.width > viewportWidth - margin) {
            left = viewportWidth - tooltipRect.width - margin;
        }
        
        // Vertical bounds
        if (top < margin) {
            top = margin;
        } else if (top + tooltipRect.height > viewportHeight - margin) {
            top = viewportHeight - tooltipRect.height - margin;
        }
        
        // Apply position
        tooltipEl.style.top = `${top}px`;
        tooltipEl.style.left = `${left}px`;
        
        // Add position class for styling (arrow direction)
        tooltipEl.className = `tooltip-bubble tooltip-${position}`;
    }
    
    /**
     * Load tooltip content based on context key
     * @param {string} tooltipKey - Context key for tooltip content (e.g., "devices-tab", "risk-index")
     * @returns {Promise<Object>} Tooltip content object
     * @private
     */
    async loadTooltipContent(tooltipKey) {
        try {
            // Get current context
            const context = this.contextEngine.getContext();
            const page = context.currentPage;
            const userType = context.userType;
            
            // Use ContentGenerator if available
            if (this.contentGenerator) {
                const tooltipData = await this.contentGenerator.fetchTooltipContent(
                    page,
                    tooltipKey,
                    userType
                );
                
                // Format for tooltip display
                return this.formatTooltipData(tooltipData, userType);
            }
            
            // Fallback: load directly from file
            const response = await fetch('assets/data/tooltip-content.json');
            if (!response.ok) {
                throw new Error('Failed to load tooltip content');
            }
            
            const allTooltips = await response.json();
            const tooltipData = allTooltips[page]?.[tooltipKey];
            
            if (tooltipData) {
                return this.formatTooltipData(tooltipData, userType);
            }
            
            // Fallback content
            return {
                title: 'Help',
                text: 'Context-specific help information will appear here.'
            };
            
        } catch (error) {
            console.error('Error loading tooltip content:', error);
            
            // Return fallback content
            return {
                title: 'Help',
                text: 'Unable to load help content. Please try again.'
            };
        }
    }
    
    /**
     * Format tooltip data for display
     * @param {Object} tooltipData - Raw tooltip data
     * @param {string} userType - Current user type
     * @returns {Object} Formatted tooltip object
     * @private
     */
    formatTooltipData(tooltipData, userType) {
        if (!tooltipData) {
            return {
                title: 'Help',
                text: 'No content available'
            };
        }
        
        // Build tooltip text
        let text = tooltipData.content || '';
        
        // Add role-specific content if available
        if (tooltipData.roles && tooltipData.roles[userType]) {
            text += `\n\n**For ${userType}s:** ${tooltipData.roles[userType]}`;
        } else if (tooltipData.roleSpecificContent) {
            text += `\n\n**For ${userType}s:** ${tooltipData.roleSpecificContent}`;
        }
        
        // Add additional info if available
        if (tooltipData.calculation) {
            text += `\n\n*${tooltipData.calculation}*`;
        }
        
        if (tooltipData.sla) {
            text += `\n\n**SLA:** ${tooltipData.sla}`;
        }
        
        return {
            title: tooltipData.title || 'Help',
            text: text
        };
    }
    
    /**
     * Render content in tooltip
     * @param {Object|string} content - Content to render
     * @private
     */
    renderContent(content) {
        const titleEl = this.tooltipElement.querySelector('#tooltipTitle');
        const contentEl = this.tooltipElement.querySelector('#tooltipContent');
        
        if (!titleEl || !contentEl) {
            return;
        }
        
        // Handle different content formats
        if (typeof content === 'string') {
            titleEl.textContent = 'Help';
            contentEl.textContent = content;
        } else if (typeof content === 'object') {
            titleEl.textContent = content.title || 'Help';
            
            // Render text content
            if (content.text) {
                contentEl.innerHTML = this.formatContent(content.text);
            } else if (content.html) {
                contentEl.innerHTML = content.html;
            } else {
                contentEl.textContent = 'No content available';
            }
        }
    }
    
    /**
     * Format content text (convert markdown-like syntax to HTML)
     * @param {string} text - Text to format
     * @returns {string} Formatted HTML
     * @private
     */
    formatContent(text) {
        if (!text) {
            return '';
        }
        
        // Simple formatting: convert line breaks and basic markdown
        let formatted = text
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
        
        return `<p>${formatted}</p>`;
    }
    
    /**
     * Add event listeners for closing tooltip
     * @private
     */
    addEventListeners() {
        // Click outside to close
        setTimeout(() => {
            document.addEventListener('click', this.handleClickOutside);
        }, 0);
        
        // ESC key to close
        document.addEventListener('keydown', this.handleEscapeKey);
    }
    
    /**
     * Remove event listeners
     * @private
     */
    removeEventListeners() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleEscapeKey);
    }
    
    /**
     * Handle click outside tooltip
     * @param {Event} event - Click event
     * @private
     */
    handleClickOutside(event) {
        if (!this.tooltipElement || !this.activeTooltip) {
            return;
        }
        
        // Check if click is outside tooltip and trigger element
        const clickedTooltip = this.tooltipElement.contains(event.target);
        const clickedTrigger = this.triggerElement && this.triggerElement.contains(event.target);
        
        if (!clickedTooltip && !clickedTrigger) {
            this.hide();
        }
    }
    
    /**
     * Handle ESC key press
     * @param {KeyboardEvent} event - Keyboard event
     * @private
     */
    handleEscapeKey(event) {
        if (event.key === 'Escape' && this.activeTooltip) {
            this.hide();
        }
    }
    
    /**
     * Check if tooltip is currently visible
     * @returns {boolean} True if tooltip is visible
     */
    isVisible() {
        return this.activeTooltip !== null;
    }
    
    /**
     * Destroy the tooltip manager and clean up
     */
    destroy() {
        this.hide();
        this.removeEventListeners();
        
        if (this.tooltipElement && this.tooltipElement.parentNode) {
            this.tooltipElement.parentNode.removeChild(this.tooltipElement);
        }
        
        this.tooltipElement = null;
        this.contextEngine = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
}
