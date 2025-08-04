/**
 * CSS Gradient Generator - Main Application Controller
 * Coordinates all components and manages application state
 */

import { GradientEngine } from './gradient.js';
import { UIController } from './ui.js';
import { ColorManager } from './color.js';
import { ExportSystem } from './export.js';
import { PresetManager } from './presets.js';

class GradientGeneratorApp {
    constructor() {
        this.state = {
            currentGradient: null,
            isInitialized: false,
            activeColorStop: null,
            history: [],
            historyIndex: -1
        };

        // Initialize core components
        this.gradientEngine = new GradientEngine();
        this.uiController = new UIController();
        this.colorManager = new ColorManager();
        this.exportSystem = new ExportSystem();
        this.presetManager = new PresetManager();

        // Bind methods
        this.handleGradientChange = this.handleGradientChange.bind(this);
        this.handleColorStopChange = this.handleColorStopChange.bind(this);
        this.handlePresetSelect = this.handlePresetSelect.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🎨 Initializing CSS Gradient Generator...');

            // Initialize components
            await this.initializeComponents();

            // Set up event listeners
            this.setupEventListeners();

            // Create default gradient
            this.createDefaultGradient();

            // Load presets
            await this.loadPresets();

            // Mark as initialized
            this.state.isInitialized = true;

            console.log('✅ Application initialized successfully');
            this.showToast('Welcome to CSS Gradient Generator!', 'success');

        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        // Initialize gradient engine
        this.gradientEngine.init();

        // Initialize UI controller
        this.uiController.init();

        // Initialize color manager
        this.colorManager.init();

        // Initialize export system
        this.exportSystem.init();

        // Initialize preset manager
        await this.presetManager.init();
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Gradient type changes
        document.addEventListener('gradientTypeChanged', this.handleGradientChange);

        // Gradient property changes
        document.addEventListener('gradientPropertyChanged', this.handleGradientChange);

        // Color stop changes
        document.addEventListener('colorStopChanged', this.handleColorStopChange);
        document.addEventListener('colorStopAdded', this.handleColorStopChange);
        document.addEventListener('colorStopRemoved', this.handleColorStopChange);

        // Preset selection
        document.addEventListener('presetSelected', this.handlePresetSelect);

        // Export actions
        document.addEventListener('exportRequested', this.handleExport);

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Window events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('resize', this.handleWindowResize.bind(this));

        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    /**
     * Create default gradient
     */
    createDefaultGradient() {
        const defaultGradient = {
            type: 'linear',
            angle: 90,
            colorStops: [
                { position: 0, color: '#ff0000', opacity: 1 },
                { position: 100, color: '#0000ff', opacity: 1 }
            ],
            position: { x: 50, y: 50 },
            size: 'farthest-corner',
            repeating: false
        };

        this.setGradient(defaultGradient);
        this.addToHistory(defaultGradient);
    }

    /**
     * Load gradient presets
     */
    async loadPresets() {
        try {
            await this.presetManager.loadPresets();
            this.uiController.updatePresetGrid(this.presetManager.getPresets());
        } catch (error) {
            console.error('Failed to load presets:', error);
            this.showToast('Failed to load presets', 'warning');
        }
    }

    /**
     * Handle gradient changes
     */
    handleGradientChange(event) {
        const { property, value } = event.detail;
        
        try {
            // Update gradient
            this.gradientEngine.updateProperty(property, value);
            
            // Get updated gradient
            const updatedGradient = this.gradientEngine.getCurrentGradient();
            
            // Update state
            this.state.currentGradient = updatedGradient;
            
            // Update UI
            this.updateUI();
            
            // Add to history
            this.addToHistory(updatedGradient);
            
        } catch (error) {
            console.error('Failed to handle gradient change:', error);
            this.showToast('Failed to update gradient', 'error');
        }
    }

    /**
     * Handle color stop changes
     */
    handleColorStopChange(event) {
        const { action, data } = event.detail;
        
        try {
            switch (action) {
                case 'add':
                    this.colorManager.addColorStop(data.position, data.color);
                    break;
                case 'update':
                    this.colorManager.updateColorStop(data.index, data.property, data.value);
                    break;
                case 'remove':
                    this.colorManager.removeColorStop(data.index);
                    break;
            }

            // Update gradient with new color stops
            const colorStops = this.colorManager.getColorStops();
            this.gradientEngine.updateProperty('colorStops', colorStops);
            
            // Update state and UI
            this.state.currentGradient = this.gradientEngine.getCurrentGradient();
            this.updateUI();
            this.addToHistory(this.state.currentGradient);
            
        } catch (error) {
            console.error('Failed to handle color stop change:', error);
            this.showToast('Failed to update color stops', 'error');
        }
    }

    /**
     * Handle preset selection
     */
    handlePresetSelect(event) {
        const { preset } = event.detail;
        
        try {
            this.setGradient(preset);
            this.addToHistory(preset);
            this.showToast(`Applied preset: ${preset.name}`, 'success');
        } catch (error) {
            console.error('Failed to apply preset:', error);
            this.showToast('Failed to apply preset', 'error');
        }
    }

    /**
     * Handle export requests
     */
    handleExport(event) {
        const { format, action } = event.detail;
        
        try {
            const css = this.gradientEngine.generateCSS(format);
            
            if (action === 'copy') {
                this.exportSystem.copyToClipboard(css);
                this.showToast('CSS copied to clipboard!', 'success');
            } else if (action === 'download') {
                this.exportSystem.downloadFile(css, `gradient.${format}`);
                this.showToast('CSS file downloaded!', 'success');
            }
        } catch (error) {
            console.error('Failed to export:', error);
            this.showToast('Failed to export CSS', 'error');
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + Z - Undo
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            this.undo();
        }
        
        // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
        if ((event.ctrlKey || event.metaKey) && 
            ((event.key === 'z' && event.shiftKey) || event.key === 'y')) {
            event.preventDefault();
            this.redo();
        }
        
        // Ctrl/Cmd + C - Copy CSS
        if ((event.ctrlKey || event.metaKey) && event.key === 'c' && 
            !event.target.matches('input, textarea')) {
            event.preventDefault();
            this.handleExport({ detail: { format: 'css', action: 'copy' } });
        }
        
        // Escape - Close modals
        if (event.key === 'Escape') {
            this.uiController.closeAllModals();
        }
    }

    /**
     * Set current gradient
     */
    setGradient(gradient) {
        this.state.currentGradient = gradient;
        this.gradientEngine.setGradient(gradient);
        this.colorManager.setColorStops(gradient.colorStops);
        this.updateUI();
    }

    /**
     * Update all UI components
     */
    updateUI() {
        if (!this.state.currentGradient) return;

        try {
            // Update preview
            this.uiController.updatePreview(this.state.currentGradient);
            
            // Update CSS output
            const css = this.gradientEngine.generateCSS();
            this.uiController.updateCSSOutput(css);
            
            // Update controls
            this.uiController.updateControls(this.state.currentGradient);
            
            // Update color stops UI
            this.uiController.updateColorStops(this.state.currentGradient.colorStops);
            
        } catch (error) {
            console.error('Failed to update UI:', error);
        }
    }

    /**
     * Add gradient to history
     */
    addToHistory(gradient) {
        // Remove any history after current index
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        
        // Add new gradient
        this.state.history.push(JSON.parse(JSON.stringify(gradient)));
        this.state.historyIndex++;
        
        // Limit history size
        const maxHistory = 50;
        if (this.state.history.length > maxHistory) {
            this.state.history.shift();
            this.state.historyIndex--;
        }
        
        // Update UI
        this.uiController.updateHistoryButtons(
            this.state.historyIndex > 0,
            this.state.historyIndex < this.state.history.length - 1
        );
    }

    /**
     * Undo last change
     */
    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            const gradient = this.state.history[this.state.historyIndex];
            this.setGradient(gradient);
            this.uiController.updateHistoryButtons(
                this.state.historyIndex > 0,
                this.state.historyIndex < this.state.history.length - 1
            );
        }
    }

    /**
     * Redo last undone change
     */
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            const gradient = this.state.history[this.state.historyIndex];
            this.setGradient(gradient);
            this.uiController.updateHistoryButtons(
                this.state.historyIndex > 0,
                this.state.historyIndex < this.state.history.length - 1
            );
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        this.uiController.showToast(message, type);
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.uiController.handleResize();
        }, 250);
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload(event) {
        // Save current state to localStorage
        try {
            localStorage.setItem('gradientGenerator_lastState', JSON.stringify({
                gradient: this.state.currentGradient,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to save state:', error);
        }
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        this.showToast('An unexpected error occurred', 'error');
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.showToast('An unexpected error occurred', 'error');
    }

    /**
     * Get current application state
     */
    getState() {
        return {
            ...this.state,
            gradient: this.state.currentGradient,
            css: this.gradientEngine.generateCSS()
        };
    }

    /**
     * Restore application state
     */
    restoreState(state) {
        if (state.gradient) {
            this.setGradient(state.gradient);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create app instance
        window.gradientApp = new GradientGeneratorApp();
        
        // Initialize app
        await window.gradientApp.init();
        
        // Try to restore previous state
        try {
            const savedState = localStorage.getItem('gradientGenerator_lastState');
            if (savedState) {
                const state = JSON.parse(savedState);
                // Only restore if saved within last 24 hours
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    window.gradientApp.restoreState(state);
                }
            }
        } catch (error) {
            console.warn('Failed to restore previous state:', error);
        }
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h2>Failed to Load Application</h2>
            <p>There was an error loading the CSS Gradient Generator. Please refresh the page to try again.</p>
            <button onclick="location.reload()">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Export for testing
export { GradientGeneratorApp };