var correctAnswer = 0;
var totalCorrectAnswer;
var count = -1;
var gameLevel = "";
var gamePoints;
var timerIsActive = true;
var consequetiveCorrectAnswer = -1;
var requiredCorrectAnswer;
var additionalTime = false;

document.body.onload = init();

function init(){
    // showGameStats();
    
    numpad.attach({target: document.getElementById("userResponse")});
    gameLevel = document.querySelector("#gameLevel").value;
 
    if(document.cookie == ''){
        gamePoints = 0;
        totalCorrectAnswer = 0;
    } else{
        gamePoints = readCookie("gamePoints");
        totalCorrectAnswer = readCookie("totalCorrectAnswer");
    }

    if (gameLevel == "intermediate" && gamePoints < 100) {
        startButton.disabled = true;
        startButton.style = "background-color:grey; color:black;";
        startButton.innerHTML = "<i class='fa fa-lock'></i> "+(100 - gamePoints)+" pts to unlock";

    } else if(gameLevel == "advance" && gamePoints < 500) {
        startButton.disabled = true;
        startButton.style = "background-color:grey; color:black;";
        startButton.innerHTML = "<i class='fa fa-lock'></i> "+(500 - gamePoints)+" pts to unlock";
        
    } else{
        startButton.disabled = false;
        startButton.style = "background-color:blue; color:white;";
        startButton.innerHTML = "<i class='fa fa-play-circle'></i> START GAME"
    }

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

    document.getElementById("userResponse").focus();
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
        totalCorrectAnswer++;
        consequetiveCorrectAnswer++;
        if(consequetiveCorrectAnswer == requiredCorrectAnswer){
            additionalTime = true;
            consequetiveCorrectAnswer = 0;
            document.querySelector("#timer").innerHTML += 
            "<p style='color:green; text-align:right;'>+"+ (gameTime/10) +"s</p>";
        } else{
            additionalTime = false;
        }
        userScore.style = "background-color: green; border-radius:5px; padding-top:5px;";
        userScore.innerHTML = "Current Score: " + count;
        console.log("User is correct");
    } else {
        count--;
        gamePoints--;
        consequetiveCorrectAnswer = 0;
        userScore.style = "background-color: red; border-radius:5px; padding-top:5px;";
        userScore.innerHTML = "Current Score: " + count;
        console.log("User is incorrect");
    }

    console.log(consequetiveCorrectAnswer);
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
    startButton.style = "visibility: hidden;";
    startButton.innerHTML = "SUBMIT RESPONSE";
}

function countdownTimer(){
    //Setting gameTime for each level
    switch(gameLevel){
        case "beginner":
            gameTime = 40;
            requiredCorrectAnswer = 3;
            break;
        case "intermediate":
            gameTime = 60;
            requiredCorrectAnswer = 4;
            break;
        case "advance":
            gameTime = 120;
            requiredCorrectAnswer = 5;
            break;
        default:
            gameTime = 0;
            requiredCorrectAnswer = 0;
    }

    // Set the date we're counting down to
    var countDownDate = new Date().getTime() + gameTime * 1000;

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
        //If the user answers correctly for consequetive 3 times, 10% of the gameTime is added.
        if(additionalTime){
            countDownDate = countDownDate + (gameTime*100);
            additionalTime = false;
        }
            
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
            
        // Time calculations for days, hours, minutes and seconds

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
        // Output the result in an element with id="timer"
        document.getElementById("timer").innerHTML = minutes + "m." + seconds + "s";
            
        // If the count down is over, write some text 
        if (seconds <= 0) {
            timerIsActive = false;
            var startButton = document.querySelector("#startButton");
            var userResponse = document.querySelector("#userResponse");

            clearInterval(x);
            document.getElementById("timer").innerHTML = "EXPIRED";
            document.getElementById("numWrap").style = "visibility: hidden;"
            startButton.innerHTML = userResponse.innerHTML = "<a onclick='window.location.reload();' style='color:black;'><i class='fa fa-refresh'></i> RESTART LEVEL</a>";
            startButton.disabled = userResponse.disabled = "true";
            startButton.style = userResponse.style = "background-color:grey; color:black !important;";
            userScore.innerHTML = "Final Score: " + count;
            document.cookie = "gamePoints="+gamePoints;
            document.cookie = "totalCorrectAnswer="+totalCorrectAnswer;
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

//Load root file and pass highest point value through url
function loadHome(){
    var uri = "highestScore="+gamePoints+"&totalCorrectAnswer="+totalCorrectAnswer;
    window.location.href="../index.html?"+uri;
}

//Game Statistics
// function showGameStats(){
//     var uname = "caraspace";
//     var highScore = readCookie('gamePoints');
//     var totalCorrectAnswer = 100;
//     var unlockedLevel = 0;

//     console.log(document.cookie);

//     document.getElementById('userStatuname').innerHTML = uname;
//     document.getElementById('userStatHighScore').innerHTML = highScore;
//     document.getElementById('userStatTotalCorrectAnswer').innerHTML = totalCorrectAnswer;
//     document.getElementById('userStatUnlockedLevel').innerHTML = unlockedLevel;
// }