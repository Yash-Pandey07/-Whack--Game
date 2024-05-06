let currentMoleTile, currentPlantTile;
let score = 0, gameover = false;
let timeLimit = 60; // Time limit for the game in seconds
let difficultyIncreaseInterval = 15; // Increase difficulty by this interval (in seconds)
let timerInterval;
let moleInterval;
let plantInterval;

window.onload = function() {
    setGame();
    startTimer();
    document.getElementById("restartBtn").addEventListener("click", resetGame);
    displayTopScore();
}

function setGame(){
    for (let i = 0; i < 9; i++){
        let tile =document.createElement("div");
        tile.id =i.toString();
        tile.addEventListener("click",selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole,1000);
    setInterval(setPlant,2000);
}

function getRandomTile(){
    let num = Math.floor(Math.random() *9);
    return num.toString();
}

function setMole(){
    if (gameover){
        return ;
    }

    if(currentMoleTile){
        currentMoleTile.innerHTML ="";
    }
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num= getRandomTile();
    if(currentPlantTile && currentPlantTile.id == num){
        return ;
    }
    currentMoleTile = document.getElementById(num);
    currentMoleTile.appendChild(mole);
}

function setPlant(){
    if (gameover){
        return ;
    }

    if (currentPlantTile){
        currentPlantTile.innerHTML="";
    }

    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if(currentMoleTile && currentMoleTile.id == num){
        return ;
    }
    currentPlantTile = document.getElementById(num);
    currentPlantTile.appendChild(plant);    
}

function selectTile() {
    if (gameover) {
        document.getElementById("restartBtn").style.display = "block"; // Show the restart button
        return;
    }
    if (this == currentMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString();
    } else if (this == currentPlantTile) {
        document.getElementById("score").innerText = "GAME OVER : " + score.toString();
        gameover = true;
        clearInterval(timerInterval); // Stop the timer
        document.getElementById("restartBtn").style.display = "block"; // Show the restart button
        updateTopScore();
    }
}

function resetGame() {
    score = 0;
    gameover = false;
    timeLimit = 60; // Reset time limit to 60 seconds
    document.getElementById("score").innerText = score.toString();
    // Remove moles and plants
    if (currentMoleTile) {
        currentMoleTile.innerHTML = "";
        currentMoleTile = null;
    }
    if (currentPlantTile) {
        currentPlantTile.innerHTML = "";
        currentPlantTile = null;
    }
    document.getElementById("restartBtn").style.display = "none"; // Hide the restart button
}
function startTimer() {
    let timerDisplay = document.getElementById("timer");
    timerInterval = setInterval(function () {
        timeLimit--;
        timerDisplay.innerText = "TIME LEFT: " + timeLimit + "s";
        if (timeLimit <= 0) {
            clearInterval(timerInterval);
            document.getElementById("score").innerText = "GAME OVER : " + score.toString();
            gameover = true;
        }
        // Increase difficulty every 15 seconds
        if (timeLimit % difficultyIncreaseInterval === 0 && timeLimit !== 60) { // Skip first interval (when timeLimit is 60)
            decreaseInterval(); // Decrease interval after 15 seconds
        }
    }, 1000);
}

function decreaseInterval() {
    // Decrease interval for setting moles and plants
    let currentMoleInterval = 1000; // Initial interval for setting moles
    let currentPlantInterval = 2000; // Initial interval for setting plants

    // Decrease interval by 200 milliseconds
    currentMoleInterval -= 200;
    currentPlantInterval -= 200;

    // Clear existing intervals and set new intervals
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    moleInterval = setInterval(setMole, currentMoleInterval);
    plantInterval = setInterval(setPlant, currentPlantInterval);
}

function updateTopScore() {
    let topScore = localStorage.getItem("topScore");
    if (topScore === null || score > parseInt(topScore)) {
        localStorage.setItem("topScore", score);
    }
}

function displayTopScore() {
    let topScore = localStorage.getItem("topScore");
    if (topScore !== null) {
        document.getElementById("topScore").innerText = "Top Score: " + topScore;
    }
}
