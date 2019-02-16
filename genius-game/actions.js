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

const playSound = (piezo, sound) => {
  piezo.play({
    song: [
      [sound, 1 / 4 ],
    ],
    tempo: 100
  });
};

const blinkStart = (colors, blinkTime) => {
  colors.forEach(color => {
    color.led.blink(blinkTime);
  });
};

const blinkEnd = (colors) => {
  colors.forEach(color => {
    color.led.stop();
    color.led.off();
  });
};

const blinkChallenge = (challenge, blinkTime, interval, piezo) => {
  challenge.forEach((color, index) => {
    console.log('BLINKING:', color.name);
    setTimeout(() => {
      color.led.on(blinkTime);
      if (piezo) {
        playSound(piezo, color.sound);
      }
      setTimeout(() => {
        color.led.off();
      }, blinkTime);
    }, (index * (blinkTime * 2)) + interval);
  });
};

const blinkClick = (color, blinkTime) => {
  color.led.on();
  setTimeout(() => {
    color.led.off();
  }, blinkTime);
};

const challengeCheck = (challenge, position, colorPressed) =>
  (challenge[position].name === colorPressed.name);

module.exports = {
  configLeds,
  configButtons,
  blinkStart,
  blinkEnd,
  blinkChallenge,
  challengeCheck,
  blinkClick,
  playSound,
}