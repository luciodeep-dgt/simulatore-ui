import distinctColors from 'distinct-colors';

export default class TintGeneratorHelper {


  public static calculate(colorValue: string, quantity = 10) {

    const hsl = this.hexToHsvl(colorValue);
    const palettee = distinctColors({
      count: quantity < 10 ? 10 : quantity,
      hueMin: hsl.h - 10,
      hueMax: hsl.h + 60,
      chromaMin: 40,
      lightMin: 30,
    });

    const colors = palettee.map(c => c.hex());
    return [colorValue].concat(colors);
  }

  public static hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r;
    let g;
    let b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) { t += 1; }
        if (t > 1) { t -= 1; }
        if (t < 1 / 6) { return p + (q - p) * 6 * t; }
        if (t < 1 / 2) { return q; }
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  public static hexToRgba(hex, opacity = 1) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
  }


  public static rgbaToHex(rgba) {
    const trim = (str) => str.replace(/^\s+|\s+$/gm, '');

    const parts = rgba.substring(rgba.indexOf('(')).split(',');
    const r = parseInt(trim(parts[0].substring(1)), 10);
    const g = parseInt(trim(parts[1]), 10);
    const b = parseInt(trim(parts[2]), 10);
    const a: any = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16)).substring(0, 7);
  }

  public static hexToHsvl(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return { h, s, l };
  }

  public static shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    // tslint:disable-next-line:radix
    R = parseInt('' + R * (100 + percent) / 100);
    // tslint:disable-next-line:radix
    G = parseInt('' + G * (100 + percent) / 100);
    // tslint:disable-next-line:radix
    B = parseInt('' + B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16));

    return '#' + RR + GG + BB;
  }

}
