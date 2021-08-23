const images = {}
const urlJSON = "https://api.jsonbin.io/b/6123a96c076a223676afef57" + "/latest";
const fadeSpeed = 220;

var jsonData = null;


function init() {
    // Resize the canvas according to the screen
    let canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let activateButtonCalled = 0;

    // Add warning before refresh
    window.onbeforeunload = function () {
        if (canvas.style.display == "block") {
            return "Willst du die Seite wirklich neu laden?";
        }
    }

    // Fetch highscore datd and display it
    $.getJSON(urlJSON, function(data) {
        jsonData = data;
        document.getElementById("highscoreTxt").innerHTML = "Highscore: " + jsonData["highscore"];
    }).done(function() {
        activateButton();
    });

    // Load all images
    let imagesLoaded = 0;
    let imageLinks = [
        ["player", "assets/img/player.png"],
        ["water", "assets/img/water.png"],
        ["shot", "assets/img/shot.png"],
        ["deadlyShot", "assets/img/deadlyShot.png"],
        ["heart", "assets/img/heart.png"],
        ["emptyHeart", "assets/img/emptyHeart.png"],
        ["bg", "assets/img/bg.png"],
        ["playerSick", "assets/img/playerSick.png"],
    ]
    imageLinks.forEach(item => {
        let img = new Image();
        img.src = item[1];
        images[item[0]] = img;

        img.onload = function() {
            imagesLoaded += 1;
            if (imagesLoaded == imageLinks.length) {
                activateButton();
            }
        }
    });

    // Add functionality to the start game button
    function activateButton() {
        activateButtonCalled += 1;
        if (activateButtonCalled == 2) {
            $("#startGameBtn").css("opacity", "1");
            document.getElementById("startGameBtn").disabled = false;
        }
    }

    // Add funtionality to start game button
    document.getElementById("startGameBtn").onclick = function() {
        $("#startScreen").fadeOut(fadeSpeed).promise().done(function() {
            document.getElementById("game").style.display = "block";
            main();
        });
    }

    // Add functionality to the restart game button
    document.getElementById("restartGameBtn").onclick = function() {
        document.getElementById("game").style.display = "block";
        document.getElementById("endScreen").style.display = "none";
        main();
    }

    // Add functionality to the rules button
    document.getElementById("rulesBtn").onclick = function() {
        $("#startScreen").fadeOut(fadeSpeed).promise().done(function() {
            $("#rules").css("display", "flex");
            $("#rules").hide().fadeIn(fadeSpeed);
        });
    }

    // Add funtionality to the rules back button
    document.getElementById("rulesBackBtn").onclick = function() {
        $("#rules").fadeOut(fadeSpeed).promise().done(function() {
            $("#startScreen").hide().fadeIn(fadeSpeed);
        });
    }

    // Add functionality to the main menu button
    document.getElementById("mainMenuBtn").onclick = function() {
        $("#endScreen").fadeOut(fadeSpeed).promise().done(function() {
            $("#startScreen").hide().fadeIn(fadeSpeed);
        })
    }
}

init()
