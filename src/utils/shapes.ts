// Shared superellipse path generation for both CSS and SVG

export function generateSuperellipsePath(
  width: number,
  height: number,
  smoothing: number
): string {
  if (smoothing === 0) return '';

  const w = width;
  const h = height;
  const n = 2 + smoothing * 10;

  const a = w / 2;
  const b = h / 2;
  const steps = 360;
  let path = 'M ';

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * 2 * Math.PI;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const x = Math.pow(Math.abs(cosTheta), 2 / n) * a * Math.sign(cosTheta) + a;
    const y = Math.pow(Math.abs(sinTheta), 2 / n) * b * Math.sign(sinTheta) + b;

    path += `${x.toFixed(2)} ${y.toFixed(2)}`;
    if (i < steps) path += ' L ';
  }

  path += ' Z';
  return path;
}

export function generateSuperellipsePathAsClipPath(
  width: number,
  height: number,
  smoothing: number
): string {
  const path = generateSuperellipsePath(width, height, smoothing);
  return path ? `path('${path}')` : '';
}

export interface BorderRadiusValue {
  value: number;
  unit: 'px' | '%';
}

export function calculateBorderRadius(
  radius: number,
  width: number,
  height: number
): string {
  const maxRadius = Math.min(width, height) / 2;
  const clampedRadius = Math.min(radius, maxRadius);
  return `${clampedRadius}px`;
}
