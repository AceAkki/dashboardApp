export type RGB = { r: number; g: number; b: number };

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));

// Understands  #1e90ff  #fff  rgb(30, 144, 255)  hsl(210, 100%, 56%)
export function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();

  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(s);
  if (rgb) {
    return { r: clamp(+rgb[1], 255), g: clamp(+rgb[2], 255), b: clamp(+rgb[3], 255) };
  }

  const hsl = /^hsla?\(\s*(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/.exec(s);
  if (hsl) return hslToRgb(+hsl[1], clamp(+hsl[2], 100), clamp(+hsl[3], 100));

  return null;
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    Math.round(255 * (light - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return { r: f(0), g: f(8), b: f(4) };
}

export function toHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export const toRgbString = ({ r, g, b }: RGB) => `rgb(${r}, ${g}, ${b})`;

export function toHslString({ r, g, b }: RGB): string {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
  }
  h = Math.round((h * 60 + 360) % 360);
  return `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
