const images = {}
const urlJSON = "https://api.jsonbin.io/b/611cd3c2076a223676ad460e" + "/latest";
const fadeSpeed = 180;
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
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.innerHTML = i;
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = data[i][0].trim().replace(/\s\s+/g, ' ');
            td.style.textTransform = "capitalize";
            if (td.innerHTML == "") {
                td.innerHTML = "<i>Anonymous</i>";
            }
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = data[i][1];
            tr.appendChild(td);
            document.getElementById("highscoreData").appendChild(tr);
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
            $("#startScreen").fadeOut(fadeSpeed);
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
        $("#startScreen").fadeOut(fadeSpeed).promise().done(function() {
            $("#leaderboard").css("display", "flex");
            $("#leaderboard").hide().fadeIn(fadeSpeed);
        });
    }

    // Add functionality to the leaderboard back button
    document.getElementById("leaderboardBackBtn").onclick = function() {
        $("#leaderboard").fadeOut(fadeSpeed).promise().done(function() {
            $("#startScreen").hide().fadeIn(fadeSpeed);
        });
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
