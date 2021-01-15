function addText(message, addToLeft = true) {
	let chat = document.querySelector('chat');
	if (addToLeft) {
		chat.innerHTML += `<left>${message}</left>`;
	} else {
		chat.innerHTML += `<right>${message}</right>`;
	}
	document.querySelector('chat').lastElementChild.scrollIntoView()
}

function startTimer() {

	typeof looseInterval != "undefined" && clearInterval(looseInterval)

	looseTime = timeAvailable
	document.querySelector('time').innerHTML = looseTime
	looseInterval = setInterval(() => {
		document.querySelector('time').innerHTML = --looseTime
		if (looseTime < 1) {
			gameOver("Your time ran out");
		}
	}, 1000);
}

function randomFormArray(arr, splice = false) {
	let randomNumber = Math.round(Math.random() * (arr.length - 1))
	let randomElement = arr[randomNumber]
	if (splice) {
		randomElement = arr.splice(randomNumber, 1)[0]
	}
	return randomElement;
}


function getWord(startingCharacter = false) {
	let word;
	// If there are no more words in the hashmap. conclude victory for the player.
	if ((!startingCharacter && Object.keys(wordListHashMap).length == 0) || (startingCharacter && typeof wordListHashMap[startingCharacter] == 'undefined')) {
		gameOver('Well you won!, cheater');
	}
	if (!startingCharacter) {
		word = randomFormArray(wordListHashMap[randomFormArray(Object.keys(wordListHashMap))], true)
	} else {
		word = randomFormArray(wordListHashMap[startingCharacter])
	}
	if (wordListHashMap[word[0]].length == 0) {
		delete wordListHashMap[[word[0]]];
	}

	usedWords.push(word);
	return word
}

function gameOver(gameOverMessage = "You lost!") {
	addText(`Game over: ${gameOverMessage}`);
	addText(`You scored: ${points} chains`)
	addText("Try again?")
	gameStared = false;

	typeof looseInterval != "undefined" && clearInterval(looseInterval)

}

form = document.querySelector('form');
form.addEventListener('submit', (event) => {
	event.preventDefault();
	let form_data = new FormData(form);
	let message = form_data.get('message').trim().toLowerCase();
	if (message == "") return false
	addText(message, false)
	form.reset()
	if (!gameStared) { // If game is not started
		const agreeMessages = ["yes", "y", "ye", "sure", "go", "proceed"]
		if (agreeMessages.includes(message)) { // If the player agrees start the game
			gameStared = true;
			points = 0;
			usedWords = [];
			wordsArrayIntoHashMap();
			addText("Let's begin with: " + getWord(false));
			startTimer();
		} else {
			addText("Try again...");
		}
	} else {
		let lastUsedWordChar = usedWords.slice(-1)[0].slice(-1)[0];
		let messageLastChar = message.slice(-1);
		if (lastUsedWordChar == message[0]) { // If a chain is created.
			if (usedWords.includes(message)) { // If the the word was already used;
				gameOver(`Sorry but '${message}' was already used`);
			} else if (wordListHashMap[message[0]].includes(message)) { // If the the word is available
				points++
				looseTime = timeAvailable
				startTimer();
				usedWords.push(message)
				//Random timeout to give you.
				setTimeout(() => {
					looseTime = timeAvailable
					startTimer();
					usedWords.push(message)
					addText(getWord(messageLastChar));
				}, Math.random() * 5000);
			} else {
				gameOver(`Sorry but '${message}' is not a word this database`);
			}
		} else {
			gameOver(`Sorry but '${message}' does not start with '${lastUsedWordChar}'`);
		}
	}
});


//STARTUP
points = 0;
gameStared = false
timeAvailable = 5; //sec
usedWords = [];

addText(`Welcome to word chain. In this game, you need come up with a word that begins with the letter that the previous word ended with in ${timeAvailable} seconds.`);
addText("For Example. 'word' -> 'down' -> 'now'");
addText("Shall we begin?");

document.querySelector('time').innerHTML = timeAvailable


//Additional words
wordList.push('droid', 'droids', 'yeet', 'yote', 'yeeted', 'nah');
wordsArrayIntoHashMap = () => {
	let wordListHashMap = {}
	wordList.forEach(x => {
		if (typeof wordListHashMap[x[0]] == 'undefined') {
			wordListHashMap[x[0]] = [];
		}
		wordListHashMap.a.splice(4, 1)
		wordListHashMap[x[0]].push(x)
	});
}
wordsArrayIntoHashMap();

