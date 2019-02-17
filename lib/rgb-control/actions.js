const { MODE_SELECT_COLOR, MODE_SELECT_BRIGHTNESS } = require('./modes');

const cicleModes = (mode) => {
  if (mode === MODE_SELECT_COLOR) {
    return MODE_SELECT_BRIGHTNESS;
  }
  return MODE_SELECT_COLOR;
}

module.exports = {
  cicleModes,
};
