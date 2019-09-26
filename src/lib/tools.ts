import { cmyk2Rgb, hex2Hsl, hex2Rgb, hsv2Hsl, rgb2Hsl } from './color';
import { ColorHSL, ColorModel, ColorRGB, ColorRGBA } from './help';
import { normalizeHex } from './utils';

export function parseCss(css: string): ColorRGB | ColorRGBA | ColorHSL {
  if (css.indexOf('#') > -1) {
    return hex2Rgb(css);
  }

  const prefix = css.split('(')[0];
  const args = css.split('(')[1].split(')')[0].split(',');

  return prefix.split('').reduce(function (color, param, idx) {
    const nextColor = color;
    nextColor[param] = parseFloat(args[idx]);
    return nextColor
  }, {}) as any;
}

export function hex2Decimal(hexColor: string): number {
  return parseInt(normalizeHex(hexColor).replace('#', ''), 16);
}

export function decimal2Hex(decimalColor: number) {
  return "#" + decimalColor.toString(16)
}

export function random(): string {
  const base = '000000';
  const number = Math.floor(Math.random() * 16777215).toString(16);
  return '#' + (base + number).substr(-6);
}

export function rotateHue(hue: number, amount: number = 0): number {
  const aux = (hue + amount) % 360;
  return aux < 0 ? (360 + aux) : aux;
}

export function getColorEncoding(color: any): ColorModel | 'unknown' {
  if (typeof color === 'string') {
    try {
      hex2Rgb(color);
      return 'hex';
    } catch (err) { /* Silent catch */
    }
  }

  if (typeof color !== 'object') {
    return 'unknown';
  }
  const c = color;

  if ((c.r + c.g + c.b) && typeof (c.r + c.g + c.b) === 'number') {
    return 'rgb';
  }
  if ((c.h + c.s + c.v) && typeof (c.h + c.s + c.v) === 'number') {
    return 'hsv';
  }
  if ((c.h + c.s + c.l) && typeof (c.h + c.s + c.l) === 'number') {
    return 'hsl';
  }
  if ((c.c + c.m + c.y + c.k) && typeof (c.c + c.m + c.y + c.k) === 'number') {
    return 'cmyk';
  }
  return 'unknown';
}

export function any2Hsl(color: any): ColorHSL | 'unknown' {
  const colorEncoding = getColorEncoding(color);

  switch (colorEncoding) {
    case 'hsl':
      return color;
    case 'rgb':
      return rgb2Hsl(color);
    case 'hex':
      return hex2Hsl(color);
    case 'hsv':
      return hsv2Hsl(color);
    case 'cmyk':
      return rgb2Hsl(cmyk2Rgb(color));
    default:
      return 'unknown'
  }
}
