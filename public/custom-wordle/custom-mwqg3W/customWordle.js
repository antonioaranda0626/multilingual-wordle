document.addEventListener("DOMContentLoaded", () => {

    let correctWord = localStorage.getItem("wordle");
    let guessedWordsArr = [[]];
    let availableCell = 1;
    let guessCount = 0;
    let gameDone = false;
    let correctLettersArr = [];

    constructGrid();
    constructKeyboard();

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

    function constructKeyboard(){
        const keyboard = document.querySelector(".key-container");
        const keyList = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
                        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
                      'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
        keyList.forEach(key => {
            let keyBtn = document.createElement("button");
            keyBtn.innerText = key;
            keyBtn.setAttribute("id", key);
            keyboard.append(keyBtn);
            keyBtn.addEventListener('click', () => handleKeyClick(key));
        });
    }


    function handleKeyClick(key){
        if(key != 'ENTER' && key != 'DEL'){
            updateCurrentGuess(key);
        }
        else if(key == 'ENTER'){
            handleSubmitRequest();
        }
        else{
            handleDelete();
        }
    }

    function updateCurrentGuess(letter){
        let currentGuessArr = getCurrentGuess();
        let gridCell = document.getElementById(String(availableCell));

        if(currentGuessArr.length < 5 ){
            currentGuessArr.push(letter);
            gridCell.innerText = letter;
            availableCell++;
        }
    }

    function getCurrentGuess(){ 
        let guessCount = guessedWordsArr.length;
        return guessedWordsArr[guessCount - 1];
    }

    function handleSubmitRequest(){
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
            let letterId = (guessCount * 5)+ 1;

            currentGuessArr.forEach((letter, index) => {
                setTimeout(()=> {
                    let cellColor = getCellColor(letter, index);
                    let letterEl = document.getElementById(String(letterId));
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color: ${cellColor}; border-color: ${cellColor}; color: white;`;
                    letterId++;
                }, 250 * index);
            });

            setTimeout(()=> {
                currentGuessArr.forEach((letter, index) => {
                    let cellColor = getKeyColor(letter, index);
                    let keyEl = document.getElementById(letter);
                    keyEl.style = `background-color: ${cellColor}; border-color: ${cellColor}; color: white;`;
                });
            }, 1300);

            setTimeout(() => {
                if(currentGuess != correctWord){
                    handleIncorrectGuess();
                }
                else{
                    window.alert("Congrats");
                    gameDone = true;
                }
            }, 1350);

            guessCount++;
            console.log('SUBMIT REQUEST')
    }


    let grey = "rgba(120,124,126,255)";
    let green = "rgba(106,170,100,255)";
    let yellow = "rgba(201,180,88,255)";


    function getCellColor(guessLetter, guessIndex){
        if(guessLetter == correctWord.charAt(guessIndex)){
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

    function getItemCount(item, inputArr){
        let count = 0;
        for(let i = 0; i < inputArr.length; i++){
            if(inputArr[i] == item){
                count++;
            }
        }
        return count;
    }

    

    function handleIncorrectGuess(){
        if(guessedWordsArr.length == 6){
            window.alert(`The correct word is ${correctWord}.`);
        }
        else{
            guessedWordsArr.push([]);
        }
    }

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
});

