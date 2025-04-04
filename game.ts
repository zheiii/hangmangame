const wordDisplay = document.querySelector(".word-display") as HTMLDivElement | null;
const submitLetterButton = document.querySelector(".submit") as HTMLButtonElement | null;
const startDialog = document.querySelector(".start-dialog") as HTMLDialogElement | null;
const startDialogButton = startDialog?.querySelector("button") as HTMLButtonElement | null;
const inputField = document.getElementById("guess") as HTMLInputElement | null;
const guessCountField = document.querySelector(".guess-count") as HTMLDivElement | null;
const errorField = document.querySelector(".error-message")as HTMLDivElement | null;

let guessedLetters: Set<string> = new Set<string>();
let lives: number = 5;
let outputArray: string[] = [];
let secretWord: string = "";

async function startGame(): Promise<void> {
  secretWord = await getRandomWord();
  registerEventListeners();
  startDialog?.showModal();
}

function initialiseGameView(): void {
  // hide the guesses left field
  if (guessCountField) {
    guessCountField.style.display = "block";
    guessCountField.textContent = `Guesses left: ${lives}`;
  };
};

function clearErrorMessage(): void {
    if (errorField) {
        errorField.textContent = "";
        errorField.style.display = "none";
    };
};

function updateErrorMessage(message: string): void{
    if (errorField) {
        errorField.textContent = message;
        errorField.style.display = "block";
    };
};

function updateGameView(guessedLetter: string | undefined): void {
  clearErrorMessage();

  // show the guesses left field
  if (guessCountField) guessCountField.style.display = "block";


  if (!guessedLetter || guessedLetters.has(guessedLetter)) {
    clearInputField();
    updateErrorMessage("Please enter a valid letter.");
    if (guessCountField) guessCountField.textContent = `Guesses left: ${lives}`;
    return;
  }
  guessedLetters.add(guessedLetter);

  if (secretWord.includes(guessedLetter)) {
    updateOutput(guessedLetter);
  } else {
    lives--;
    console.log(lives-1)
    updateErrorMessage(
      `Incorrect guess! The letter "${guessedLetter}" is not in the word.`
    );
    if (guessCountField) guessCountField.textContent = `Guesses left: ${lives}`;

    if (lives === 0) {
      alert("Game over! The word was: " + secretWord);
      resetGame();
    }
  }
  clearInputField();
}

async function getRandomWord(): Promise<string> {
  try {
    let response: Response = await fetch(
      "https://gist.githubusercontent.com/Ajanth/88e0347bfa28e738c768c915255d294f/raw/197d991675f592bf5dc9b7e658e821f7a82c8945/hangman.json"
    );
    let data: string[] = await response.json();
    const randomIndex: number = Math.floor(Math.random() * data.length);
    const randomWordChosen: string = data[randomIndex].toLowerCase();
    console.log("Random word chosen: ", randomWordChosen);
    return randomWordChosen;
  } catch (error) {
    console.error(error);
    return "default";
  }
}

function registerEventListeners(): void {
  startDialogButton?.addEventListener("click", (event: Event) => {
    event.preventDefault();
    startDialog?.close();
    const wordHalfLength: number = parseInt((secretWord.length/2).toString()); 

    if (wordHalfLength > lives) {
      lives = wordHalfLength;
    }
    outputArray = Array(secretWord.length).fill("-");
    if (wordDisplay) wordDisplay.textContent = outputArray.join("");
    initialiseGameView();
  });

  submitLetterButton?.addEventListener("click", (event: Event) => {
    event.preventDefault();
    let guessedLetter = inputField?.value.toLowerCase();
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
  if (wordDisplay) wordDisplay.textContent = outputArray.join("");

  if (!outputArray.includes("-")) {
    alert("Congratulations! You guessed the word: " + secretWord);
    resetGame();
  }
}

function clearInputField() {
  if (inputField) inputField.value = "";
}

function resetGame() {
  guessedLetters.clear();
  startDialog?.showModal();
}

startGame();
