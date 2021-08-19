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

    // Display username if already in local storage
    if (window.localStorage.getItem("name")) {
        document.getElementById("usernameInput").value = window.localStorage.getItem("name");
    }

    // Fetch highscore datd and display it
    $.getJSON(urlJSON, function(data) {
        jsonData = data;
        for (i = 1; i <= 10; i++) {
            let li = document.createElement("li");
            li.innerHTML = String(data[i][1]) + " (" + data[i][0].trim() + ")";
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
            $("#startScreen").fadeOut(250);
            document.getElementById("game").style.display = "block";

            // Save the username in locaol storage
            let name = document.getElementById("usernameInput").value;
            window.localStorage.setItem("name", name);

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
        $("#startScreen").fadeOut(250).promise().done(function() {
            $("#leaderboard").hide().fadeIn(250);
        });
    }

    // Add functionality to the leaderboard back button
    document.getElementById("leaderboardBackBtn").onclick = function() {
        $("#leaderboard").fadeOut(250).promise().done(function() {
            $("#startScreen").hide().fadeIn(250);
        });
    }
}


init()
