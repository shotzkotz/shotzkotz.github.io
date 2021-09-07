// Global variables
images = {}
transitionSpeed = 200;

vw = window.innerWidth;
vh = window.innerHeight;

urlJSON = "https://api.jsonbin.io/b/6123ad5d076a223676aff297" + "/latest";
jsonData = null;

canvas = $("#game");
ctx = canvas[0].getContext("2d");


function init() {
    let activateButtonCalled = 0;

    // Call all init functions
    resizeCanvas();
    //!!addRefreshWarning();
    addBtnOnclicks();
    loadImages();
    fetchJSON();

    // Pre-load all imaages
    function loadImages() {
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
                    activateButtonCalled += 1;
                    activateButton(activateButtonCalled);
                }
            }
        });
    }

    // Fetch data from the json file
    function fetchJSON() {
        $.getJSON(urlJSON, function(data) {
            jsonData = data;
            document.getElementById("highscoreTxt").innerHTML = "Highscore: " + jsonData["highscore"];
        }).done(function() {
            activateButtonCalled += 1;
            activateButton(activateButtonCalled);
        });
    }
}


// Resize the canvas according to the screen size
function resizeCanvas() {
    canvas.attr("width", vw);
    canvas.attr("height", vh);
}


// Add refresh warning only while playing
function addRefreshWarning() {
    window.onbeforeunload = function () {
        if (canvas.css("display") == "block") {
            return "Willst du die Seite wirklich neu laden?";
        }
    }
}


// Add onlick functions to all buttons
function addBtnOnclicks() {
    // Add functionality to start game button
    $("#startGameBtn").click(function() {
        $("#startScreen").fadeOut(transitionSpeed).promise().done(function() {
            $("#game").css("display", "block");
            main();
        })
    })

    // Add functionality to the restart game button
    $("#restartGameBtn").click(function() {
        $("#endScreen").fadeOut(transitionSpeed).promise().done(function() {
            $("#game").css("display", "block");
            main();
        })
    })

    // Add functionality to the rules button
    $("#rulesBtn").click(function() {
        $("#startScreen").fadeOut(transitionSpeed).promise().done(function() {
            $("#rules").css("display", "flex");
            $("#rules").hide().fadeIn(transitionSpeed);
        })
    })

    // Add funtionality to the rules back button
    $("#rulesBackBtn").click(function() {
        $("#rules").fadeOut(transitionSpeed).promise().done(function() {
            $("#startScreen").hide().fadeIn(transitionSpeed);
        })
    })

    // Add functionality to the main menu button
    $("#mainMenuBtn").click(function() {
        $("#endScreen").fadeOut(transitionSpeed).promise().done(function() {
            $("#startScreen").hide().fadeIn(transitionSpeed);
        })
    })
}


// Activate the start game button when images are loaded and
// data from json file is fetched
function activateButton(calls) {
    if (calls == 2) {
        $("#startGameBtn").css("opacity", "1");
        document.getElementById("startGameBtn").disabled = false;
    }
}


// Call the init() function when the document is ready
$(document).ready(function() {
    init();
})
