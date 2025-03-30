const wordDisplay = document.querySelector(".word-display");
const submitLetterButton = document.querySelector(".submit");
const startDialog = document.querySelector(".start-dialog");
const startDialogButton = startDialog.querySelector("button");
const inputField = document.getElementById("guess");
const guessCountField = document.querySelector(".guess-count");
const errorField = document.querySelector(".error-message");

let guessedLetters = new Set();
let lives = 5;
let outputArray = [];
let secretWord = "";

async function startGame() {
  secretWord = await getRandomWord();
  registerEventListeners();
  startDialog.showModal();
}

function initialiseGameView() {
  // hide the guesses left field
  guessCountField.style.display = "block";
  guessCountField.textContent = `Guesses left: ${lives}`;
}

function clearErrorMessage() {
  errorField.textContent = "";
  errorField.style.display = "none";
}

function updateErrorMessage(message) {
  errorField.textContent = message;
  errorField.style.display = "block";
}

function updateGameView(guessedLetter) {
  clearErrorMessage();

  // show the guesses left field
  guessCountField.style.display = "block";
  guessCountField.textContent = `Guesses left: ${lives}`;
  if (!guessedLetter || guessedLetters.has(guessedLetter)) {
    clearInputField();
    updateErrorMessage("Please enter a valid letter.");
    return;
  }
  guessedLetters.add(guessedLetter);

  if (secretWord.includes(guessedLetter)) {
    updateOutput(guessedLetter);
  } else {
    lives--;

    updateErrorMessage(
      `Incorrect guess! The letter "${guessedLetter}" is not in the word.`
    );

    if (lives === 0) {
      alert("Game over! The word was: " + secretWord);
      resetGame();
    }
  }
  clearInputField();
}

async function getRandomWord() {
  try {
    let response = await fetch(
      "https://gist.githubusercontent.com/Ajanth/88e0347bfa28e738c768c915255d294f/raw/197d991675f592bf5dc9b7e658e821f7a82c8945/hangman.json"
    );
    let data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomWordChosen = data[randomIndex].toLowerCase();
    console.log("Random word chosen: ", randomWordChosen);
    return randomWordChosen;
  } catch (error) {
    console.error(error);
    return "default";
  }
}

function registerEventListeners() {
  startDialogButton.addEventListener("click", (event) => {
    event.preventDefault();
    startDialog.close();
    const wordHalfLength = parseInt(secretWord.length/2); 

    if (wordHalfLength > lives) {
      lives = wordHalfLength;
    }
    outputArray = Array(secretWord.length).fill("-");
    wordDisplay.textContent = outputArray.join("");
    initialiseGameView();
  });

  submitLetterButton.addEventListener("click", (event) => {
    event.preventDefault();
    let guessedLetter = inputField.value.toLowerCase();

    console.log("Guessed letter: ", guessedLetter);

    updateGameView(guessedLetter);
  });
}

/**
 * Updates the output array with the guessed letter.
 * Parameter guessedLetter - The letter guessed by the user.
 */
function updateOutput(guessedLetter) {
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i] === guessedLetter) {
      outputArray[i] = guessedLetter;
    }
  }
  wordDisplay.textContent = outputArray.join("");

  if (!outputArray.includes("-")) {
    alert("Congratulations! You guessed the word: " + secretWord);
    resetGame();
  }
}

function clearInputField() {
  inputField.value = "";
}

function resetGame() {
  guessedLetters.clear();
  startDialog.showModal();
}

startGame();
