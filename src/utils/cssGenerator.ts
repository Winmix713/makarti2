import { SuperellipseState } from '../hooks/useSuperellipse';
import { hexToRgb } from './colorUtils';
import { generateSuperellipsePathAsClipPath } from './shapes';

export const generateCSS = (state: SuperellipseState): string => {
  const lines: string[] = [];

  // Size
  lines.push(`width: ${state.width}px;`);
  lines.push(`height: ${state.height}px;`);

  // Shape (Border Radius vs Clip Path)
  if (state.smoothing > 0) {
    const path = generateSuperellipsePathAsClipPath(
      state.width,
      state.height,
      state.smoothing
    );
    lines.push(`clip-path: ${path};`);
  } else {
    lines.push(`border-radius: ${state.radius}px;`);
  }

  // Background
  if (state.colorMode === 'solid') {
    if (state.solidOpacity < 100) {
      const rgb = hexToRgb(state.solidColor);
      if (rgb) {
        lines.push(
          `background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${state.solidOpacity / 100});`
        );
      } else {
        lines.push(`background-color: ${state.solidColor};`);
        lines.push(`opacity: ${state.solidOpacity / 100};`);
      }
    } else {
      lines.push(`background-color: ${state.solidColor};`);
    }
  } else {
    // Gradients
    const stopsStr = state.gradientStops.
    map((stop) => `${stop.color} ${stop.position}%`).
    join(', ');

    if (state.colorMode === 'linear') {
      lines.push(
        `background: linear-gradient(${state.gradientAngle}deg, ${stopsStr});`
      );
    } else if (state.colorMode === 'radial') {
      lines.push(
        `background: radial-gradient(circle at ${state.gradientPosition}, ${stopsStr});`
      );
    } else if (state.colorMode === 'conic') {
      lines.push(
        `background: conic-gradient(from ${state.gradientAngle}deg, ${stopsStr});`
      );
    }
  }

  // Effects
  const effects: string[] = [];

  if (state.glowEnabled) {
    effects.push(
      `0 0 ${state.glowBlur}px ${state.glowSpread}px ${state.glowColor}`
    );
  }

  if (effects.length > 0) {
    lines.push(`box-shadow: ${effects.join(', ')};`);
  }

  if (state.backdropBlur > 0) {
    lines.push(`backdrop-filter: blur(${state.backdropBlur}px);`);
  }

  if (state.borderEnabled) {
    lines.push(`border: 1px solid rgba(255, 255, 255, 0.2);`);
  }

  return lines.join('\n');
};
