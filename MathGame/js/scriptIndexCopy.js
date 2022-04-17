var correctAnswer = 0;
var count = -1;
var gameLevel = "";
var gamePoints;
var timerIsActive = true;

//Number format ranges in an array of objects 
var ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'G' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'K' }
];

document.body.onload = init();

function init(){
    showGameStats();
    
    console.log("DOM is ready.");
}

function askQuestion(){
    gameLevel = document.querySelector("#gameLevel").value;
    console.log(gameLevel);

    var firstNum = Math.round(Math.random() * 10);
    var secondNum = Math.round(Math.random() * 10);
    
    switch(gameLevel){
        case "beginner":
            beginnerQuestion(firstNum, secondNum);
            break;
        case "intermediate":
            firstNum = Math.round(Math.random() * 12);
            secondNum = Math.round(Math.random() * 12);
            intermediateQuestion(firstNum, secondNum);
            break;
        case "advance":
            firstNum = Math.round(Math.random() * (21 - 5) + 5);
            secondNum = Math.round(Math.random() * (21 - 5) + 5);
            intermediateQuestion(firstNum, secondNum);
    }

    if(timerIsActive){
        countdownTimer();
        timerIsActive = false;
    }

}

function beginnerQuestion(firstNum, secondNum){
    if(firstNum > secondNum){
        var operator = "-";
        correctAnswer = firstNum - secondNum;
        addLineToHTMLTable(firstNum, secondNum, operator);
    } else{
        var operator = "+";
        correctAnswer = firstNum + secondNum;
        addLineToHTMLTable(firstNum, secondNum, operator);
    }
}

function intermediateQuestion(firstNum, secondNum){
    var operator = ["+","-","x","/"];
    i = Math.round(Math.random() * 3);
    switch(operator[i]){
        case "x":
            correctAnswer = firstNum * secondNum;
            addLineToHTMLTable(firstNum, secondNum, operator[2]);
            break;
        case "/":
            
            if(firstNum > secondNum && secondNum !== 0){
                correctAnswer = firstNum % secondNum;
                firstNum = correctAnswer * secondNum;
            } else if(secondNum > firstNum && firstNum !== 0){
                correctAnswer = secondNum % firstNum;
                firstNum = correctAnswer * secondNum;
            } else{
                correctAnswer = firstNum * secondNum;
                addLineToHTMLTable(firstNum, secondNum, operator[2]);
                break;
            }
            addLineToHTMLTable(firstNum, secondNum, operator[3]);
            break;
            
        default:
            beginnerQuestion(firstNum, secondNum);
            break;
    }
}

function checkUserResponse(){
    var userResponse = document.querySelector("#userResponse").value;
    var userScore = document.querySelector("#userScore");

    if (userResponse == correctAnswer) {
        count++;
        gamePoints++;
        userScore.style = "background-color: green; border-radius:5px; padding-top:5px;";
        userScore.innerHTML = "Current Score: " + count;
        console.log("User is correct");
    } else {
        count--;
        gamePoints--;
        userScore.style = "background-color: red; border-radius:5px; padding-top:5px;";
        userScore.innerHTML = "Current Score: " + count;
        console.log("User is incorrect");
    }

    document.getElementById("userResponse").type = "number";
    askQuestion();
    return true;
}

// Add a line to the HTML table
function addLineToHTMLTable(firstNum, secondNum, operator) {
    // Get the body of the table using the selector API
    var tableBody = document.querySelector("#question");
    var startButton = document.querySelector("#startButton");

    tableBody.innerHTML = "What is "+firstNum+" "+operator+" "+secondNum+"?";
    startButton.innerHTML = "SUBMIT RESPONSE";
}

function countdownTimer(){
    switch(gameLevel){
        case "beginner":
            gameTime = 45;
            break;
        case "intermediate":
            gameTime = 60;
            break;
        case "advance":
            gameTime = 120;
            break;
        default:
            gameTime = 0;
    }

    // Set the date we're counting down to
    var countDownDate = new Date().getTime() + gameTime * 1000;

    // Update the count down every 1 second
    var x = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();
        
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
        
    // Time calculations for days, hours, minutes and seconds

    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
    // Output the result in an element with id="demo"
    document.getElementById("timer").innerHTML = minutes + "m." + seconds + "s";
        
    // If the count down is over, write some text 
    if (distance < 0) {
        timerIsActive = false;
        var startButton = document.querySelector("#startButton");
        var userResponse = document.querySelector("#userResponse");

        clearInterval(x);
        document.getElementById("timer").innerHTML = "EXPIRED";
        startButton.innerHTML = userResponse.innerHTML = "EXPIRED";
        startButton.disabled = userResponse.disabled = "true";
        startButton.style = userResponse.style = "background-color:grey; color:black;";
        userScore.innerHTML = "Final Score: " + count;
        document.cookie = "gamePoints=" + gamePoints;
    }
    }, 1000);

    console.log("Timer is Running");
}

//When user press Enter Key to submit the answer
function enterKeyPressed(event) {
    if (event.keyCode == 13) {
       checkUserResponse();
       userResponse.value = '';
       return true;
    }
 }

 //For mini user set timer in the bottom navigation
function userInputTime(){
    var userInputTime = document.querySelector('#userInputTime');
    userInputTime.innerHTML = "Timer<br><br><input type='number' id='updateUserInputTime' placeholder='in seconds' style='width:50px; border-radius:5px;'> <br><br> <button class='button button--green' style='width:100px; height:25px; font-size:12px; padding:0px; margin:0px; box-shadow: 0 14px 18px 0 #333333, 0 17px 50px 0 #333333;' onclick='updateUserInputTime();'>SET & GO</button>";
    userInputTime.style = "color: white; font-size: 12px; text-align: center;"
}

function updateUserInputTime(){
    var updateUserInputTime = document.querySelector('#updateUserInputTime');
    var customGameTime = updateUserInputTime.value;

    askQuestion();

    console.log(customGameTime);
}

//Reading cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//Game Statistics
function showGameStats(){
    var uname = "caraspace";
    var highScore = 0;
    var totalCorrectAnswer = 0;
    var unlockedLevel = 0;

    if(getUrlVars()["highestScore"] && getUrlVars()["totalCorrectAnswer"]){
        var highScore = getUrlVars()["highestScore"];
        var totalCorrectAnswer = getUrlVars()["totalCorrectAnswer"];
    }

    if (highScore > 499) {
        unlockedLevel = 3;
    } else if(highScore > 99){
        unlockedLevel = 2;
    } else{
        unlockedLevel = 1;
    }

    document.getElementById('userStatuname').innerHTML = uname;
    document.getElementById('userStatHighScore').innerHTML = highScore;
    document.getElementById('userStatTotalCorrectAnswer').innerHTML = formatNumber(totalCorrectAnswer);
    document.getElementById('userStatUnlockedLevel').innerHTML = unlockedLevel;
}

//Get values from url, you can use [--var number = getUrlVars()["x"];--] to retrive data
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//Function to format numbers for totalCorrectAnswers in 1.2K , M, G... format  
function formatNumber(n) {
for (var i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
    return (n / ranges[i].divider).toString() + ranges[i].suffix;
    }
}
return n.toString();
}