document.addEventListener("DOMContentLoaded", () => {
    var correctWord = '';

    let enterBtn = document.querySelector('.enter-input-btn');
    let inputEl = document.querySelector('.input');
    let url;

    /* Create custom link to custom wordle on click of enter button */
    /* Feature will be reimplemented because of new hosting server. 
       Will use a database to create a permanent custom link  */

    enterBtn.addEventListener("click",() => {
        correctWord = inputEl.value.toUpperCase();
        let popupEl = document.querySelector(".popup-container");
        let overlayEl = document.querySelector(".overlay");
        if(popupEl){
            popupEl.style = 'display:none;';
            overlayEl.style = "display:none; pointer-events:none;"
        }
        languageChosen = "custom";
        constructGrid();
        constructKeyboard(languageChosen);

        /* Old method of creating a custom link, will use a database in the future*/

        /* 
        if(correctWord.length != 5){
            window.alert("Word must be 5 letters long!");
        }
        else if(!(/^[a-zA-Z]+$/.test(correctWord))){
            window.alert("Please enter letters only!");
        }
        else{
            localStorage.setItem("wordle", correctWord);
            fetch(`https://international-wordle.onrender.com/make-custom`)
            .then(response => response.json())
            .then(json => {
                url = json;
                setTimeout(() => {
                    window.location = url + "/custom.html";
                }, 100);
            })
            .catch(err => console.log(err));
        }
        */
    });

    /* Declaration of language button elements */

    let spanishBtn = document.querySelector(".spanish-btn");
    let frenchBtn = document.querySelector(".french-btn");
    let englishBtn = document.querySelector(".english-btn");
    let languageChosen;

    /* Symmetrical functions that each construct grid and keyboard based 
     on language chosen */

    spanishBtn.onclick = function(){ 
        let popupEl = document.querySelector(".popup-container");
        let overlayEl = document.querySelector(".overlay");
        if(popupEl){
            popupEl.style = 'display:none;';
            overlayEl.style = "display:none; pointer-events:none;"
        }
        languageChosen = "spanish-word";
        fetchWordle(languageChosen);
        constructGrid();
        constructKeyboard(languageChosen);
    }
    
    frenchBtn.onclick = function(){ 
        let popupEl = document.querySelector(".popup-container");
        let overlayEl = document.querySelector(".overlay");
        if(popupEl){
            popupEl.style = 'display:none;';
            overlayEl.style = "display:none; pointer-events:none;"
        }
        languageChosen = "french-word";
        fetchWordle(languageChosen);
        constructGrid();
        constructKeyboard(languageChosen);
    }

    englishBtn.onclick = function(){ 
        let popupEl = document.querySelector(".popup-container");
        let overlayEl = document.querySelector(".overlay");
        if(popupEl){
            popupEl.style = 'display:none;';
            overlayEl.style = "display:none; pointer-events:none;"
        }
        languageChosen = "english-word";
        fetchWordle(languageChosen);
        constructGrid();
        constructKeyboard(languageChosen);
    }

    /* Fetches wordle from a random word API, dependent on language */

    function fetchWordle(languageChosen){
        fetch(`https://multilingual-wordle.onrender.com/${languageChosen}`)
            .then(response => response.json())
            .then(json => {
                /* Word is normalized before being set to correctWord to remove
                language-specific alphabet conflicts */
                correctWord = toNormalForm(json.toUpperCase());
            })
            .catch(err => console.log(err))
    }

    /* Game Function */

    /* Array of word arrays, keeping track of each of the already guess words */
    let guessedWordsArr = [[]];

    let availableCell = 1;
    let guessCount = 0;
    let gameDone = false;
    let correctLettersArr = [];

    /* Constructs grid by creating divs with class "cell" and giving them a numerical id */
    function constructGrid(){
        const letterGrid = document.querySelector(".grid-container");
        for(let i = 0; i < 30; i++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add('animate__animated');
            cell.setAttribute("id", i + 1);
            letterGrid.appendChild(cell);
        }
    }
 
    /* Constructs keyboard by creating divs with class "key" and giving the key letter as id 
       Additionally, each key button is given an event listener which handles the click */
    function constructKeyboard(languageChosen){
        const keyboard = document.querySelector(".key-container");
        const keyList = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
                        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
                      'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
        keyList.forEach(key => {
            let keyBtn = document.createElement("button");
            keyBtn.innerText = key;
            keyBtn.setAttribute("id", key);
            keyboard.append(keyBtn);
            keyBtn.addEventListener('click', () => handleKeyClick(key, languageChosen));
        });
    }

    /* Handles key button click event, dependent on key chosen */
    function handleKeyClick(key, languageChosen){
        if(key != 'ENTER' && key != 'DEL'){
            updateCurrentGuess(key);
        }
        else if(key == 'ENTER'){
            handleSubmitRequest(languageChosen);
        }
        else{
            handleDelete();
        }
    }

    /* If the key was a letter, this function updates the guess */
    function updateCurrentGuess(letter){
        let currentGuessArr = getCurrentGuess();
        let gridCell = document.getElementById(String(availableCell));

        if(currentGuessArr.length < 5 ){
            currentGuessArr.push(letter);
            gridCell.innerText = letter;
            availableCell++;
        }
    }

    /* Retrieves the current guess out of the 6 maximum */
    function getCurrentGuess(){ 
        let guessCount = guessedWordsArr.length;
        return guessedWordsArr[guessCount - 1];
    }

    /* Handles the "ENTER" key click */
    function handleSubmitRequest(languageChosen){
        correctLettersArr = [];
        
        if(gameDone){
            return;
        }

        let currentGuessArr = getCurrentGuess();
        if(currentGuessArr.length != 5){
            window.alert("Word must contain 5 letters.")
            return;
        }

        let currentGuess = currentGuessArr.join('');
        let checkLanguage;

        /* If the guess is correct, gameDone is true. It allows us to correct issues with
           accents in spanish and french, since this wordle application does not include
           language-specifc alphabets. If the normalized word is correct, we will not 
           search for it in the language dictionary, as it will not be included.
        */
        if(currentGuess == correctWord){
            gameDone = true;    
        }

        /* Determines what language and API to retrieve word from */
        if(languageChosen == "english-word"){
            checkLanguage = "check-english"
        }
        else if(languageChosen == "spanish-word"){
            checkLanguage = "check-spanish"
        }
        else if(languageChosen == "french-word"){
            checkLanguage = "check-french"
        }
        else{
            let letterId = (guessCount * 5)+ 1;
            currentGuessArr.forEach((letter, index) => {
                setTimeout(()=> {
                    let cellColor = getCellColor(letter, index);
                    let letterEl = document.getElementById(String(letterId));
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color: ${cellColor}; border-color: ${cellColor};
                            color: white;`;
                    letterId++;
                }, 250 * index);
            });
            setTimeout(()=> {
                currentGuessArr.forEach((letter, index) => {
                        let cellColor = getKeyColor(letter, index);
                        let keyEl = document.getElementById(letter);
                        keyEl.style = `background-color: ${cellColor}; border-color: ${cellColor};
                                color: white;`;
                });
            }, 1300);

            setTimeout(() => {
                if(currentGuess != correctWord){
                        handleIncorrectGuess(currentGuessArr);
                }
                else{
                        window.alert("Congratulations! You guessed the word!");
                        gameDone = true;
                }
            }, 1350);

            guessCount++;
            console.log('SUBMIT REQUEST');
            return
        }

        /* Dictionary Check Using Word Dictionary API or French/Spanish array dictionaries */
    
        fetch(`https://multilingual-wordle.onrender.com/${checkLanguage}/?word=${currentGuess.toLowerCase()}`)
            .then(response => response.json())
            .then(json => {
                if(json == 'Entry word not found' && !gameDone){
                    window.alert("Word not in list!");
                    return;
                }
                else{ 

                    /* If guess is a valid word, we then determine the color of each letter cell/key */
                    let letterId = (guessCount * 5)+ 1;
                    currentGuessArr.forEach((letter, index) => {
                        setTimeout(()=> {
                            let cellColor = getCellColor(letter, index);
                            let letterEl = document.getElementById(String(letterId));
                            letterEl.classList.add("animate__flipInX");
                            letterEl.style = `background-color: ${cellColor}; border-color: ${cellColor};
                                    color: white;`;
                            letterId++;
                        }, 250 * index);
                    });
                    setTimeout(()=> {
                        currentGuessArr.forEach((letter, index) => {
                                let cellColor = getKeyColor(letter, index);
                                let keyEl = document.getElementById(letter);
                                keyEl.style = `background-color: ${cellColor}; border-color: ${cellColor};
                                        color: white;`;
                        });
                    }, 1300);

                    setTimeout(() => {
                        if(currentGuess != correctWord){
                               handleIncorrectGuess(currentGuessArr);
                        }
                        else{
                                window.alert("Congratulations! You guessed the word!");
                                gameDone = true;
                        }
                    }, 1350);

                    guessCount++;
                    console.log('SUBMIT REQUEST');
                }
            }).catch(err => console.log(err));
    }

    let grey = "rgba(120,124,126,255)";
    let green = "rgba(106,170,100,255)";
    let yellow = "rgba(201,180,88,255)";

    /* Determines the cell color */
    function getCellColor(guessLetter, guessIndex){
        if(guessLetter == correctWord.charAt(guessIndex)){
            /* correctLettersArr holds the letters already guessed correctly */
            correctLettersArr.push(guessLetter);

            return green;
        }
        
        let letterInWord = false;
        if(correctWord.search(guessLetter) != -1){
            letterInWord = true;
        }

        let isPreviousGuess = false;
        if (correctLettersArr.indexOf(guessLetter) != -1){
            isPreviousGuess = true;
        }

        if(!letterInWord){
            return grey;
        } 
        else if(!isPreviousGuess){
            return yellow;
        } 
        else if(getItemCount(guessLetter, correctWord.split("")) == getItemCount(guessLetter, correctLettersArr)){
            return grey;
        }
        else{
            return yellow;
        }
    }

    /* Determines color of key button */
    function getKeyColor(guessLetter, guessIndex){
        let isPreviousGuess = false;
        
        if (correctLettersArr.indexOf(guessLetter) != -1){
            isPreviousGuess = true;
        }
        if(correctWord.charAt(guessIndex) == guessLetter || isPreviousGuess){
            return green;
        }

        let letterInWord = false;
        if(correctWord.search(guessLetter) != -1){
            letterInWord = true;
        }

        if(letterInWord){
            return yellow;
        }
        else{
            return grey;
        }
    }
    
    /* General-purpose function to count how many instances of an item
       appear in an array */
    function getItemCount(item, inputArr){
        let count = 0;
        for(let i = 0; i < inputArr.length; i++){
            if(inputArr[i] == item){
                count++;
            }
        }
        return count;
    }

    /* Handles incorrect guess by keep track of number of guesses and
       pushing new guess onto guessedWordsArr */
    function handleIncorrectGuess(){
        if(guessedWordsArr.length == 6){
            window.alert(`The correct word is ${correctWord}.`);
        }
        else{
            guessedWordsArr.push([]);
        }
    }

    /* Handles when the "DEL" key is clicked */
    function handleDelete(){
        let currentGuessArr = getCurrentGuess(); 
        if(availableCell > 1 && currentGuessArr.length > 0){
            availableCell--;
            let gridCell = document.getElementById(String(availableCell));
            gridCell.innerText = '';
            currentGuessArr.pop();
        }
        console.log('DELETE CLICKED')
    }

    /* Normalizes words that contain accents, or other special characters from
       Spanish or French language */
    function toNormalForm(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
});