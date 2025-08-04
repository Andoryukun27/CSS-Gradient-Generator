/**
 * UI Controller - Manages user interface interactions and updates
 */

export class UIController {
    constructor() {
        this.elements = {};
        this.state = {
            activeModal: null,
            activeColorStop: null,
            isDragging: false,
            dragData: null
        };
        
        this.debounceTimers = new Map();
    }

    /**
     * Initialize UI controller
     */
    init() {
        console.log('🎛️ Initializing UI Controller...');
        this.cacheElements();
        this.setupEventListeners();
        this.initializeColorStops();
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            // Gradient type controls
            gradientTypeInputs: document.querySelectorAll('input[name="gradient-type"]'),
            
            // Gradient property controls
            angleInput: document.getElementById('gradient-angle'),
            angleValue: document.getElementById('angle-value'),
            radialPositionX: document.getElementById('radial-position-x'),
            radialPositionY: document.getElementById('radial-position-y'),
            radialSize: document.getElementById('radial-size'),
            conicAngle: document.getElementById('conic-angle'),
            conicAngleValue: document.getElementById('conic-angle-value'),
            conicPositionX: document.getElementById('conic-position-x'),
            conicPositionY: document.getElementById('conic-position-y'),
            
            // Position value displays
            posXValue: document.getElementById('pos-x-value'),
            posYValue: document.getElementById('pos-y-value'),
            conicPosXValue: document.getElementById('conic-pos-x-value'),
            conicPosYValue: document.getElementById('conic-pos-y-value'),
            
            // Gradient controls containers
            linearControls: document.querySelector('.gradient-controls--linear'),
            radialControls: document.querySelector('.gradient-controls--radial'),
            conicControls: document.querySelector('.gradient-controls--conic'),
            
            // Color stops
            colorStopsTrack: document.querySelector('.color-stops-track'),
            colorStopsList: document.getElementById('color-stops-list'),
            addColorStopBtn: document.querySelector('.add-color-stop'),
            
            // Preview and output
            previewCanvas: document.getElementById('preview-canvas'),
            cssOutput: document.getElementById('css-output'),
            previewDimensions: document.getElementById('preview-dimensions'),
            
            // Export buttons
            copyBtn: document.getElementById('copy-css'),
            exportBtn: document.getElementById('export-css'),
            
            // Modal
            modal: document.getElementById('color-stop-modal'),
            modalBackdrop: document.querySelector('.modal__backdrop'),
            modalClose: document.querySelector('.modal__close'),
            colorPicker: document.getElementById('color-picker'),
            colorHex: document.getElementById('color-hex'),
            colorPosition: document.getElementById('color-position'),
            positionValue: document.getElementById('position-value'),
            colorOpacity: document.getElementById('color-opacity'),
            opacityValue: document.getElementById('opacity-value'),
            deleteColorStop: document.getElementById('delete-color-stop'),
            cancelEdit: document.getElementById('cancel-edit'),
            saveColorStop: document.getElementById('save-color-stop'),
            
            // Presets
            presetsGrid: document.querySelector('.presets-grid'),
            loadMorePresets: document.querySelector('.load-more-presets'),
            
            // Toast container
            toastContainer: document.getElementById('toast-container')
        };
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Gradient type selection
        this.elements.gradientTypeInputs.forEach(input => {
            input.addEventListener('change', this.handleGradientTypeChange.bind(this));
        });

        // Linear gradient controls
        if (this.elements.angleInput) {
            this.elements.angleInput.addEventListener('input', this.handleAngleChange.bind(this));
        }
        if (this.elements.angleValue) {
            this.elements.angleValue.addEventListener('input', this.handleAngleValueChange.bind(this));
        }

        // Radial gradient controls
        if (this.elements.radialPositionX) {
            this.elements.radialPositionX.addEventListener('input', this.handleRadialPositionChange.bind(this));
        }
        if (this.elements.radialPositionY) {
            this.elements.radialPositionY.addEventListener('input', this.handleRadialPositionChange.bind(this));
        }
        if (this.elements.radialSize) {
            this.elements.radialSize.addEventListener('change', this.handleRadialSizeChange.bind(this));
        }

        // Conic gradient controls
        if (this.elements.conicAngle) {
            this.elements.conicAngle.addEventListener('input', this.handleConicAngleChange.bind(this));
        }
        if (this.elements.conicAngleValue) {
            this.elements.conicAngleValue.addEventListener('input', this.handleConicAngleValueChange.bind(this));
        }
        if (this.elements.conicPositionX) {
            this.elements.conicPositionX.addEventListener('input', this.handleConicPositionChange.bind(this));
        }
        if (this.elements.conicPositionY) {
            this.elements.conicPositionY.addEventListener('input', this.handleConicPositionChange.bind(this));
        }

        // Color stops
        if (this.elements.colorStopsTrack) {
            this.elements.colorStopsTrack.addEventListener('click', this.handleColorStopsTrackClick.bind(this));
        }
        if (this.elements.addColorStopBtn) {
            this.elements.addColorStopBtn.addEventListener('click', this.handleAddColorStop.bind(this));
        }

        // Export buttons
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', this.handleCopyCSS.bind(this));
        }
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', this.handleExportCSS.bind(this));
        }

        // Modal events
        if (this.elements.modalBackdrop) {
            this.elements.modalBackdrop.addEventListener('click', this.closeModal.bind(this));
        }
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', this.closeModal.bind(this));
        }
        if (this.elements.cancelEdit) {
            this.elements.cancelEdit.addEventListener('click', this.closeModal.bind(this));
        }
        if (this.elements.saveColorStop) {
            this.elements.saveColorStop.addEventListener('click', this.handleSaveColorStop.bind(this));
        }
        if (this.elements.deleteColorStop) {
            this.elements.deleteColorStop.addEventListener('click', this.handleDeleteColorStop.bind(this));
        }

        // Color picker events
        if (this.elements.colorPicker) {
            this.elements.colorPicker.addEventListener('input', this.handleColorPickerChange.bind(this));
        }
        if (this.elements.colorHex) {
            this.elements.colorHex.addEventListener('input', this.handleColorHexChange.bind(this));
        }
        if (this.elements.colorPosition) {
            this.elements.colorPosition.addEventListener('input', this.handleColorPositionChange.bind(this));
        }
        if (this.elements.positionValue) {
            this.elements.positionValue.addEventListener('input', this.handlePositionValueChange.bind(this));
        }
        if (this.elements.colorOpacity) {
            this.elements.colorOpacity.addEventListener('input', this.handleColorOpacityChange.bind(this));
        }
        if (this.elements.opacityValue) {
            this.elements.opacityValue.addEventListener('input', this.handleOpacityValueChange.bind(this));
        }

        // Presets
        if (this.elements.loadMorePresets) {
            this.elements.loadMorePresets.addEventListener('click', this.handleLoadMorePresets.bind(this));
        }

        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    /**
     * Handle gradient type change
     */
    handleGradientTypeChange(event) {
        const type = event.target.value;
        this.showGradientControls(type);
        this.dispatchEvent('gradientTypeChanged', { property: 'type', value: type });
    }

    /**
     * Show appropriate gradient controls
     */
    showGradientControls(type) {
        // Hide all controls
        if (this.elements.linearControls) this.elements.linearControls.hidden = true;
        if (this.elements.radialControls) this.elements.radialControls.hidden = true;
        if (this.elements.conicControls) this.elements.conicControls.hidden = true;

        // Show relevant controls
        switch (type) {
            case 'linear':
                if (this.elements.linearControls) this.elements.linearControls.hidden = false;
                break;
            case 'radial':
                if (this.elements.radialControls) this.elements.radialControls.hidden = false;
                break;
            case 'conic':
                if (this.elements.conicControls) this.elements.conicControls.hidden = false;
                break;
        }
    }

    /**
     * Handle angle change
     */
    handleAngleChange(event) {
        const angle = parseInt(event.target.value);
        if (this.elements.angleValue) {
            this.elements.angleValue.value = angle;
        }
        this.updateAngleIndicator(angle);
        this.dispatchEvent('gradientPropertyChanged', { property: 'angle', value: angle });
    }

    /**
     * Handle angle value change
     */
    handleAngleValueChange(event) {
        const angle = parseInt(event.target.value) || 0;
        if (this.elements.angleInput) {
            this.elements.angleInput.value = angle;
        }
        this.updateAngleIndicator(angle);
        this.dispatchEvent('gradientPropertyChanged', { property: 'angle', value: angle });
    }

    /**
     * Update angle indicator
     */
    updateAngleIndicator(angle) {
        const indicator = document.querySelector('.angle-indicator');
        if (indicator) {
            indicator.style.setProperty('--angle', `${angle}deg`);
        }
    }

    /**
     * Handle radial position change
     */
    handleRadialPositionChange(event) {
        const x = parseInt(this.elements.radialPositionX?.value || 50);
        const y = parseInt(this.elements.radialPositionY?.value || 50);
        
        if (this.elements.posXValue) this.elements.posXValue.textContent = x;
        if (this.elements.posYValue) this.elements.posYValue.textContent = y;
        
        this.updatePositionIndicator(x, y);
        this.dispatchEvent('gradientPropertyChanged', { property: 'position', value: { x, y } });
    }

    /**
     * Handle radial size change
     */
    handleRadialSizeChange(event) {
        const size = event.target.value;
        this.dispatchEvent('gradientPropertyChanged', { property: 'size', value: size });
    }

    /**
     * Handle conic angle change
     */
    handleConicAngleChange(event) {
        const angle = parseInt(event.target.value);
        if (this.elements.conicAngleValue) {
            this.elements.conicAngleValue.value = angle;
        }
        this.dispatchEvent('gradientPropertyChanged', { property: 'angle', value: angle });
    }

    /**
     * Handle conic angle value change
     */
    handleConicAngleValueChange(event) {
        const angle = parseInt(event.target.value) || 0;
        if (this.elements.conicAngle) {
            this.elements.conicAngle.value = angle;
        }
        this.dispatchEvent('gradientPropertyChanged', { property: 'angle', value: angle });
    }

    /**
     * Handle conic position change
     */
    handleConicPositionChange(event) {
        const x = parseInt(this.elements.conicPositionX?.value || 50);
        const y = parseInt(this.elements.conicPositionY?.value || 50);
        
        if (this.elements.conicPosXValue) this.elements.conicPosXValue.textContent = x;
        if (this.elements.conicPosYValue) this.elements.conicPosYValue.textContent = y;
        
        this.updatePositionIndicator(x, y);
        this.dispatchEvent('gradientPropertyChanged', { property: 'position', value: { x, y } });
    }

    /**
     * Update position indicator
     */
    updatePositionIndicator(x, y) {
        const indicator = document.querySelector('.position-indicator');
        if (indicator) {
            indicator.style.setProperty('--pos-x', `${x}%`);
            indicator.style.setProperty('--pos-y', `${y}%`);
        }
    }

    /**
     * Initialize color stops
     */
    initializeColorStops() {
        // Create initial color stops
        this.createColorStop(0, '#ff0000', 1, 0);
        this.createColorStop(100, '#0000ff', 1, 100);
    }

    /**
     * Handle color stops track click
     */
    handleColorStopsTrackClick(event) {
        if (event.target.classList.contains('color-stop-handle')) {
            this.openColorStopModal(event.target);
            return;
        }

        // Add new color stop at click position
        const rect = this.elements.colorStopsTrack.getBoundingClientRect();
        const position = ((event.clientX - rect.left) / rect.width) * 100;
        const color = this.interpolateColorAtPosition(position);
        
        this.dispatchEvent('colorStopAdded', {
            action: 'add',
            data: { position: Math.round(position), color }
        });
    }

    /**
     * Handle add color stop
     */
    handleAddColorStop() {
        // Add at 50% position with interpolated color
        const color = this.interpolateColorAtPosition(50);
        this.dispatchEvent('colorStopAdded', {
            action: 'add',
            data: { position: 50, color }
        });
    }

    /**
     * Create color stop element
     */
    createColorStop(position, color, opacity, index) {
        const handle = document.createElement('div');
        handle.className = 'color-stop-handle';
        handle.style.left = `${position}%`;
        handle.style.backgroundColor = color;
        handle.dataset.index = index;
        handle.dataset.position = position;
        handle.dataset.color = color;
        handle.dataset.opacity = opacity;
        handle.tabIndex = 0;
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', `Color stop at ${position}%`);
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.setAttribute('aria-valuenow', position);

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'color-stop-tooltip';
        tooltip.textContent = `${position}%`;
        handle.appendChild(tooltip);

        // Event listeners
        handle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openColorStopModal(handle);
        });

        handle.addEventListener('mousedown', this.startDragging.bind(this));
        handle.addEventListener('keydown', this.handleColorStopKeyDown.bind(this));

        if (this.elements.colorStopsList) {
            this.elements.colorStopsList.appendChild(handle);
        }

        return handle;
    }

    /**
     * Update color stops display
     */
    updateColorStops(colorStops) {
        if (!this.elements.colorStopsList) return;

        // Clear existing stops
        this.elements.colorStopsList.innerHTML = '';

        // Create new stops
        colorStops.forEach((stop, index) => {
            this.createColorStop(stop.position, stop.color, stop.opacity, index);
        });

        // Update background gradient
        this.updateColorStopsBackground(colorStops);
    }

    /**
     * Update color stops background
     */
    updateColorStopsBackground(colorStops) {
        const background = document.querySelector('.color-stops-background');
        if (!background) return;

        const stops = colorStops
            .sort((a, b) => a.position - b.position)
            .map(stop => `${stop.color} ${stop.position}%`)
            .join(', ');

        background.style.background = `linear-gradient(90deg, ${stops})`;
    }

    /**
     * Interpolate color at position
     */
    interpolateColorAtPosition(position) {
        // Simple interpolation - would need more sophisticated implementation
        return '#808080'; // Gray as placeholder
    }

    /**
     * Start dragging color stop
     */
    startDragging(event) {
        event.preventDefault();
        this.state.isDragging = true;
        this.state.dragData = {
            element: event.target,
            startX: event.clientX,
            startPosition: parseFloat(event.target.dataset.position)
        };

        document.addEventListener('mousemove', this.handleDragging.bind(this));
        document.addEventListener('mouseup', this.stopDragging.bind(this));
    }

    /**
     * Handle dragging
     */
    handleDragging(event) {
        if (!this.state.isDragging || !this.state.dragData) return;

        const rect = this.elements.colorStopsTrack.getBoundingClientRect();
        const position = ((event.clientX - rect.left) / rect.width) * 100;
        const clampedPosition = Math.max(0, Math.min(100, position));

        this.state.dragData.element.style.left = `${clampedPosition}%`;
        this.state.dragData.element.dataset.position = clampedPosition;
        
        const tooltip = this.state.dragData.element.querySelector('.color-stop-tooltip');
        if (tooltip) {
            tooltip.textContent = `${Math.round(clampedPosition)}%`;
        }
    }

    /**
     * Stop dragging
     */
    stopDragging(event) {
        if (!this.state.isDragging || !this.state.dragData) return;

        const finalPosition = parseFloat(this.state.dragData.element.dataset.position);
        const index = parseInt(this.state.dragData.element.dataset.index);

        this.dispatchEvent('colorStopChanged', {
            action: 'update',
            data: { index, property: 'position', value: finalPosition }
        });

        this.state.isDragging = false;
        this.state.dragData = null;

        document.removeEventListener('mousemove', this.handleDragging.bind(this));
        document.removeEventListener('mouseup', this.stopDragging.bind(this));
    }

    /**
     * Handle color stop key down
     */
    handleColorStopKeyDown(event) {
        const position = parseFloat(event.target.dataset.position);
        const index = parseInt(event.target.dataset.index);
        let newPosition = position;

        switch (event.key) {
            case 'ArrowLeft':
                newPosition = Math.max(0, position - (event.shiftKey ? 10 : 1));
                break;
            case 'ArrowRight':
                newPosition = Math.min(100, position + (event.shiftKey ? 10 : 1));
                break;
            case 'Enter':
            case ' ':
                this.openColorStopModal(event.target);
                return;
            case 'Delete':
            case 'Backspace':
                this.dispatchEvent('colorStopChanged', {
                    action: 'remove',
                    data: { index }
                });
                return;
        }

        if (newPosition !== position) {
            event.preventDefault();
            this.dispatchEvent('colorStopChanged', {
                action: 'update',
                data: { index, property: 'position', value: newPosition }
            });
        }
    }

    /**
     * Open color stop modal
     */
    openColorStopModal(handle) {
        if (!this.elements.modal) return;

        this.state.activeColorStop = handle;
        const color = handle.dataset.color;
        const position = parseFloat(handle.dataset.position);
        const opacity = parseFloat(handle.dataset.opacity);

        // Set modal values
        if (this.elements.colorPicker) this.elements.colorPicker.value = color;
        if (this.elements.colorHex) this.elements.colorHex.value = color;
        if (this.elements.colorPosition) this.elements.colorPosition.value = position;
        if (this.elements.positionValue) this.elements.positionValue.value = position;
        if (this.elements.colorOpacity) this.elements.colorOpacity.value = opacity * 100;
        if (this.elements.opacityValue) this.elements.opacityValue.value = opacity * 100;

        // Show modal
        this.elements.modal.setAttribute('aria-hidden', 'false');
        this.elements.modal.classList.add('fade-in');
        
        // Focus first input
        setTimeout(() => {
            if (this.elements.colorPicker) this.elements.colorPicker.focus();
        }, 100);
    }

    /**
     * Close modal
     */
    closeModal() {
        if (!this.elements.modal) return;

        this.elements.modal.setAttribute('aria-hidden', 'true');
        this.elements.modal.classList.remove('fade-in');
        this.state.activeColorStop = null;
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        this.closeModal();
    }

    /**
     * Handle color picker change
     */
    handleColorPickerChange(event) {
        const color = event.target.value;
        if (this.elements.colorHex) {
            this.elements.colorHex.value = color;
        }
    }

    /**
     * Handle color hex change
     */
    handleColorHexChange(event) {
        const color = event.target.value;
        if (this.elements.colorPicker && /^#[0-9A-Fa-f]{6}$/.test(color)) {
            this.elements.colorPicker.value = color;
        }
    }

    /**
     * Handle color position change
     */
    handleColorPositionChange(event) {
        const position = parseInt(event.target.value);
        if (this.elements.positionValue) {
            this.elements.positionValue.value = position;
        }
    }

    /**
     * Handle position value change
     */
    handlePositionValueChange(event) {
        const position = parseInt(event.target.value);
        if (this.elements.colorPosition) {
            this.elements.colorPosition.value = position;
        }
    }

    /**
     * Handle color opacity change
     */
    handleColorOpacityChange(event) {
        const opacity = parseInt(event.target.value);
        if (this.elements.opacityValue) {
            this.elements.opacityValue.value = opacity;
        }
    }

    /**
     * Handle opacity value change
     */
    handleOpacityValueChange(event) {
        const opacity = parseInt(event.target.value);
        if (this.elements.colorOpacity) {
            this.elements.colorOpacity.value = opacity;
        }
    }

    /**
     * Handle save color stop
     */
    handleSaveColorStop() {
        if (!this.state.activeColorStop) return;

        const color = this.elements.colorHex?.value || '#000000';
        const position = parseInt(this.elements.positionValue?.value || 0);
        const opacity = parseInt(this.elements.opacityValue?.value || 100) / 100;
        const index = parseInt(this.state.activeColorStop.dataset.index);

        this.dispatchEvent('colorStopChanged', {
            action: 'update',
            data: { index, property: 'color', value: color }
        });
        this.dispatchEvent('colorStopChanged', {
            action: 'update',
            data: { index, property: 'position', value: position }
        });
        this.dispatchEvent('colorStopChanged', {
            action: 'update',
            data: { index, property: 'opacity', value: opacity }
        });

        this.closeModal();
    }

    /**
     * Handle delete color stop
     */
    handleDeleteColorStop() {
        if (!this.state.activeColorStop) return;

        const index = parseInt(this.state.activeColorStop.dataset.index);
        this.dispatchEvent('colorStopChanged', {
            action: 'remove',
            data: { index }
        });

        this.closeModal();
    }

    /**
     * Handle copy CSS
     */
    handleCopyCSS() {
        this.dispatchEvent('exportRequested', { format: 'css', action: 'copy' });
    }

    /**
     * Handle export CSS
     */
    handleExportCSS() {
        this.dispatchEvent('exportRequested', { format: 'css', action: 'download' });
    }

    /**
     * Handle load more presets
     */
    handleLoadMorePresets() {
        this.dispatchEvent('loadMorePresets');
    }

    /**
     * Handle key down
     */
    handleKeyDown(event) {
        // Handle modal escape
        if (event.key === 'Escape' && this.state.activeModal) {
            this.closeModal();
        }
    }

    /**
     * Update preview
     */
    updatePreview(gradient) {
        if (!this.elements.previewCanvas) return;

        const css = this.buildPreviewCSS(gradient);
        this.elements.previewCanvas.style.setProperty('--gradient', css);
        
        // Update preview canvas background
        const beforeElement = this.elements.previewCanvas;
        if (beforeElement) {
            beforeElement.style.background = css;
        }
    }

    /**
     * Build preview CSS
     */
    buildPreviewCSS(gradient) {
        // This would use the gradient engine to build CSS
        // Simplified for now
        const stops = gradient.colorStops
            .sort((a, b) => a.position - b.position)
            .map(stop => `${stop.color} ${stop.position}%`)
            .join(', ');

        switch (gradient.type) {
            case 'linear':
                return `linear-gradient(${gradient.angle}deg, ${stops})`;
            case 'radial':
                return `radial-gradient(${gradient.size} at ${gradient.position.x}% ${gradient.position.y}%, ${stops})`;
            case 'conic':
                return `conic-gradient(from ${gradient.angle || 0}deg at ${gradient.position.x}% ${gradient.position.y}%, ${stops})`;
            default:
                return `linear-gradient(90deg, ${stops})`;
        }
    }

    /**
     * Update CSS output
     */
    updateCSSOutput(css) {
        if (!this.elements.cssOutput) return;

        this.elements.cssOutput.textContent = css;
        this.highlightCSSSyntax();
    }

    /**
     * Highlight CSS syntax
     */
    highlightCSSSyntax() {
        // Simple syntax highlighting
        if (!this.elements.cssOutput) return;

        let html = this.elements.cssOutput.textContent;
        
        // Highlight properties
        html = html.replace(/(background|background-image):/g, '<span class="css-property">$1</span>:');
        
        // Highlight functions
        html = html.replace(/(linear-gradient|radial-gradient|conic-gradient)/g, '<span class="css-function">$1</span>');
        
        // Highlight colors
        html = html.replace(/#[0-9A-Fa-f]{6}/g, '<span class="css-color">$&</span>');
        html = html.replace(/rgba?\([^)]+\)/g, '<span class="css-color">$&</span>');
        
        this.elements.cssOutput.innerHTML = html;
    }

    /**
     * Update controls
     */
    updateControls(gradient) {
        // Update gradient type
        const typeInput = document.querySelector(`input[name="gradient-type"][value="${gradient.type}"]`);
        if (typeInput) {
            typeInput.checked = true;
            this.showGradientControls(gradient.type);
        }

        // Update angle for linear/conic
        if (gradient.type === 'linear' || gradient.type === 'conic') {
            const angleInput = gradient.type === 'linear' ? this.elements.angleInput : this.elements.conicAngle;
            const angleValue = gradient.type === 'linear' ? this.elements.angleValue : this.elements.conicAngleValue;
            
            if (angleInput) angleInput.value = gradient.angle || 0;
            if (angleValue) angleValue.value = gradient.angle || 0;
            
            if (gradient.type === 'linear') {
                this.updateAngleIndicator(gradient.angle || 0);
            }
        }

        // Update position for radial/conic
        if (gradient.type === 'radial' || gradient.type === 'conic') {
            const posXInput = gradient.type === 'radial' ? this.elements.radialPositionX : this.elements.conicPositionX;
            const posYInput = gradient.type === 'radial' ? this.elements.radialPositionY : this.elements.conicPositionY;
            const posXValue = gradient.type === 'radial' ? this.elements.posXValue : this.elements.conicPosXValue;
            const posYValue = gradient.type === 'radial' ? this.elements.posYValue : this.elements.conicPosYValue;
            
            if (posXInput) posXInput.value = gradient.position.x;
            if (posYInput) posYInput.value = gradient.position.y;
            if (posXValue) posXValue.textContent = gradient.position.x;
            if (posYValue) posYValue.textContent = gradient.position.y;
            
            this.updatePositionIndicator(gradient.position.x, gradient.position.y);
        }

        // Update size for radial
        if (gradient.type === 'radial' && this.elements.radialSize) {
            this.elements.radialSize.value = gradient.size;
        }
    }

    /**
     * Update preset grid
     */
    updatePresetGrid(presets) {
        if (!this.elements.presetsGrid) return;

        this.elements.presetsGrid.innerHTML = '';
        
        presets.forEach((preset, index) => {
            const item = document.createElement('div');
            item.className = 'preset-item';
            item.dataset.presetId = preset.id || index;
            item.setAttribute('data-tooltip', preset.name);
            item.style.setProperty('--preset-gradient', this.buildPreviewCSS(preset));
            
            item.addEventListener('click', () => {
                this.dispatchEvent('presetSelected', { preset });
            });
            
            this.elements.presetsGrid.appendChild(item);
        });
    }

    /**
     * Update history buttons
     */
    updateHistoryButtons(canUndo, canRedo) {
        // Update undo/redo button states if they exist
        const undoBtn = document.querySelector('.undo-btn');
        const redoBtn = document.querySelector('.redo-btn');
        
        if (undoBtn) {
            undoBtn.disabled = !canUndo;
            undoBtn.setAttribute('aria-disabled', !canUndo);
        }
        
        if (redoBtn) {
            redoBtn.disabled = !canRedo;
            redoBtn.setAttribute('aria-disabled', !canRedo);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        if (!this.elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type} fade-in`;
        
        const icon = this.getToastIcon(type);
        const title = this.getToastTitle(type);
        
        toast.innerHTML = `
            <div class="toast__icon">${icon}</div>
            <div class="toast__content">
                <div class="toast__title">${title}</div>
                <div class="toast__message">${message}</div>
            </div>
            <button class="toast__close" aria-label="Close notification">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.toast__close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });

        // Auto remove after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        this.elements.toastContainer.appendChild(toast);
    }

    /**
     * Get toast icon
     */
    getToastIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-success)">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-error)">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-warning)">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-info)">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Get toast title
     */
    getToastTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        
        return titles[type] || 'Notification';
    }

    /**
     * Remove toast
     */
    removeToast(toast) {
        if (toast && toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update preview dimensions
        if (this.elements.previewCanvas && this.elements.previewDimensions) {
            const rect = this.elements.previewCanvas.getBoundingClientRect();
            this.elements.previewDimensions.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
        }

        // Recalculate color stop positions if needed
        this.recalculateColorStops();
    }

    /**
     * Recalculate color stops
     */
    recalculateColorStops() {
        const handles = this.elements.colorStopsList?.querySelectorAll('.color-stop-handle');
        if (!handles) return;

        handles.forEach(handle => {
            const position = parseFloat(handle.dataset.position);
            handle.style.left = `${position}%`;
        });
    }

    /**
     * Debounce function calls
     */
    debounce(key, func, delay = 300) {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(func, delay);
        this.debounceTimers.set(key, timer);
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Get element safely
     */
    getElement(selector) {
        return document.querySelector(selector);
    }

    /**
     * Get elements safely
     */
    getElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(element, event, handler, options = {}) {
        if (!element) return;
        
        element.addEventListener(event, handler, options);
        
        // Track for cleanup
        if (!this.eventListeners) {
            this.eventListeners = [];
        }
        
        this.eventListeners.push({
            element,
            event,
            handler,
            options
        });
    }

    /**
     * Clean up event listeners
     */
    cleanup() {
        if (this.eventListeners) {
            this.eventListeners.forEach(({ element, event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
            this.eventListeners = [];
        }
        
        // Clear debounce timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
    }

    /**
     * Initialize accessibility features
     */
    initializeAccessibility() {
        // Add ARIA live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Announce gradient changes
        document.addEventListener('gradientPropertyChanged', (event) => {
            const { property, value } = event.detail;
            this.announceChange(`${property} changed to ${value}`);
        });
    }

    /**
     * Announce change to screen readers
     */
    announceChange(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Focus management
     */
    manageFocus(element) {
        if (!element) return;
        
        element.focus();
        
        // Ensure element is visible
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    /**
     * Trap focus within element
     */
    trapFocus(container) {
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        
        // Focus first element
        if (firstElement) {
            firstElement.focus();
        }

        // Return cleanup function
        return () => {
            container.removeEventListener('keydown', handleTabKey);
        };
    }
}