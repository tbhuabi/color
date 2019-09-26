export function normalizeAngle(degrees: number): number {
  return (degrees % 360 + 360) % 360;
}

export function normalizeHex(hex: string): string {
  if (/^#/.test(hex)) {
    hex = hex.substring(1);
  }
  if (hex.length === 3) {
    return '#' + hex.split('').map(ch => ch + ch).join('');
  }
  return '#' + hex;
}
