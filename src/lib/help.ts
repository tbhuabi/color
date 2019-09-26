export interface ColorHSL {
  h: number;
  l: number;
  s: number
}

export interface ColorHSV {
  h: number;
  s: number;
  v: number;
}

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorRGBA extends ColorRGB {
  a: number;
}

export interface ColorCMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export type ColorModel = 'hex' | 'rgb' | 'hsv' | 'hsl' | 'cmyk';
