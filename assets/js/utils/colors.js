// Color conversion and manipulation utilities

function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    
    if (alpha) {
        return (
            "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
        );
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

// Hex转RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function blendColors(hexArray) {
    if (hexArray.length === 0) return "#000000"; // 处理空数组情况
    
    // RGB转HSL
    function rgbToHsl(r, g, b) {
        (r /= 255), (g /= 255), (b /= 255);
        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h,
            s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }
        return [h, s, l];
    }
    
    // HSL转RGB
    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // 灰色
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h / 360 + 1 / 3);
            g = hue2rgb(p, q, h / 360);
            b = hue2rgb(p, q, h / 360 - 1 / 3);
        }
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
        ];
    }
    
    // RGB转Hex
    function rgbToHex(r, g, b) {
        return (
            "#" +
            [r, g, b]
                .map((x) => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                })
                .join("")
        );
    }
    
    // 处理每个Hex颜色
    const hslArray = hexArray.map((hex) => {
        const [r, g, b] = hexToRgb(hex);
        return rgbToHsl(r, g, b);
    });
    
    // 计算平均HSL
    const avgH = hslArray.reduce((acc, [h]) => acc + h, 0) / hslArray.length;
    const avgS = hslArray.reduce((acc, [_, s]) => acc + s, 0) / hslArray.length;
    const avgL = hslArray.reduce((acc, [_, __, l]) => acc + l, 0) / hslArray.length;
    
    // 转回RGB
    const [r, g, b] = hslToRgb(avgH, avgS, avgL);
    return rgbToHex(r, g, b);
}

// Export to window
window.hexToRgba = hexToRgba;
window.hexToRgb = hexToRgb;
window.blendColors = blendColors;
