const images = {}
const urlJSON = "https://api.jsonbin.io/b/611cd3c2076a223676ad460e" + "/latest";
var jsonData = null;

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
    $.getJSON(urlJSON, function(data) {
        jsonData = data;
        for (i = 1; i <= 10; i++) {
            let li = document.createElement("li");
            li.innerHTML = data[i]
            document.getElementById("highscore").appendChild(li);
        }
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
            main();
        }
    }

    // Add functionality to the restart game button
    document.getElementById("restartGameBtn").onclick = function() {
        document.getElementById("game").style.display = "block";
        document.getElementById("endScreen").style.display = "none";
        main();
    }

    // Add functionality to leaderboard button
    document.getElementById("leaderboardBtn").onclick = function() {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("leaderboard").style.display = "flex";
    }

    // Add functionality to the leaderboard back button
    document.getElementById("leaderboardBackBtn").onclick = function() {
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("leaderboard").style.display = "none";
    }
}


init()
