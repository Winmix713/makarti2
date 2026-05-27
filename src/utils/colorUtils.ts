// Color conversion utilities - single source of truth for all color math

// Matrix transformations for OKLCH conversion
const M1 = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

const M2 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
];

const InvM1 = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
];

const InvM2 = [
  [0.9999999985, 0.3963377922, 0.2158037581],
  [1.0000000089, -0.1055613423, -0.0638541748],
  [1.0000000547, -0.0894841821, -1.2914855379],
];

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function sRgbToLinear(c: number): number {
  const abs = Math.abs(c);
  if (abs <= 0.04045) {
    return c / 12.92;
  }
  return (Math.sign(c) || 1) * Math.pow((abs + 0.055) / 1.055, 2.4);
}

function linearToSRgb(c: number): number {
  const abs = Math.abs(c);
  if (abs > 0.0031308) {
    return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
  }
  return 12.92 * c;
}

function multiplyMatrix(matrix: number[][], vector: number[]): number[] {
  return matrix.map((row) => row.reduce((sum, val, i) => sum + val * vector[i], 0));
}

export function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const rLin = sRgbToLinear(rNorm);
  const gLin = sRgbToLinear(gNorm);
  const bLin = sRgbToLinear(bNorm);

  const lms = multiplyMatrix(M1, [rLin, gLin, bLin]);
  const lms_ = lms.map((v) => Math.cbrt(v));
  const lab = multiplyMatrix(M2, lms_);

  const L = lab[0];
  const a = lab[1];
  const b_ = lab[2];

  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { l: L, c: C, h: H };
}

export function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lms_ = multiplyMatrix(InvM2, [l, a, b]);
  const lms = lms_.map((v) => v * v * v);
  const rgb = multiplyMatrix(InvM1, lms);

  const rLin = linearToSRgb(rgb[0]);
  const gLin = linearToSRgb(rgb[1]);
  const bLin = linearToSRgb(rgb[2]);

  return {
    r: Math.round(Math.max(0, Math.min(255, rLin * 255))),
    g: Math.round(Math.max(0, Math.min(255, gLin * 255))),
    b: Math.round(Math.max(0, Math.min(255, bLin * 255))),
  };
}

export function hexToOklch(hex: string): { l: number; c: number; h: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToOklch(rgb.r, rgb.g, rgb.b);
}

export function oklchToHex(l: number, c: number, h: number): string {
  const rgb = oklchToRgb(l, c, h);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function isInGamut(l: number, c: number, h: number): boolean {
  const rgb = oklchToRgb(l, c, h);
  return rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255;
}
