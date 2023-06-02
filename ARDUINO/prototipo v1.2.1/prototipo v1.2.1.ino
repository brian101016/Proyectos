// ################################################################################################ DECLARE PINS
// ################################################################################################

const byte pinLedR = 12; // R LED of RGB pin set
const byte pinLedG = 14; // G LED of RGB pin set
const byte pinLedB = 27; // B LED of RGB pin set - UNUSED

const byte pinA = 32; // A input of multiplexer
const byte pinB = 26; // B input of multiplexer
const byte pinC = 25; // C input of multiplexer
const byte pinD = 33; // D input of multiplexer
const byte pinMultiplexOn = 23; // On/Off multiplexer switch

const byte pinLeftPrev  = 19; // Left-side second last LED (yellow)
const byte pinLeft      = 18; // Left-side final LED (green)
const byte pinRightPrev = 22; // Right-side second last LED (yellow)
const byte pinRight     = 21; // Right-side final LED (green)

const byte pinBuzzer = 13; // Buzzer pin

// ################################################################################################ BUTTONS
// ################################################################################################

// Props: PIN, cooldown, pressed, released
struct Button {
	const byte PIN; // Button PIN to read from
  volatile byte cooldown; // Debounce
	volatile bool pressed; // Whether or not the button has been pressed
  volatile bool released; // whether or not the button has been released
};

Button btnLeft  = {4 , 0, false, false}; // Left-side button
Button btnRight = {16, 0, false, false}; // Right-side button

void IRAM_ATTR handleBtnLeft() {
  if (!btnLeft.cooldown) {
    if (digitalRead(btnLeft.PIN) == HIGH) { // power change to LOW (was HIGH -> button release)
      btnLeft.released = true;
    } else { // power change to HIGH (was LOW -> button press)
      btnLeft.pressed = true;
    }
  }
}

void IRAM_ATTR handleBtnRight() {
  if (!btnRight.cooldown) {  
    if (digitalRead(btnRight.PIN) == HIGH) { // power change to LOW (was HIGH -> button release)
      btnRight.released = true;
    } else { // power change to HIGH (was LOW -> button press)
      btnRight.pressed = true;
    }
  }
}

// ################################################################################################ GAME VARIABLES
// ################################################################################################

// Props: running, score, lives, strikes, removeFlag
struct Game {
  bool running; // Whether or not the actual game is running
  unsigned int score; // Current game score
  byte lives; // 4: green, 3: yellow, 2: red, 1: blinking, 0: over
  byte strikes; // 5 strikes = -1 live, 1 strike = early button press
  bool removeLeft; // Check for 'led catch' on left
  bool removeRight; // Check for 'led catch' on right
};

Game status = {false, 0, 0, 0, false, false}; // Initial data

// ################################################################################################ COUNTER VARIABLES
// ################################################################################################

// Props: count, step, goal
struct Timer {
  byte count; // Variable to increase step by step until the goal
  byte step; // Amount to increment the count by in every 20ms
  byte goal; // Value to reach for (e.g. for a desired 1000ms wait: 1000/20 = x)
};

Timer TLivesBlink = {0, 1, 10};
Timer TLedSpeed = {0, 2, 128};
Timer TBuzzer = {15, 1, 10};

// ################################################################################################ STATUS VARIABLES
// ################################################################################################

unsigned long prevTime = 0; // Tell how many ms have elapsed since last check

byte actualPin = 0x00; // Sequential leds on/off - WILL BE REPLACED BY LIST

// ################################################################################################ SETUP
// ################################################################################################
void setup() {
  // Multiplexor
  pinMode(pinA, OUTPUT);
  pinMode(pinB, OUTPUT);
  pinMode(pinC, OUTPUT);
  pinMode(pinD, OUTPUT);
  pinMode(pinMultiplexOn, OUTPUT);
  // Remaining Pins
  pinMode(pinLeftPrev, OUTPUT);
  pinMode(pinLeft, OUTPUT);
  pinMode(pinRightPrev, OUTPUT);
  pinMode(pinRight, OUTPUT);
  // RGB
  pinMode(pinLedR, OUTPUT);
  pinMode(pinLedG, OUTPUT);
  pinMode(pinLedB, OUTPUT);
  // Buzzer
  pinMode(pinBuzzer, OUTPUT);
  // Buttons
  pinMode(btnRight.PIN, INPUT_PULLUP);
	attachInterrupt(btnRight.PIN, handleBtnRight, CHANGE);
  pinMode(btnLeft.PIN, INPUT_PULLUP);
	attachInterrupt(btnLeft.PIN, handleBtnLeft, CHANGE);

  // RANDOMIZE
  randomSeed(analogRead(35));

  // DEBUG
  Serial.begin(115200);
}
// ################################################################################################ MAKE RGB
// ################################################################################################
void makeRGB(unsigned long color) {
  if (color > 0xffffff) color = 0xffffff;

  const int rr = color / 0x010000;
  const int gg = ((color - (rr * 0x010000)) / 0x000100);
  const int bb = ((color - (rr * 0x010000) - (gg * 0x000100)));

  analogWrite(pinLedR, rr);
  analogWrite(pinLedG, gg);
  analogWrite(pinLedB, bb);
}
// ################################################################################################ MULTIPLEX
// ################################################################################################
void multiplex(byte num) {
  // Max value 0xf
  if (num > 0xf) digitalWrite(pinMultiplexOn, 0);
  else {
    digitalWrite(pinMultiplexOn, 1);
    digitalWrite(pinA, bitRead(num, 0));
    digitalWrite(pinB, bitRead(num, 1));
    digitalWrite(pinC, bitRead(num, 2));
    digitalWrite(pinD, bitRead(num, 3));
  }
}
// ################################################################################################ SELECT LED
// ################################################################################################
void selectLed(byte num, bool izq) {
  multiplex(0xf0); // Apagar el multiplexor
  digitalWrite(pinRightPrev, 0); // Apagar todo
  digitalWrite(pinLeftPrev, 0);
  digitalWrite(pinRight, 0);
  digitalWrite(pinLeft, 0);

  if (num < 8) multiplex(num | (izq << 3));
  else if (num == 8) digitalWrite((izq ? pinLeftPrev : pinRightPrev), 1);
  else if (num == 9) digitalWrite((izq ? pinLeft : pinRight), 1);
}
// ################################################################### SHOW LIVES
// ###################################################################
void showLives() {
  switch (status.lives) {
    case 0: makeRGB(0x000000); break;
    case 1:
      if ((TLivesBlink.count & 0x0f) >= TLivesBlink.goal) {
        TLivesBlink.count &= 0x80; // Reset count to 0
        TLivesBlink.count ^= 0x80; // Flip first bit
      } else TLivesBlink.count += TLivesBlink.step;
      makeRGB(0xff0000 * (TLivesBlink.count >> 7));
      break;
    case 2: makeRGB(0xff0000); TLivesBlink.count = 0; break;
    case 3: makeRGB(0xffff00); break;
    default: makeRGB(0x00ff00); break;
  }
}
// ################################################################### RESTART GAME
// ###################################################################
void toggleGame(bool on) {
  btnLeft.pressed = false;
  btnLeft.released = false;
  btnLeft.cooldown = 8;
  btnRight.pressed = false;
  btnRight.released = false;
  btnRight.cooldown = 8;

  status.lives = on ? 4 : 0;
  status.strikes = 0;
  status.running = on;
  status.score = 0;
  actualPin = 0x00;

  TBuzzer.count = 15;
  TLedSpeed.count = 0;
  TLedSpeed.goal = 128;
  TLivesBlink.count = 0;

  selectLed(15, 0);
  digitalWrite(pinBuzzer, on);
}
// ################################################################################################ LOOP
// ################################################################################################
void loop() {
  // CHECK TIME
  ulong currTime = millis();

  // RUN FRAMES ###################################################################
  if ((currTime - prevTime) >= 20) {
    prevTime = currTime;

    // STEP ###################################################################
    // BUZZER HANDLER ##########################################
    if (TBuzzer.count > 0) {
      TBuzzer.count -= TBuzzer.step;
      digitalWrite(pinBuzzer, 1);
    } else digitalWrite(pinBuzzer, 0);
    // ##########################################

    // RESET BUTTONS COOLDOWN
    if (btnLeft.cooldown > 0) btnLeft.cooldown --;
    if (btnRight.cooldown > 0) btnRight.cooldown --;
    // ###################################################################

    // THE GAME IS NOT ACTIVE ###################################################################
    if (!status.running) {
      if (btnLeft.released || btnRight.released) toggleGame(1); // PRESS START GAME
      else return;
    } // ###################################################################

    // TEMPORAL VARIABLES
    byte pinNum = actualPin & 0x0f; // 0 - 7, 8 & 9 leds in row
    byte leftSide = actualPin & 0x80; // The 7th bit of pinNum, whether its on the left or right row

    // CHECK BUTTONS ###################################################################
    if (btnLeft.pressed || btnLeft.released) {
      Serial.print("Left button has been "); // DEBUG
      Serial.println(btnLeft.pressed ? "pressed" : "released"); // DEBUG
    
      btnLeft.cooldown = 9;
      btnLeft.pressed = false;
      btnLeft.released = false;
      
      // CATCH LED
      if (status.removeLeft) {
        status.removeLeft = false; // Avoid losing a life
        pinNum = 10; // Jump to the next LED...
        TLedSpeed.count = 100; // ...quick
        TBuzzer.count += 3; // Success sound cue
      } else if (leftSide && pinNum > 5) { // Too early
        status.strikes ++;
        TBuzzer.count += 6; // Failure sound cue
      }
    }

    if (btnRight.pressed || btnRight.released) {
      Serial.print("Right button has been "); // DEBUG
      Serial.println(btnRight.pressed ? "pressed" : "released"); // DEBUG
    
      btnRight.cooldown = 9;
      btnRight.pressed = false;
      btnRight.released = false;
      
      // CATCH LED
      if (status.removeRight) {
        status.removeRight = false; // Avoid losing a life
        pinNum = 10; // Jump to the next LED...
        TLedSpeed.count = 100; // ...quick
        TBuzzer.count += 3; // Success sound cue
      } else if (!leftSide && pinNum > 5) { // Too early
        status.strikes ++;
        TBuzzer.count += 6; // Failure sound cue
      }
    } // ###################################################################

    // TURN ON THE NEXT LED ##########################################
    if (TLedSpeed.count >= TLedSpeed.goal) {
      TLedSpeed.count = 0;
      // Serial.printf("%u - %u - %u - %u\n", pinNum, leftSide, status.removeLeft, status.removeRight); // DEBUG

      selectLed(pinNum, leftSide); // Next LED
      
      // CHANGE TO THE OTHER ROW
      if (pinNum >= 10) {

        // Random %50 chance to change row
        actualPin = (random(0, 2) == 0) ? (leftSide ^ 0x80) : leftSide;

        // Lose a life if no button press
        if ((status.removeLeft && leftSide) || (status.removeRight && !leftSide)) {
          status.lives --;
          TBuzzer.count += 12;
        } else { // Grant reward
          if (TLedSpeed.goal > 12) TLedSpeed.goal -= status.lives; // Make harder
          status.score += (5 - status.lives); // Add score
        }

        leftSide ? status.removeLeft = false : status.removeRight = false;

      } else actualPin ++;

      // if near the end (second-last), enable removal
      if (pinNum == 8) leftSide ? status.removeLeft = true : status.removeRight = true;

    } else TLedSpeed.count += (pinNum >= 10) ? TLedSpeed.step : TLedSpeed.step * 3; // Slow down if is the last led (9, green), run normal if is not
    // ##########################################

    // Exchange strikes to lives lost
    if (status.strikes >= 5) {
      status.lives --;
      status.strikes = 0;
      TBuzzer.count += 12; // Failure sound cue
    }

    // THE GAME HAS STOPPED ##########################################################
    if (!status.lives) {
      Serial.print("########---\n# Score: ");
      Serial.print(status.score);
      Serial.println(" !\n########---");

      toggleGame(0);
    } // ##########################################################

    // DRAW
    showLives();
  } // ##########################################################
}
