const five = require('johnny-five');

const configLeds = (colors) => colors.map(color => ({
  ...color,
  led: new five.Led(color.ledPin),
}));

const configButtons = (colors) => colors.map(color => ({
  ...color,
  button: new five.Button({
    pin: color.buttonPin,
    isPullup: true,
  })
}));

const blinkStart = (colors) => {
  colors.forEach(color => {
    color.led.blink(500);
  });
};

const blinkEnd = (colors) => {
  colors.forEach(color => {
    color.led.stop();
    color.led.off();
  });
};

const blinkChallenge = (challenge, blinkTime) => {
  const interval = 500;

  challenge.forEach((color, index) => {
    console.log('BLINKING:', color.name);
    setTimeout(() => {
      color.led.on(blinkTime);
      setTimeout(() => {
        // color.led.stop();
        color.led.off();
      }, blinkTime);
    }, (index * (blinkTime * 2)) + interval);
  });
};

const challengeCheck = (challenge, position, colorPressed) =>
  (challenge[position].name === colorPressed.name);

module.exports = {
  configLeds,
  configButtons,
  blinkStart,
  blinkEnd,
  blinkChallenge,
  challengeCheck
}