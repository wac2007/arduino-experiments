const five = require('johnny-five');

const { randomizr } = require('./helpers');
const colors = require('./colors');
const {
  STATE_INIT,
  STATE_GET_NEW_CHALLENGE,
  STATE_SHOW_CHALLENGE,
  STATE_CHECK_USER_INPUT,
  STATE_WAIT_USER_INPUT,
  STATE_IDLE,
} = require('./states');
const {
  configLeds,
  configButtons,
  blinkStart,
  blinkEnd,
  blinkChallenge,
  challengeCheck
} = require('./actions');


const board = new five.Board();

const BASE_BLINK = 500;
const FULL_BLINK = BASE_BLINK * 2;

const INIT_BLINK_TIME = FULL_BLINK * 2;

let COLORS = colors;

let challenge;
let currentState = STATE_INIT; 
let stepCount;
let stepCheck;

const gameOver = () => {
  console.log('####################################');
  console.log('############ GAME OVER #############');
  console.log('####################################');
  currentState = STATE_INIT;
};

const onButtonDown = (color) => ()  => {
  if (currentState === STATE_WAIT_USER_INPUT) {
    const correct = challengeCheck(challenge, stepCheck, color);
    console.log('IsCorrect?', correct);
    if (correct) {
      stepCheck++;
      currentState = STATE_CHECK_USER_INPUT;
    } else {
      gameOver();
    }
  }
};

const initialBlink = () => {
  blinkStart(COLORS);
  setTimeout(() => {
    blinkEnd(COLORS);
    currentState = STATE_GET_NEW_CHALLENGE;
  }, INIT_BLINK_TIME);
  currentState = STATE_IDLE;
};

board.on("ready", function() {
  COLORS = configLeds(COLORS);
  COLORS = configButtons(COLORS);

  this.loop(500, () => {
    switch (currentState) {
      case STATE_INIT:
        COLORS.forEach(color => {
          color.button.removeAllListeners('down');
          color.button.on('down', onButtonDown(color));
        });
        stepCount = 0;
        stepCheck = 0;
        challenge = [];
        initialBlink();
        break;

      case STATE_GET_NEW_CHALLENGE:
        const number = randomizr(0, 3);
        challenge.push(COLORS[number]);
        currentState = STATE_SHOW_CHALLENGE;
        break;

      case STATE_SHOW_CHALLENGE:
        stepCheck = 0;
        console.log('## SHOW CHALLENGE');
        blinkChallenge(challenge, BASE_BLINK);
        currentState = STATE_CHECK_USER_INPUT;
        break;

      case STATE_CHECK_USER_INPUT:
        console.log('## Wait for Input', stepCheck, stepCount);
        if (stepCheck <= stepCount) {
          console.log('### NEW ROUND');
          currentState = STATE_WAIT_USER_INPUT;
        } else {
          console.log('### Acertou tudo!');
          stepCount++;
          currentState = STATE_GET_NEW_CHALLENGE;
        }
        break;
    }
  });

  this.repl.inject({
    COLORS,
    challenge
  });
});
