/**
 * Preset Manager - Handles gradient presets, templates, and collections
 */

export class PresetManager {
    constructor() {
        this.presets = [];
        this.categories = ['popular', 'nature', 'sunset', 'ocean', 'rainbow', 'monochrome', 'custom'];
        this.customPresets = [];
        this.loadedCategories = new Set();
    }

    /**
     * Initialize preset manager
     */
    async init() {
        console.log('🎨 Initializing Preset Manager...');
        await this.loadBuiltInPresets();
        await this.loadCustomPresets();
    }

    /**
     * Load built-in presets
     */
    async loadBuiltInPresets() {
        try {
            this.presets = this.getBuiltInPresets();
            this.loadedCategories.add('popular');
            console.log(`Loaded ${this.presets.length} built-in presets`);
        } catch (error) {
            console.error('Failed to load built-in presets:', error);
        }
    }

    /**
     * Load custom presets from localStorage
     */
    async loadCustomPresets() {
        try {
            const saved = localStorage.getItem('gradientGenerator_customPresets');
            if (saved) {
                this.customPresets = JSON.parse(saved);
                console.log(`Loaded ${this.customPresets.length} custom presets`);
            }
        } catch (error) {
            console.error('Failed to load custom presets:', error);
            this.customPresets = [];
        }
    }

    /**
     * Get all presets
     */
    getPresets(category = null, limit = null) {
        let allPresets = [...this.presets, ...this.customPresets];

        if (category) {
            allPresets = allPresets.filter(preset => preset.category === category);
        }

        if (limit) {
            allPresets = allPresets.slice(0, limit);
        }

        return allPresets;
    }

    /**
     * Get preset by ID
     */
    getPresetById(id) {
        return [...this.presets, ...this.customPresets].find(preset => preset.id === id);
    }

    /**
     * Add custom preset
     */
    addCustomPreset(gradient, name, category = 'custom') {
        const preset = {
            id: this.generateId(),
            name,
            category,
            type: gradient.type,
            angle: gradient.angle,
            position: gradient.position,
            size: gradient.size,
            colorStops: [...gradient.colorStops],
            repeating: gradient.repeating,
            custom: true,
            created: new Date().toISOString()
        };

        this.customPresets.push(preset);
        this.saveCustomPresets();
        
        return preset;
    }

    /**
     * Remove custom preset
     */
    removeCustomPreset(id) {
        const index = this.customPresets.findIndex(preset => preset.id === id);
        if (index !== -1) {
            const removed = this.customPresets.splice(index, 1)[0];
            this.saveCustomPresets();
            return removed;
        }
        return null;
    }

    /**
     * Update custom preset
     */
    updateCustomPreset(id, updates) {
        const preset = this.customPresets.find(p => p.id === id);
        if (preset) {
            Object.assign(preset, updates, { updated: new Date().toISOString() });
            this.saveCustomPresets();
            return preset;
        }
        return null;
    }

    /**
     * Save custom presets to localStorage
     */
    saveCustomPresets() {
        try {
            localStorage.setItem('gradientGenerator_customPresets', JSON.stringify(this.customPresets));
        } catch (error) {
            console.error('Failed to save custom presets:', error);
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get built-in presets
     */
    getBuiltInPresets() {
        return [
            // Popular gradients
            {
                id: 'sunset-orange',
                name: 'Sunset Orange',
                category: 'popular',
                type: 'linear',
                angle: 45,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff9a9e', opacity: 1 },
                    { position: 100, color: '#fecfef', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'ocean-blue',
                name: 'Ocean Blue',
                category: 'popular',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#2196f3', opacity: 1 },
                    { position: 100, color: '#21cbf3', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'purple-pink',
                name: 'Purple Pink',
                category: 'popular',
                type: 'linear',
                angle: 135,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#667eea', opacity: 1 },
                    { position: 100, color: '#764ba2', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'green-teal',
                name: 'Green Teal',
                category: 'nature',
                type: 'linear',
                angle: 90,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#11998e', opacity: 1 },
                    { position: 100, color: '#38ef7d', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'warm-flame',
                name: 'Warm Flame',
                category: 'sunset',
                type: 'linear',
                angle: 45,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff9a9e', opacity: 1 },
                    { position: 50, color: '#fad0c4', opacity: 1 },
                    { position: 100, color: '#fad0c4', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'night-fade',
                name: 'Night Fade',
                category: 'monochrome',
                type: 'linear',
                angle: 0,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#a18cd1', opacity: 1 },
                    { position: 100, color: '#fbc2eb', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'spring-warmth',
                name: 'Spring Warmth',
                category: 'nature',
                type: 'linear',
                angle: 135,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#fad0c4', opacity: 1 },
                    { position: 100, color: '#ffd1ff', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'juicy-peach',
                name: 'Juicy Peach',
                category: 'sunset',
                type: 'linear',
                angle: 90,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ffecd2', opacity: 1 },
                    { position: 100, color: '#fcb69f', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'young-passion',
                name: 'Young Passion',
                category: 'popular',
                type: 'linear',
                angle: 45,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff8177', opacity: 1 },
                    { position: 50, color: '#ff867a', opacity: 1 },
                    { position: 100, color: '#ff8c7f', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'lady-lips',
                name: 'Lady Lips',
                category: 'popular',
                type: 'linear',
                angle: 135,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff9a9e', opacity: 1 },
                    { position: 100, color: '#f6416c', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'sunny-morning',
                name: 'Sunny Morning',
                category: 'sunset',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#f6d365', opacity: 1 },
                    { position: 100, color: '#fda085', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'rainy-ashville',
                name: 'Rainy Ashville',
                category: 'nature',
                type: 'linear',
                angle: 90,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#fbc2eb', opacity: 1 },
                    { position: 100, color: '#a6c1ee', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'frozen-dreams',
                name: 'Frozen Dreams',
                category: 'ocean',
                type: 'linear',
                angle: 135,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#fdcbf1', opacity: 1 },
                    { position: 100, color: '#e6dee9', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'winter-neva',
                name: 'Winter Neva',
                category: 'ocean',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#a8edea', opacity: 1 },
                    { position: 100, color: '#fed6e3', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'dusty-grass',
                name: 'Dusty Grass',
                category: 'nature',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#d299c2', opacity: 1 },
                    { position: 100, color: '#fef9d7', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'tempting-azure',
                name: 'Tempting Azure',
                category: 'ocean',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#84fab0', opacity: 1 },
                    { position: 100, color: '#8fd3f4', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'heavy-rain',
                name: 'Heavy Rain',
                category: 'monochrome',
                type: 'linear',
                angle: 90,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#cfd9df', opacity: 1 },
                    { position: 100, color: '#e2ebf0', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'amy-crisp',
                name: 'Amy Crisp',
                category: 'popular',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#a6c0fe', opacity: 1 },
                    { position: 100, color: '#f68084', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'mean-fruit',
                name: 'Mean Fruit',
                category: 'sunset',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#fceabb', opacity: 1 },
                    { position: 100, color: '#f8b500', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'deep-blue',
                name: 'Deep Blue',
                category: 'ocean',
                type: 'linear',
                angle: 120,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#6a11cb', opacity: 1 },
                    { position: 100, color: '#2575fc', opacity: 1 }
                ],
                repeating: false
            },
            // Radial gradients
            {
                id: 'radial-sunset',
                name: 'Radial Sunset',
                category: 'sunset',
                type: 'radial',
                angle: 0,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff9a9e', opacity: 1 },
                    { position: 50, color: '#fecfef', opacity: 1 },
                    { position: 100, color: '#fecfef', opacity: 0.5 }
                ],
                repeating: false
            },
            {
                id: 'radial-ocean',
                name: 'Radial Ocean',
                category: 'ocean',
                type: 'radial',
                angle: 0,
                position: { x: 30, y: 30 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#2196f3', opacity: 1 },
                    { position: 70, color: '#21cbf3', opacity: 0.8 },
                    { position: 100, color: '#ffffff', opacity: 0.3 }
                ],
                repeating: false
            },
            // Conic gradients
            {
                id: 'rainbow-wheel',
                name: 'Rainbow Wheel',
                category: 'rainbow',
                type: 'conic',
                angle: 0,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff0000', opacity: 1 },
                    { position: 16.66, color: '#ff8000', opacity: 1 },
                    { position: 33.33, color: '#ffff00', opacity: 1 },
                    { position: 50, color: '#00ff00', opacity: 1 },
                    { position: 66.66, color: '#0080ff', opacity: 1 },
                    { position: 83.33, color: '#8000ff', opacity: 1 },
                    { position: 100, color: '#ff0000', opacity: 1 }
                ],
                repeating: false
            },
            {
                id: 'conic-sunset',
                name: 'Conic Sunset',
                category: 'sunset',
                type: 'conic',
                angle: 45,
                position: { x: 50, y: 50 },
                size: 'farthest-corner',
                colorStops: [
                    { position: 0, color: '#ff9a9e', opacity: 1 },
                    { position: 25, color: '#fad0c4', opacity: 1 },
                    { position: 50, color: '#ffecd2', opacity: 1 },
                    { position: 75, color: '#fcb69f', opacity: 1 },
                    { position: 100, color: '#ff9a9e', opacity: 1 }
                ],
                repeating: false
            }
        ];
    }

    /**
     * Search presets
     */
    searchPresets(query, category = null) {
        const searchTerm = query.toLowerCase();
        let presets = this.getPresets(category);

        return presets.filter(preset => 
            preset.name.toLowerCase().includes(searchTerm) ||
            preset.category.toLowerCase().includes(searchTerm) ||
            preset.type.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Get presets by category
     */
    getPresetsByCategory(category) {
        return this.getPresets(category);
    }

    /**
     * Get popular presets
     */
    getPopularPresets(limit = 12) {
        return this.getPresets('popular', limit);
    }

    /**
     * Get recent custom presets
     */
    getRecentCustomPresets(limit = 6) {
        return this.customPresets
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .slice(0, limit);
    }

    /**
     * Export presets
     */
    exportPresets(presetIds = null) {
        const presetsToExport = presetIds 
            ? this.customPresets.filter(p => presetIds.includes(p.id))
            : this.customPresets;

        return {
            version: '1.0',
            exported: new Date().toISOString(),
            presets: presetsToExport
        };
    }

    /**
     * Import presets
     */
    importPresets(data) {
        try {
            if (!data.presets || !Array.isArray(data.presets)) {
                throw new Error('Invalid preset data format');
            }

            const imported = [];
            data.presets.forEach(preset => {
                // Generate new ID to avoid conflicts
                const newPreset = {
                    ...preset,
                    id: this.generateId(),
                    custom: true,
                    imported: new Date().toISOString()
                };

                this.customPresets.push(newPreset);
                imported.push(newPreset);
            });

            this.saveCustomPresets();
            return imported;
        } catch (error) {
            console.error('Failed to import presets:', error);
            throw error;
        }
    }

    /**
     * Duplicate preset
     */
    duplicatePreset(id) {
        const original = this.getPresetById(id);
        if (!original) return null;

        const duplicate = {
            ...original,
            id: this.generateId(),
            name: `${original.name} (Copy)`,
            custom: true,
            created: new Date().toISOString()
        };

        this.customPresets.push(duplicate);
        this.saveCustomPresets();
        
        return duplicate;
    }

    /**
     * Get preset statistics
     */
    getPresetStats() {
        const total = this.presets.length + this.customPresets.length;
        const byCategory = {};
        const byType = {};

        [...this.presets, ...this.customPresets].forEach(preset => {
            byCategory[preset.category] = (byCategory[preset.category] || 0) + 1;
            byType[preset.type] = (byType[preset.type] || 0) + 1;
        });

        return {
            total,
            builtin: this.presets.length,
            custom: this.customPresets.length,
            byCategory,
            byType
        };
    }

    /**
     * Generate preset thumbnail
     */
    generatePresetThumbnail(preset, size = 60) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Create gradient based on preset
        let gradient;
        switch (preset.type) {
            case 'linear':
                const angle = (preset.angle - 90) * Math.PI / 180;
                const x1 = size / 2 + Math.cos(angle) * size / 2;
                const y1 = size / 2 + Math.sin(angle) * size / 2;
                const x2 = size / 2 - Math.cos(angle) * size / 2;
                const y2 = size / 2 - Math.sin(angle) * size / 2;
                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                break;
            case 'radial':
                gradient = ctx.createRadialGradient(
                    preset.position.x * size / 100, 
                    preset.position.y * size / 100, 
                    0,
                    preset.position.x * size / 100, 
                    preset.position.y * size / 100, 
                    size / 2
                );
                break;
            case 'conic':
                // Conic gradients need special handling or fallback
                gradient = ctx.createLinearGradient(0, 0, size, size);
                break;
            default:
                gradient = ctx.createLinearGradient(0, 0, size, size);
        }

        // Add color stops
        preset.colorStops.forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });

        // Fill canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return canvas.toDataURL();
    }

    /**
     * Validate preset
     */
    validatePreset(preset) {
        const required = ['name', 'type', 'colorStops'];
        const missing = required.filter(field => !preset[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        if (!['linear', 'radial', 'conic'].includes(preset.type)) {
            throw new Error('Invalid gradient type');
        }

        if (!Array.isArray(preset.colorStops) || preset.colorStops.length < 2) {
            throw new Error('At least 2 color stops required');
        }

        return true;
    }

    /**
     * Get preset categories
     */
    getCategories() {
        return this.categories;
    }

    /**
     * Add new category
     */
    addCategory(name) {
        if (!this.categories.includes(name)) {
            this.categories.push(name);
            return true;
        }
        return false;
    }

    /**
     * Load more presets (pagination)
     */
    loadMorePresets(category = null, offset = 0, limit = 12) {
        const presets = this.getPresets(category);
        return presets.slice(offset, offset + limit);
    }

    /**
     * Get preset recommendations
     */
    getRecommendations(currentGradient, limit = 6) {
        // Simple recommendation based on similar colors or types
        const recommendations = [];
        const allPresets = this.getPresets();

        // Filter by same type first
        const sameType = allPresets.filter(p => p.type === currentGradient.type);
        recommendations.push(...sameType.slice(0, Math.floor(limit / 2)));

        // Add different types
        const differentType = allPresets.filter(p => p.type !== currentGradient.type);
        recommendations.push(...differentType.slice(0, limit - recommendations.length));

        return recommendations.slice(0, limit);
    }

    /**
     * Clear all custom presets
     */
    clearCustomPresets() {
        this.customPresets = [];
        this.saveCustomPresets();
    }

    /**
     * Get preset usage statistics
     */
    getUsageStats() {
        try {
            const stats = localStorage.getItem('gradientGenerator_presetStats');
            return stats ? JSON.parse(stats) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * Track preset usage
     */
    trackPresetUsage(presetId) {
        try {
            const stats = this.getUsageStats();
            stats[presetId] = (stats[presetId] || 0) + 1;
            localStorage.setItem('gradientGenerator_presetStats', JSON.stringify(stats));
        } catch (error) {
            console.warn('Failed to track preset usage:', error);
        }
    }
}