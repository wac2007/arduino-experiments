const five = require('johnny-five');

const { MODE_SELECT_COLOR, MODE_SELECT_BRIGHTNESS } = require('./modes');
const { cicleModes } = require('./actions');

const POTENTIOMETER_PIN = 'A0';
const BUTTON_PIN = '13';
const LED_PINS = {
  red: 11,
  green: 10,
  blue: 9,
};

const MAX_VALUE = 1024;
const VALUE_PER_COLOR = MAX_VALUE / PALETTE.length;

const PALETTE = [
  'red',
  'purple',
  'blue',
  'yellow',
  'green'
];

const board = new five.Board();

let currentMode = MODE_SELECT_COLOR;

board.on('ready', function() {
  const led = new five.Led.RGB({
    pins: LED_PINS
  });
  const potentiometer = new five.Pin(POTENTIOMETER_PIN);
  const button = new five.Button({
    pin: BUTTON_PIN,
    isPullup: true,
  });

  led.on();

  button.on('down', () => {
    currentMode = cicleModes(currentMode);
  });

  potentiometer.read(function(error, value) {
    if (error) {
      console.log('##### ERROR: ', error);
    }
    
    switch (currentMode) {
      case MODE_SELECT_COLOR:
        const index = Math.floor((value) / VALUE_PER_COLOR);
        led.color(PALETTE[index]);
        break;
      case MODE_SELECT_BRIGHTNESS:
        const brightness = (value / MAX_VALUE) * 100;
        led.intensity(brightness);
        break;
    }
  });
});
