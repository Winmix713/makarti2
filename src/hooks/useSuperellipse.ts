import { useState } from 'react';
import { oklchToHex } from '../utils/colorUtils';

export type GradientStop = {
  color: string;
  position: number;
};

export type SuperellipseState = {
  width: number;
  height: number;
  radius: number;
  smoothing: number;
  eccentricity: number;
  colorMode: 'solid' | 'linear' | 'radial' | 'conic';
  solidColor: string;
  solidOpacity: number;
  lightness: number;
  gradientAngle: number;
  gradientPosition: string;
  gradientStops: GradientStop[];
  glowEnabled: boolean;
  glowBlur: number;
  glowSpread: number;
  glowColor: string;
  backdropBlur: number;
  blur: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
  glowMaskSize: number;
  glowScale: number;
  glowPositionX: number;
  glowPositionY: number;
  borderEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  strokePosition: 'inside' | 'center' | 'outside';
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  strokeOpacity: number;
  enabled: boolean;
  glowThemeMode: 'dark' | 'light';
};

const DEFAULT_STATE: SuperellipseState = {
  width: 290,
  height: 350,
  radius: 52,
  smoothing: 0,
  eccentricity: 4.0,
  colorMode: 'solid',
  solidColor: '#FF9F00',
  solidOpacity: 100,
  lightness: 78,
  gradientAngle: 135,
  gradientPosition: 'center',
  gradientStops: [
    { color: '#6366F1', position: 0 },
    { color: '#A855F7', position: 50 },
    { color: '#EC4899', position: 100 },
  ],
  glowEnabled: true,
  glowBlur: 20,
  glowSpread: 0,
  glowColor: '#FF9F00',
  backdropBlur: 0,
  blur: 0,
  noiseEnabled: true,
  noiseIntensity: 35,
  glowMaskSize: 0.3,
  glowScale: 0.9,
  glowPositionX: -590,
  glowPositionY: -1070,
  borderEnabled: false,
  strokeColor: '#FFFFFF',
  strokeWidth: 0,
  strokePosition: 'inside',
  strokeStyle: 'solid',
  strokeOpacity: 100,
  enabled: true,
  glowThemeMode: 'dark',
};

export function useSuperellipse() {
  const [state, setState] = useState<SuperellipseState>(DEFAULT_STATE);

  const updateState = (updates: Partial<SuperellipseState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateGradientStop = (
  index: number,
  updates: Partial<GradientStop>) =>
  {
    const newStops = [...state.gradientStops];
    newStops[index] = { ...newStops[index], ...updates };
    updateState({ gradientStops: newStops });
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  const randomizeGlow = () => {
    // Generate random OKLCH values for vibrant colors
    const randomL = 0.6 + Math.random() * 0.3; // 0.6-0.9 lightness
    const randomC = 0.15 + Math.random() * 0.2; // 0.15-0.35 chroma (vibrant)
    const randomH = Math.random() * 360; // full hue range

    const hex = oklchToHex(randomL, randomC, randomH);

    updateState({
      lightness: Math.round(randomL * 100),
      glowColor: hex,
      solidColor: hex,
      glowPositionX: -800 + Math.random() * 450,
      glowPositionY: -1400 + Math.random() * 800,
      glowScale: 0.7 + Math.random() * 2.3
    });
  };

  return {
    state,
    updateState,
    updateGradientStop,
    resetState,
    randomizeGlow
  };
}
