/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/
let hintCount = 1;
function generateWinningNumber () {
    return Math.ceil(Math.random() * 100)
}

function shuffle (arr) {
    let t, len = arr.length, i;
    while (len) {
       let i = Math.floor(Math.random()*len--);
       t =arr[len];
       arr[len] = arr[i];
       arr[i] = t; 
    }
    return arr;
}

class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }
    difference(){
        return Math.abs(this.playersGuess - this.winningNumber)
    }
    playersGuessSubmission(num){
        if (typeof num !== 'number' || num > 100 || num < 1) throw 'That is an invalid guess.';
        this.playersGuess = num;
        return this.checkGuess();
    }
    checkGuess() {
        if(this.gameOver) return;
        let direction = '';
        if (this.playersGuess > this.winningNumber) direction = 'lower';
        if (this.playersGuess < this.winningNumber) direction = 'higher';
        if(this.playersGuess === this.winningNumber) {1
            this.pastGuesses.push(this.playersGuess);
            document.getElementById('go').disabled = true;
            document.getElementById('guessInput').disabled = true;
            document.getElementById('hint').disabled = true;
            document.getElementById('guessInput').placeholder = ':)';
            document.body.style.background = '#6f9960';
            return 'You Win!';
        }
        if(this.pastGuesses.includes(this.playersGuess)) return 'You have already guessed that number.'
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length === 5) {
            document.getElementById('go').disabled = true;
            document.getElementById('guessInput').disabled = true;
            document.getElementById('hint').disabled = true;
            document.getElementById('guessInput').placeholder = ':(';
            document.body.style.background = "#e38462";
            document.getElementById('retry').style.animation="shakeRetry .8s linear infinite";
            return `You Lose. The winning number was ${this.winningNumber}.`;
        }
        switch(true) {
            case (this.difference() < 10) :
                return `You\'re burning up! A little ${direction}!`
            case (this.difference() < 25) :
                return `You\'re lukewarm. Guess ${direction}.`
            case (this.difference() < 50) :
                return `You\'re a bit chilly. Guess ${direction}!`
            case (this.difference() < 100) :
                return `You\'re ice cold! Go way ${direction}!`
        }
    }
    provideHint() {
        let direction = '';
        if (this.playersGuess > this.winningNumber) direction = 'lower';
        if (this.playersGuess < this.winningNumber) direction = 'higher';
        if (this.pastGuesses.length) return `The number is at least ${this.difference() - Math.floor(Math.random()*(this.difference()-1))} ${direction}!`
        else return `Guess a number first!`
    }
}

function newGame () {
    return new Game;
}

function showResult(val) {
    document.getElementById('msg').innerHTML = `${val}`
}

let game = new Game;
let submitButton = document.getElementById('go');
submitButton.addEventListener('click', function(){
    let num = Number(document.querySelector('input').value);
    if(isNaN(num) || num > 100 || num < 1) {
        showResult('Enter a number from 1 to 100.');
        document.getElementById('guessInput').style.animation="shake .5s linear";
        document.querySelector('input').value = '';
        setTimeout(()=>{
            document.getElementById('guessInput').style.animation="";
        }, 500)
    }
    else if(game.pastGuesses.includes(num)) {
        showResult('You have already guessed that number.');
        document.getElementById('guessInput').style.animation="shake .5s linear";
        document.querySelector('input').value = '';
        setTimeout(()=>{
            document.getElementById('guessInput').style.animation="";
        }, 500)
    }
    else {
        showResult(game.playersGuessSubmission(num));
        document.getElementById(`guess${game.pastGuesses.length}`).innerHTML = `${num}`;
        document.querySelector('input').value = '';
        console.log(game.pastGuesses)
    }
    document.getElementById("guessInput").focus();
})
let hintButton = document.getElementById('hint');
hintButton.addEventListener('click', function(){
    // if(!hintCount) {
    //     return
    // };
    // hintCount = false;
    // console.log(hintCount);
    // document.getElementById("guessInput").focus();
    // alert(`One of these numbers is the winning number : ${game.provideHint()}`)
    showResult(game.provideHint());
})
let replayButton = document.getElementById('retry');
replayButton.addEventListener('click', function(){
    replayButton.style.animation="";
    let guessArr = [...document.getElementsByClassName('guess')];
    guessArr.forEach(el => {el.innerHTML = '-'});
    showResult('');
    game = newGame();
    document.getElementById('guessInput').disabled = false;
    document.getElementById('go').disabled = false;
    document.getElementById('hint').disabled = false;
    document.getElementById('guessInput').focus();
    document.getElementById('guessInput').placeholder = '1-100';
    document.body.style.background = "#79A2E0";
})
document.body.addEventListener('click', function(){
    document.getElementById("guessInput").focus();
})
document.getElementById('guessInput').addEventListener('keyup', function(event) {
    if(event.code === 'Enter') {
        event.preventDefault();
        document.getElementById('go').click();
    }
})