import { useMemo } from 'react';
import { hexToRgb, rgbToHex, hexToOklch, oklchToHex, rgbToOklch, oklchToRgb } from '../utils/colorUtils';

export function useColorConversion() {
  return useMemo(
    () => ({
      hexToRgb,
      rgbToHex,
      hexToOklch,
      oklchToHex,
      rgbToOklch,
      oklchToRgb,
    }),
    []
  );
}
