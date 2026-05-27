import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  hexToOklch,
  oklchToHex,
  rgbToOklch,
  oklchToRgb,
  isInGamut,
} from '../colorUtils';

describe('colorUtils', () => {
  describe('hexToRgb', () => {
    it('converts hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('handles lowercase hex', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('handles hex without #', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('returns null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#GG0000')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    it('clamps values to 0-255', () => {
      expect(rgbToHex(300, -50, 128)).toBe('#ff0080');
    });

    it('pads single-digit hex values', () => {
      expect(rgbToHex(15, 15, 15)).toBe('#0f0f0f');
    });
  });

  describe('OKLCH conversions', () => {
    it('roundtrips hex -> OKLCH -> hex', () => {
      const originalHex = '#FF9F00';
      const oklch = hexToOklch(originalHex);
      expect(oklch).not.toBeNull();
      if (oklch) {
        const convertedHex = oklchToHex(oklch.l, oklch.c, oklch.h);
        // Allow small differences due to rounding
        const originalRgb = hexToRgb(originalHex)!;
        const convertedRgb = hexToRgb(convertedHex)!;
        expect(Math.abs(originalRgb.r - convertedRgb.r)).toBeLessThan(2);
        expect(Math.abs(originalRgb.g - convertedRgb.g)).toBeLessThan(2);
        expect(Math.abs(originalRgb.b - convertedRgb.b)).toBeLessThan(2);
      }
    });

    it('roundtrips RGB -> OKLCH -> RGB', () => {
      const originalRgb = { r: 255, g:159, b: 0 };
      const oklch = rgbToOklch(originalRgb.r, originalRgb.g, originalRgb.b);
      const convertedRgb = oklchToRgb(oklch.l, oklch.c, oklch.h);

      expect(Math.abs(originalRgb.r - convertedRgb.r)).toBeLessThan(2);
      expect(Math.abs(originalRgb.g - convertedRgb.g)).toBeLessThan(2);
      expect(Math.abs(originalRgb.b - convertedRgb.b)).toBeLessThan(2);
    });
  });

  describe('isInGamut', () => {
    it('returns true for colors in sRGB gamut', () => {
      expect(isInGamut(0.6, 0.2, 45)).toBe(true);
      expect(isInGamut(0.5, 0.1, 180)).toBe(true);
    });

    it('returns false for colors outside sRGB gamut', () => {
      // High chroma values may produce out-of-gamut colors
      expect(isInGamut(0.5, 0.5, 45)).toBe(false);
    });
  });
});
