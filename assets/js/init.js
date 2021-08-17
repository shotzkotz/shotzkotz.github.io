const images = {}

function init() {
    // Resize the canvas according to the screen
    let canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add warning before refresh
    // window.onbeforeunload = function () {
    //     if (canvas.style.display == "block") {
    //         return "Willst du die Seite wirklich neu laden?";
    //     }
    // }

    // Fetch highscore datd and display it
    let highscore = null;
    $.getJSON('https://api.jsonbin.io/b/611aecfce1b0604017b19cc1/latest', function(data) {
        highscore = data["highscore"];
        document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
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
        document.getElementById("startGameBtn").onclick = function() {
            document.getElementById("startScreen").style.display = "none";
            document.getElementById("game").style.display = "block";
            main(highscore);
        }
    }

    // Add functionality to the restart game button
    document.getElementById("restartGameBtn").onclick = function() {
        document.getElementById("game").style.display = "block";
        document.getElementById("endScreen").style.display = "none";
        main(highscore);
    }
}

init()
