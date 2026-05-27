import { useState, useEffect, useRef } from 'react';
import { generateRandomGlow } from '../utils/colorUtils';

const STORAGE_KEY = 'superellipse-state';

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
  const [state, setState] = useState<SuperellipseState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state to localStorage:', e);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state]);

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
    const glowData = generateRandomGlow();
    updateState({
      ...glowData,
      solidColor: glowData.glowColor,
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
