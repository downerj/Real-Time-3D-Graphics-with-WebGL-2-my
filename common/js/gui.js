// Copied from PacktPublishing's codebase.
export const configureControls = (settings, options = { width: 300 }) => {
  // Check if a gui instance is passed in or create one by default
  const gui = options.gui || new dat.GUI(options);
  const state = {};

  const isAction = v => typeof v === 'function';

  const isFolder = v =>
    !isAction(v) &&
    typeof v === 'object' &&
    (v.value === null || v.value === undefined);

  const isColor = v =>
    (typeof v === 'string' && ~v.indexOf('#')) ||
    (Array.isArray(v) && v.length >= 3);

  Object.keys(settings).forEach(key => {
    const settingValue = settings[key];

    if (isAction(settingValue)) {
      state[key] = settingValue;
      return gui.add(state, key);
    }
    if (isFolder(settingValue)) {
      // If it's a folder, recursively call with folder as root settings element
      return utils.configureControls(settingValue, { gui: gui.addFolder(key) });
    }

    const {
      value,
      min,
      max,
      step,
      options,
      onChange = () => null,
    } = settingValue;

    // set state
    state[key] = value;

    let controller;

    // There are many other values we can set on top of the dat.GUI
    // API, but we'll only need a few for our purposes
    if (options) {
      controller = gui.add(state, key, options);
    }
    else if (isColor(value)) {
      controller = gui.addColor(state, key)
    }
    else {
      controller = gui.add(state, key, min, max, step)
    }

    controller.onChange(v => onChange(v, state))
  });
};
