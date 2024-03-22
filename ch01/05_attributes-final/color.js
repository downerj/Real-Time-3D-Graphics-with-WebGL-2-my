/**
 * @param {number} value
 * @returns {string} 
 */
export const colorChannelToHex = (value) => {
  return Math.floor(value * 255).toString(16).padStart(2, '0');
};

/**
 * @param {[number, number, number, number]} param0
 * @returns {string}
 */
export const colorToRGBHex = ([r, g, b, _a]) => {
  const r1 = colorChannelToHex(r);
  const g1 = colorChannelToHex(g);
  const b1 = colorChannelToHex(b);
  return `#${r1}${g1}${b1}`;
};

/**
 * @param {[number, number, number, number]} color
 * @returns {[number, number, number, number]}
 */
export const normalizeColor = (color) => {
  return color.map(value => value / 255);
};

/**
 * @param {[number, number, number, number]} color 
 * @returns {[number, number, number, number]}
 */
export const denormalizeColor = (color) => {
  return color.map(value => value * 255);
};

/**
 * @returns {[number, number, number, number]}
 */
export const generateRandomColor = () => {
  return [Math.random(), Math.random(), Math.random(), 1.];
};

export class Colors {
  static Black = [0., 0., 0., 1.];
  static Red = [1., 0., 0., 1.];
  static Yellow = [1., 1., 0., 1.];
  static Green = [0., 1., 0., 1.];
  static Cyan = [0., 1., 1., 1.];
  static Blue = [0., 0., 1., 1.];
  static Magenta = [1., 0., 1., 1.];
  static White = [1., 1., 1., 1.];
}
