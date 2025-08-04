/**
 * Gradient Engine - Core gradient calculation and CSS generation
 */

export class GradientEngine {
    constructor() {
        this.currentGradient = null;
        this.supportedTypes = ['linear', 'radial', 'conic'];
        this.supportedFormats = ['css', 'scss', 'less'];
    }

    /**
     * Initialize the gradient engine
     */
    init() {
        console.log('🎨 Initializing Gradient Engine...');
    }

    /**
     * Set the current gradient
     */
    setGradient(gradient) {
        this.currentGradient = this.validateGradient(gradient);
        return this.currentGradient;
    }

    /**
     * Get the current gradient
     */
    getCurrentGradient() {
        return this.currentGradient;
    }

    /**
     * Update a gradient property
     */
    updateProperty(property, value) {
        if (!this.currentGradient) {
            throw new Error('No gradient set');
        }

        const updatedGradient = { ...this.currentGradient };

        switch (property) {
            case 'type':
                if (!this.supportedTypes.includes(value)) {
                    throw new Error(`Unsupported gradient type: ${value}`);
                }
                updatedGradient.type = value;
                break;

            case 'angle':
                updatedGradient.angle = this.normalizeAngle(value);
                break;

            case 'position':
                updatedGradient.position = this.validatePosition(value);
                break;

            case 'size':
                updatedGradient.size = this.validateSize(value);
                break;

            case 'colorStops':
                updatedGradient.colorStops = this.validateColorStops(value);
                break;

            case 'repeating':
                updatedGradient.repeating = Boolean(value);
                break;

            default:
                throw new Error(`Unknown property: ${property}`);
        }

        this.currentGradient = updatedGradient;
        return this.currentGradient;
    }

    /**
     * Generate CSS for the current gradient
     */
    generateCSS(format = 'css') {
        if (!this.currentGradient) {
            throw new Error('No gradient set');
        }

        const css = this.buildCSSString(this.currentGradient);
        
        switch (format) {
            case 'css':
                return `background: ${css};`;
            case 'scss':
                return `$gradient: ${css};\nbackground: $gradient;`;
            case 'less':
                return `@gradient: ${css};\nbackground: @gradient;`;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    /**
     * Build CSS string for gradient
     */
    buildCSSString(gradient) {
        const { type, repeating } = gradient;
        const prefix = repeating ? 'repeating-' : '';
        
        switch (type) {
            case 'linear':
                return this.buildLinearGradient(gradient, prefix);
            case 'radial':
                return this.buildRadialGradient(gradient, prefix);
            case 'conic':
                return this.buildConicGradient(gradient, prefix);
            default:
                throw new Error(`Unsupported gradient type: ${type}`);
        }
    }

    /**
     * Build linear gradient CSS
     */
    buildLinearGradient(gradient, prefix = '') {
        const { angle, colorStops } = gradient;
        const direction = this.angleToDirection(angle);
        const stops = this.buildColorStops(colorStops);
        
        return `${prefix}linear-gradient(${direction}, ${stops})`;
    }

    /**
     * Build radial gradient CSS
     */
    buildRadialGradient(gradient, prefix = '') {
        const { position, size, colorStops } = gradient;
        const positionStr = `${position.x}% ${position.y}%`;
        const stops = this.buildColorStops(colorStops);
        
        return `${prefix}radial-gradient(${size} at ${positionStr}, ${stops})`;
    }

    /**
     * Build conic gradient CSS
     */
    buildConicGradient(gradient, prefix = '') {
        const { angle = 0, position, colorStops } = gradient;
        const positionStr = `${position.x}% ${position.y}%`;
        const stops = this.buildColorStops(colorStops);
        
        return `${prefix}conic-gradient(from ${angle}deg at ${positionStr}, ${stops})`;
    }

    /**
     * Build color stops string
     */
    buildColorStops(colorStops) {
        return colorStops
            .sort((a, b) => a.position - b.position)
            .map(stop => {
                const color = this.applyOpacity(stop.color, stop.opacity);
                return `${color} ${stop.position}%`;
            })
            .join(', ');
    }

    /**
     * Convert angle to CSS direction
     */
    angleToDirection(angle) {
        const normalizedAngle = this.normalizeAngle(angle);
        
        // Common directions
        const directions = {
            0: 'to top',
            45: 'to top right',
            90: 'to right',
            135: 'to bottom right',
            180: 'to bottom',
            225: 'to bottom left',
            270: 'to left',
            315: 'to top left'
        };

        return directions[normalizedAngle] || `${normalizedAngle}deg`;
    }

    /**
     * Apply opacity to color
     */
    applyOpacity(color, opacity = 1) {
        if (opacity === 1) return color;

        // Convert hex to rgba if needed
        if (color.startsWith('#')) {
            const rgb = this.hexToRgb(color);
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        }

        // Handle rgb/rgba colors
        if (color.startsWith('rgb')) {
            if (color.startsWith('rgba')) {
                // Replace existing alpha
                return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
            } else {
                // Convert rgb to rgba
                return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
            }
        }

        // Handle hsl/hsla colors
        if (color.startsWith('hsl')) {
            if (color.startsWith('hsla')) {
                return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
            } else {
                return color.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`);
            }
        }

        return color;
    }

    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Normalize angle to 0-360 range
     */
    normalizeAngle(angle) {
        const normalized = ((angle % 360) + 360) % 360;
        return normalized;
    }

    /**
     * Validate gradient object
     */
    validateGradient(gradient) {
        if (!gradient || typeof gradient !== 'object') {
            throw new Error('Invalid gradient object');
        }

        const validated = {
            type: gradient.type || 'linear',
            angle: this.normalizeAngle(gradient.angle || 90),
            position: this.validatePosition(gradient.position || { x: 50, y: 50 }),
            size: this.validateSize(gradient.size || 'farthest-corner'),
            colorStops: this.validateColorStops(gradient.colorStops || []),
            repeating: Boolean(gradient.repeating)
        };

        // Ensure minimum color stops
        if (validated.colorStops.length < 2) {
            validated.colorStops = [
                { position: 0, color: '#ff0000', opacity: 1 },
                { position: 100, color: '#0000ff', opacity: 1 }
            ];
        }

        return validated;
    }

    /**
     * Validate position object
     */
    validatePosition(position) {
        if (!position || typeof position !== 'object') {
            return { x: 50, y: 50 };
        }

        return {
            x: Math.max(0, Math.min(100, Number(position.x) || 50)),
            y: Math.max(0, Math.min(100, Number(position.y) || 50))
        };
    }

    /**
     * Validate size value
     */
    validateSize(size) {
        const validSizes = [
            'closest-side',
            'farthest-side',
            'closest-corner',
            'farthest-corner'
        ];

        return validSizes.includes(size) ? size : 'farthest-corner';
    }

    /**
     * Validate color stops array
     */
    validateColorStops(colorStops) {
        if (!Array.isArray(colorStops)) {
            return [];
        }

        return colorStops
            .map(stop => this.validateColorStop(stop))
            .filter(stop => stop !== null)
            .sort((a, b) => a.position - b.position);
    }

    /**
     * Validate individual color stop
     */
    validateColorStop(stop) {
        if (!stop || typeof stop !== 'object') {
            return null;
        }

        return {
            position: Math.max(0, Math.min(100, Number(stop.position) || 0)),
            color: this.validateColor(stop.color) || '#000000',
            opacity: Math.max(0, Math.min(1, Number(stop.opacity) || 1))
        };
    }

    /**
     * Validate color value
     */
    validateColor(color) {
        if (typeof color !== 'string') {
            return null;
        }

        // Test hex colors
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            return color;
        }

        // Test rgb/rgba colors
        if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
            return color;
        }

        // Test hsl/hsla colors
        if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
            return color;
        }

        // Test named colors (basic set)
        const namedColors = [
            'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink',
            'black', 'white', 'gray', 'brown', 'cyan', 'magenta'
        ];

        if (namedColors.includes(color.toLowerCase())) {
            return color.toLowerCase();
        }

        return null;
    }

    /**
     * Generate gradient variations
     */
    generateVariations(baseGradient) {
        const variations = [];
        
        // Angle variations for linear gradients
        if (baseGradient.type === 'linear') {
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            angles.forEach(angle => {
                if (angle !== baseGradient.angle) {
                    variations.push({
                        ...baseGradient,
                        angle,
                        name: `${baseGradient.name || 'Gradient'} ${angle}°`
                    });
                }
            });
        }

        // Color variations
        const colorVariations = this.generateColorVariations(baseGradient.colorStops);
        colorVariations.forEach((colorStops, index) => {
            variations.push({
                ...baseGradient,
                colorStops,
                name: `${baseGradient.name || 'Gradient'} Variant ${index + 1}`
            });
        });

        return variations;
    }

    /**
     * Generate color variations
     */
    generateColorVariations(colorStops) {
        const variations = [];
        
        // Reverse colors
        const reversed = [...colorStops].reverse().map(stop => ({
            ...stop,
            position: 100 - stop.position
        }));
        variations.push(reversed);

        // Shift hue
        const hueShifted = colorStops.map(stop => ({
            ...stop,
            color: this.shiftHue(stop.color, 60)
        }));
        variations.push(hueShifted);

        return variations;
    }

    /**
     * Shift color hue
     */
    shiftHue(color, degrees) {
        // Convert to HSL, shift hue, convert back
        const hsl = this.colorToHsl(color);
        if (hsl) {
            hsl.h = (hsl.h + degrees) % 360;
            return this.hslToColor(hsl);
        }
        return color;
    }

    /**
     * Convert color to HSL
     */
    colorToHsl(color) {
        // Simplified conversion - would need full implementation
        // This is a placeholder for the concept
        return null;
    }

    /**
     * Convert HSL to color
     */
    hslToColor(hsl) {
        // Simplified conversion - would need full implementation
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    /**
     * Get gradient info
     */
    getGradientInfo(gradient = this.currentGradient) {
        if (!gradient) return null;

        return {
            type: gradient.type,
            colorCount: gradient.colorStops.length,
            hasTransparency: gradient.colorStops.some(stop => stop.opacity < 1),
            isRepeating: gradient.repeating,
            cssLength: this.generateCSS().length,
            complexity: this.calculateComplexity(gradient)
        };
    }

    /**
     * Calculate gradient complexity
     */
    calculateComplexity(gradient) {
        let complexity = 1;
        
        // More color stops = higher complexity
        complexity += gradient.colorStops.length * 0.5;
        
        // Transparency adds complexity
        if (gradient.colorStops.some(stop => stop.opacity < 1)) {
            complexity += 1;
        }
        
        // Repeating adds complexity
        if (gradient.repeating) {
            complexity += 1;
        }
        
        // Non-standard angles/positions add complexity
        if (gradient.type === 'linear' && gradient.angle % 45 !== 0) {
            complexity += 0.5;
        }
        
        return Math.round(complexity * 10) / 10;
    }

    /**
     * Export gradient data
     */
    exportGradientData(gradient = this.currentGradient) {
        if (!gradient) return null;

        return {
            version: '1.0',
            gradient: JSON.parse(JSON.stringify(gradient)),
            css: this.generateCSS(),
            info: this.getGradientInfo(gradient),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Import gradient data
     */
    importGradientData(data) {
        if (!data || !data.gradient) {
            throw new Error('Invalid gradient data');
        }

        return this.setGradient(data.gradient);
    }
}