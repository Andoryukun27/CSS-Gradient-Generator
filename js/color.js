/**
 * Color Manager - Handles color operations, conversions, and color stop management
 */

export class ColorManager {
    constructor() {
        this.colorStops = [];
        this.colorFormats = ['hex', 'rgb', 'hsl', 'hsv'];
        this.namedColors = this.getNamedColors();
    }

    /**
     * Initialize color manager
     */
    init() {
        console.log('🎨 Initializing Color Manager...');
    }

    /**
     * Set color stops
     */
    setColorStops(colorStops) {
        this.colorStops = colorStops.map(stop => this.validateColorStop(stop));
        return this.colorStops;
    }

    /**
     * Get color stops
     */
    getColorStops() {
        return [...this.colorStops];
    }

    /**
     * Add color stop
     */
    addColorStop(position, color, opacity = 1) {
        const colorStop = {
            position: Math.max(0, Math.min(100, position)),
            color: this.validateColor(color) || '#808080',
            opacity: Math.max(0, Math.min(1, opacity))
        };

        this.colorStops.push(colorStop);
        this.sortColorStops();
        return colorStop;
    }

    /**
     * Remove color stop
     */
    removeColorStop(index) {
        if (this.colorStops.length <= 2) {
            throw new Error('Cannot remove color stop: minimum 2 stops required');
        }

        if (index >= 0 && index < this.colorStops.length) {
            const removed = this.colorStops.splice(index, 1)[0];
            return removed;
        }

        throw new Error('Invalid color stop index');
    }

    /**
     * Update color stop
     */
    updateColorStop(index, property, value) {
        if (index < 0 || index >= this.colorStops.length) {
            throw new Error('Invalid color stop index');
        }

        const colorStop = this.colorStops[index];

        switch (property) {
            case 'position':
                colorStop.position = Math.max(0, Math.min(100, value));
                this.sortColorStops();
                break;
            case 'color':
                const validColor = this.validateColor(value);
                if (validColor) {
                    colorStop.color = validColor;
                }
                break;
            case 'opacity':
                colorStop.opacity = Math.max(0, Math.min(1, value));
                break;
            default:
                throw new Error(`Unknown property: ${property}`);
        }

        return colorStop;
    }

    /**
     * Sort color stops by position
     */
    sortColorStops() {
        this.colorStops.sort((a, b) => a.position - b.position);
    }

    /**
     * Validate color stop
     */
    validateColorStop(stop) {
        if (!stop || typeof stop !== 'object') {
            return {
                position: 0,
                color: '#000000',
                opacity: 1
            };
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
            return color.toLowerCase();
        }

        // Test rgb/rgba colors
        if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i.test(color)) {
            return color.toLowerCase();
        }

        // Test hsl/hsla colors
        if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/i.test(color)) {
            return color.toLowerCase();
        }

        // Test named colors
        const lowerColor = color.toLowerCase();
        if (this.namedColors.includes(lowerColor)) {
            return lowerColor;
        }

        return null;
    }

    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Handle 3-digit hex
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        if (hex.length !== 6) {
            return null;
        }

        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        return { r, g, b };
    }

    /**
     * Convert RGB to hex
     */
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * Convert RGB to HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * Convert HSL to RGB
     */
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Convert RGB to HSV
     */
    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let h = 0;
        const s = max === 0 ? 0 : diff / max;
        const v = max;

        if (diff !== 0) {
            switch (max) {
                case r: h = ((g - b) / diff) % 6; break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
            h *= 60;
            if (h < 0) h += 360;
        }

        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    /**
     * Convert HSV to RGB
     */
    hsvToRgb(h, s, v) {
        h /= 360;
        s /= 100;
        v /= 100;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        let r, g, b;

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Parse color string to RGB
     */
    parseColor(color) {
        if (!color) return null;

        // Hex color
        if (color.startsWith('#')) {
            return this.hexToRgb(color);
        }

        // RGB/RGBA color
        const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
        if (rgbMatch) {
            return {
                r: parseInt(rgbMatch[1]),
                g: parseInt(rgbMatch[2]),
                b: parseInt(rgbMatch[3]),
                a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
            };
        }

        // HSL/HSLA color
        const hslMatch = color.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)/i);
        if (hslMatch) {
            const rgb = this.hslToRgb(
                parseInt(hslMatch[1]),
                parseInt(hslMatch[2]),
                parseInt(hslMatch[3])
            );
            return {
                ...rgb,
                a: hslMatch[4] ? parseFloat(hslMatch[4]) : 1
            };
        }

        // Named color
        const namedColor = this.getNamedColorHex(color.toLowerCase());
        if (namedColor) {
            return this.hexToRgb(namedColor);
        }

        return null;
    }

    /**
     * Convert color to different format
     */
    convertColor(color, targetFormat) {
        const rgb = this.parseColor(color);
        if (!rgb) return null;

        switch (targetFormat.toLowerCase()) {
            case 'hex':
                return this.rgbToHex(rgb.r, rgb.g, rgb.b);
            case 'rgb':
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            case 'rgba':
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a || 1})`;
            case 'hsl':
                const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
                return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            case 'hsla':
                const hsla = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
                return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${rgb.a || 1})`;
            case 'hsv':
                const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
                return { h: hsv.h, s: hsv.s, v: hsv.v };
            default:
                return color;
        }
    }

    /**
     * Get color brightness (0-255)
     */
    getColorBrightness(color) {
        const rgb = this.parseColor(color);
        if (!rgb) return 128;

        // Using relative luminance formula
        return Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    }

    /**
     * Check if color is light
     */
    isLightColor(color) {
        return this.getColorBrightness(color) > 128;
    }

    /**
     * Get contrasting color (black or white)
     */
    getContrastingColor(color) {
        return this.isLightColor(color) ? '#000000' : '#ffffff';
    }

    /**
     * Generate color palette
     */
    generatePalette(baseColor, type = 'monochromatic', count = 5) {
        const rgb = this.parseColor(baseColor);
        if (!rgb) return [];

        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];

        switch (type) {
            case 'monochromatic':
                for (let i = 0; i < count; i++) {
                    const lightness = Math.max(10, Math.min(90, hsl.l + (i - Math.floor(count/2)) * 20));
                    const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness);
                    palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                }
                break;

            case 'analogous':
                for (let i = 0; i < count; i++) {
                    const hue = (hsl.h + (i - Math.floor(count/2)) * 30 + 360) % 360;
                    const newRgb = this.hslToRgb(hue, hsl.s, hsl.l);
                    palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                }
                break;

            case 'complementary':
                palette.push(baseColor);
                const compHue = (hsl.h + 180) % 360;
                const compRgb = this.hslToRgb(compHue, hsl.s, hsl.l);
                palette.push(this.rgbToHex(compRgb.r, compRgb.g, compRgb.b));
                break;

            case 'triadic':
                for (let i = 0; i < 3; i++) {
                    const hue = (hsl.h + i * 120) % 360;
                    const newRgb = this.hslToRgb(hue, hsl.s, hsl.l);
                    palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                }
                break;

            case 'tetradic':
                for (let i = 0; i < 4; i++) {
                    const hue = (hsl.h + i * 90) % 360;
                    const newRgb = this.hslToRgb(hue, hsl.s, hsl.l);
                    palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                }
                break;
        }

        return palette;
    }

    /**
     * Interpolate between two colors
     */
    interpolateColors(color1, color2, factor) {
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);

        if (!rgb1 || !rgb2) return color1;

        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

        return this.rgbToHex(r, g, b);
    }

    /**
     * Get color at position in gradient
     */
    getColorAtPosition(position) {
        if (this.colorStops.length === 0) return '#000000';
        if (this.colorStops.length === 1) return this.colorStops[0].color;

        // Sort stops by position
        const sortedStops = [...this.colorStops].sort((a, b) => a.position - b.position);

        // Find surrounding stops
        let beforeStop = sortedStops[0];
        let afterStop = sortedStops[sortedStops.length - 1];

        for (let i = 0; i < sortedStops.length - 1; i++) {
            if (position >= sortedStops[i].position && position <= sortedStops[i + 1].position) {
                beforeStop = sortedStops[i];
                afterStop = sortedStops[i + 1];
                break;
            }
        }

        // If position is exactly on a stop
        if (beforeStop.position === position) return beforeStop.color;
        if (afterStop.position === position) return afterStop.color;

        // Interpolate between stops
        const factor = (position - beforeStop.position) / (afterStop.position - beforeStop.position);
        return this.interpolateColors(beforeStop.color, afterStop.color, factor);
    }

    /**
     * Get named colors
     */
    getNamedColors() {
        return [
            'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black',
            'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
            'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
            'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta',
            'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
            'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue',
            'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
            'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink',
            'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen',
            'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray',
            'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
            'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
            'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
            'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
            'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab',
            'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
            'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
            'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen',
            'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen',
            'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white',
            'whitesmoke', 'yellow', 'yellowgreen'
        ];
    }

    /**
     * Get hex value for named color
     */
    getNamedColorHex(name) {
        const namedColorMap = {
            'red': '#ff0000', 'green': '#008000', 'blue': '#0000ff', 'white': '#ffffff',
            'black': '#000000', 'yellow': '#ffff00', 'cyan': '#00ffff', 'magenta': '#ff00ff',
            'silver': '#c0c0c0', 'gray': '#808080', 'maroon': '#800000', 'olive': '#808000',
            'lime': '#00ff00', 'aqua': '#00ffff', 'teal': '#008080', 'navy': '#000080',
            'fuchsia': '#ff00ff', 'purple': '#800080', 'orange': '#ffa500', 'pink': '#ffc0cb'
        };

        return namedColorMap[name] || null;
    }

    /**
     * Generate random color
     */
    generateRandomColor(format = 'hex') {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        switch (format) {
            case 'hex':
                return this.rgbToHex(r, g, b);
            case 'rgb':
                return `rgb(${r}, ${g}, ${b})`;
            case 'hsl':
                const hsl = this.rgbToHsl(r, g, b);
                return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            default:
                return this.rgbToHex(r, g, b);
        }
    }

    /**
     * Get color harmony
     */
    getColorHarmony(baseColor, harmonyType) {
        return this.generatePalette(baseColor, harmonyType);
    }

    /**
     * Validate color accessibility
     */
    checkColorContrast(color1, color2) {
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);

        if (!rgb1 || !rgb2) return null;

        const getLuminance = (rgb) => {
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const lum1 = getLuminance(rgb1);
        const lum2 = getLuminance(rgb2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        const contrast = (brightest + 0.05) / (darkest + 0.05);

        return {
            ratio: Math.round(contrast * 100) / 100,
            aa: contrast >= 4.5,
            aaa: contrast >= 7,
            aaLarge: contrast >= 3
        };
    }
}