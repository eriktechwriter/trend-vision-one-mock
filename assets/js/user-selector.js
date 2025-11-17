/**
 * User Type Selector Component
 * Provides a dropdown for switching between user roles
 */

class UserSelector {
    constructor(contextEngine) {
        this.contextEngine = contextEngine;
        this.userTypes = [
            { id: 'admin', label: 'Admin User', description: 'Full system access' },
            { id: 'analyst', label: 'Security Analyst', description: 'Threat investigation' },
            { id: 'ciso', label: 'CISO', description: 'Executive oversight' },
            { id: 'viewer', label: 'Report Viewer', description: 'Read-only access' }
        ];
        this.currentType = this.contextEngine.context.userType || 'admin';
        this.render();
    }
    
    render() {
        const container = document.getElementById('userSelector');
        if (!container) return;
        
        const currentUser = this.userTypes.find(u => u.id === this.currentType);
        
        container.innerHTML = `
            <div class="user-selector">
                <button class="user-selector-button" id="userSelectorButton">
                    <span class="user-icon">👤</span>
                    <span class="user-label">${currentUser.label}</span>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    ${this.userTypes.map(type => `
                        <div class="user-dropdown-item ${type.id === this.currentType ? 'selected' : ''}" 
                             data-type="${type.id}">
                            <strong>${type.label}</strong>
                            <div class="user-dropdown-desc">${type.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.attachEventListeners();
        this.addStyles();
    }
    
    addStyles() {
        // Check if styles already added
        if (document.getElementById('user-selector-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'user-selector-styles';
        style.textContent = `
            .user-selector {
                position: relative;
            }
            
            .user-selector-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background-color: var(--color-bg-tertiary);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-sm);
                color: var(--color-text-primary);
                cursor: pointer;
                font-size: var(--font-size-sm);
                transition: all var(--transition-fast);
            }
            
            .user-selector-button:hover {
                background-color: var(--color-bg-hover);
                border-color: var(--color-border-light);
            }
            
            .user-icon {
                font-size: var(--font-size-lg);
            }
            
            .user-dropdown {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                background-color: var(--color-bg-secondary);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                padding: 8px 0;
                min-width: 220px;
                display: none;
                z-index: var(--z-dropdown);
                box-shadow: var(--shadow-lg);
            }
            
            .user-dropdown.active {
                display: block;
            }
            
            .user-dropdown-item {
                padding: 12px 16px;
                cursor: pointer;
                font-size: var(--font-size-sm);
                transition: background-color var(--transition-fast);
            }
            
            .user-dropdown-item:hover {
                background-color: var(--color-bg-hover);
            }
            
            .user-dropdown-item.selected {
                background-color: var(--tm-red);
                color: var(--color-text-primary);
            }
            
            .user-dropdown-desc {
                font-size: var(--font-size-xs);
                color: var(--color-text-secondary);
                margin-top: 4px;
            }
            
            .user-dropdown-item.selected .user-dropdown-desc {
                color: var(--color-text-primary);
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    attachEventListeners() {
        const button = document.getElementById('userSelectorButton');
        const dropdown = document.getElementById('userDropdown');
        
        if (!button || !dropdown) return;
        
        // Toggle dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!button.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Handle user type selection
        dropdown.querySelectorAll('.user-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const newType = item.dataset.type;
                this.onChange(newType);
                dropdown.classList.remove('active');
            });
        });
    }
    
    onChange(newType) {
        if (newType === this.currentType) return;
        
        this.currentType = newType;
        this.contextEngine.setUserType(newType);
        this.updateDisplay();
        
        console.log('User type changed to:', newType);
    }
    
    updateDisplay() {
        const currentUser = this.userTypes.find(u => u.id === this.currentType);
        const label = document.querySelector('.user-label');
        
        if (label) {
            label.textContent = currentUser.label;
        }
        
        // Update selected state
        document.querySelectorAll('.user-dropdown-item').forEach(item => {
            if (item.dataset.type === this.currentType) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
}
