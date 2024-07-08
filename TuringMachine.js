function createTuringMachine(
  tape = [],
  blankSymbol = " ",
  initialState = "q0",
  finalStates = []
) {
  return {
    tape,
    headPosition: 0,
    blankSymbol,
    currentState: initialState,
    finalStates: new Set(finalStates),
    transitionTable: {},
  };
}

function setTransition(tm, state, symbol, newState, newSymbol, direction) {
  if (!tm.transitionTable[state]) {
    tm.transitionTable[state] = {};
  }
  tm.transitionTable[state][symbol] = { newState, newSymbol, direction };
}

function step(tm) {
  const symbol = tm.tape[tm.headPosition] || tm.blankSymbol;
  const transition = tm.transitionTable[tm.currentState][symbol];

  if (!transition) {
    throw new Error(
      `No transition defined for state ${tm.currentState} and symbol ${symbol}`
    );
  }

  tm.tape[tm.headPosition] = transition.newSymbol;
  tm.currentState = transition.newState;
  tm.headPosition += transition.direction === "R" ? 1 : -1;
}

function run(tm) {
  while (!tm.finalStates.has(tm.currentState)) {
    step(tm);
  }
  return tm.tape;
}

function printTape(tm) {
  console.log(
    `Tape: ${tm.tape.join("")} \nHead Position: ${
      tm.headPosition
    } \nCurrent State: ${tm.currentState}`
  );
}

// Example: Turing machine for incrementing a binary number by one
function createBinaryIncrementMachine(tape) {
  const tm = createTuringMachine(tape, " ", "q0", ["qf"]);

  setTransition(tm, "q0", "1", "q0", "1", "R");
  setTransition(tm, "q0", "0", "q0", "0", "R");
  setTransition(tm, "q0", " ", "q1", " ", "L");
  setTransition(tm, "q1", "0", "qf", "1", "N");
  setTransition(tm, "q1", "1", "q1", "0", "L");
  setTransition(tm, "q1", " ", "qf", "1", "N");

  return tm;
}

// Run the Turing machine to increment a binary number by one
const tape1 = ["1", "0", "1"]; // 101 + 1 = 110
const tm1 = createBinaryIncrementMachine(tape1);
printTape(tm1);
const resultTape1 = run(tm1);
console.log(`Result: ${resultTape1.join("")}`); // Output should be '110'

// Example: Turing machine for computing the complement of a binary number
function createBinaryComplementMachine(tape) {
  const tm = createTuringMachine(tape, " ", "q0", ["qf"]);

  setTransition(tm, "q0", "1", "q0", "0", "R");
  setTransition(tm, "q0", "0", "q0", "1", "R");
  setTransition(tm, "q0", " ", "qf", " ", "N");

  return tm;
}

// Run the Turing machine to compute the complement of a binary number
const tape2 = ["1", "0", "1"]; // Complement of 101 = 010
const tm2 = createBinaryComplementMachine(tape2);
printTape(tm2);
const resultTape2 = run(tm2);
console.log(`Result: ${resultTape2.join("")}`); // Output should be '010'

// Example: Turing machine for adding two binary numbers
function createBinaryAdditionMachine(tape) {
  const tm = createTuringMachine(tape, " ", "q0", ["qf"]);

  // Transitions to move to the right end of the first number
  setTransition(tm, "q0", "1", "q0", "1", "R");
  setTransition(tm, "q0", "0", "q0", "0", "R");
  setTransition(tm, "q0", "+", "q1", "+", "R");

  // Transitions to move to the right end of the second number
  setTransition(tm, "q1", "1", "q1", "1", "R");
  setTransition(tm, "q1", "0", "q1", "0", "R");
  setTransition(tm, "q1", " ", "q2", " ", "L");

  // Transitions to perform addition
  setTransition(tm, "q2", "1", "q2", "0", "L");
  setTransition(tm, "q2", "0", "q3", "1", "L");
  setTransition(tm, "q2", "+", "qf", "+", "N");

  setTransition(tm, "q3", "1", "q2", "1", "L");
  setTransition(tm, "q3", "0", "q3", "0", "L");
  setTransition(tm, "q3", "+", "qf", "+", "N");

  return tm;
}

// Run the Turing machine to add two binary numbers
const tape3 = ["1", "0", "1", "+", "1", "1"]; // 101 + 11 = 1000
const tm3 = createBinaryAdditionMachine(tape3);
printTape(tm3);
const resultTape3 = run(tm3);
console.log(`Result: ${resultTape3.join("")}`); // Output should be '1000'
