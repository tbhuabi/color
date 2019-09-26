import { ColorCMYK, ColorHSL, ColorHSV, ColorRGB } from './help';
import { normalizeAngle, normalizeHex } from './utils';

const RGB_MAX = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

export function rgb2Hsl(color: ColorRGB): ColorHSL {
  let {r, g, b} = color;
  r = (r === RGB_MAX) ? 1 : (r % RGB_MAX / RGB_MAX);
  g = (g === RGB_MAX) ? 1 : (g % RGB_MAX / RGB_MAX);
  b = (b === RGB_MAX) ? 1 : (b % RGB_MAX / RGB_MAX);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
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
    h /= 6;
  }

  return {
    h: Math.round(h * HUE_MAX),
    s: Math.round(s * SV_MAX),
    l: Math.round(l * SV_MAX)
  };
}

export function rgb2Hsv(color: ColorRGB): ColorHSV {
  let {r, g, b} = color;
  r = (r === RGB_MAX) ? 1 : (r % RGB_MAX / RGB_MAX);
  g = (g === RGB_MAX) ? 1 : (g % RGB_MAX / RGB_MAX);
  b = (b === RGB_MAX) ? 1 : (b % RGB_MAX / RGB_MAX);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v = max;

  const d = max - min;

  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
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
    h /= 6;
  }

  return {
    h: Math.round(h * HUE_MAX),
    s: Math.round(s * SV_MAX),
    v: Math.round(v * SV_MAX)
  };
}

export function hsl2Rgb(color: ColorHSL): ColorRGB {
  let {h, s, l} = color;

  function _hue2Rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }

  let r, g, b;

  h = normalizeAngle(h);
  h = (h === HUE_MAX) ? 1 : (h % HUE_MAX / HUE_MAX);
  s = (s === SV_MAX) ? 1 : (s % SV_MAX / SV_MAX);
  l = (l === SV_MAX) ? 1 : (l % SV_MAX / SV_MAX);

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = _hue2Rgb(p, q, h + 1 / 3);
    g = _hue2Rgb(p, q, h);
    b = _hue2Rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * RGB_MAX),
    g: Math.round(g * RGB_MAX),
    b: Math.round(b * RGB_MAX),
  };
}

export function hsv2Rgb(color: ColorHSV): ColorRGB {
  let {h, s, v} = color;
  h = normalizeAngle(h);
  h = (h === HUE_MAX) ? 1 : (h % HUE_MAX / HUE_MAX * 6);
  s = (s === SV_MAX) ? 1 : (s % SV_MAX / SV_MAX);
  v = (v === SV_MAX) ? 1 : (v % SV_MAX / SV_MAX);

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return {
    r: Math.floor(r * RGB_MAX),
    g: Math.floor(g * RGB_MAX),
    b: Math.floor(b * RGB_MAX),
  };
}

export function rgb2Hex(color: ColorRGB): string {
  const {r, g, b} = color;
  let rr = Math.round(r).toString(16);
  let gg = Math.round(g).toString(16);
  let bb = Math.round(b).toString(16);

  rr = rr.length === 1 ? '0' + rr : rr;
  gg = gg.length === 1 ? '0' + gg : gg;
  bb = bb.length === 1 ? '0' + bb : bb;

  return '#' + rr + gg + bb;
}

export function hex2Rgb(color: string): ColorRGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizeHex(color));
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function hsv2Hex(color: ColorHSV): string {
  const rgb = hsv2Rgb(color);
  return rgb2Hex(rgb);
}

export function hex2Hsv(color: string): ColorHSV {
  const rgb = hex2Rgb(normalizeHex(color));
  return rgb2Hsv(rgb);
}

export function hsl2Hex(color: ColorHSL): string {
  const rgb = hsl2Rgb(color);
  return rgb2Hex(rgb)
}

export function hex2Hsl(color: string): ColorHSL {
  const rgb = hex2Rgb(normalizeHex(color));
  return rgb2Hsl(rgb);
}

export function rgb2Cmyk(color: ColorRGB): ColorCMYK {
  const {r, g, b} = color;
  const rprim = r / 255;
  const gprim = g / 255;
  const bprim = b / 255;

  const k = 1 - Math.max(rprim, gprim, bprim);

  const c = (1 - rprim - k) / (1 - k);
  const m = (1 - gprim - k) / (1 - k);
  const y = (1 - bprim - k) / (1 - k);

  return {
    c: +c.toFixed(3),
    m: +m.toFixed(3),
    y: +y.toFixed(3),
    k: +k.toFixed(3)
  };
}

export function cmyk2Rgb({c, m, y, k}: ColorCMYK): ColorRGB {

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.floor(r),
    g: Math.floor(g),
    b: Math.floor(b)
  };
}

export function hsv2Hsl({h, s, v}: ColorHSV): ColorHSL {
  const l = (2 - s) * v / 2;
  if (l !== 0) {
    if (l === SV_MAX) {
      s = 0;
    } else if (l < SV_MAX / 2) {
      s = s * v / (l * 2);
    } else {
      s = s * v / (2 - l * 2);
    }
  }

  return {h, s, l};
}

export function hsl2Hsv(color: ColorHSL): ColorHSV {
  const rgb = hsl2Rgb(color);
  return rgb2Hsv(rgb);
}
