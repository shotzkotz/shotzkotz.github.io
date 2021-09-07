function main() {
    // Make sure json data is not a string
    if (typeof(jsonData) == "string") {
        jsonData = JSON.parse(jsonData);
    }

    // Save game variables
    let gameInfo = {
        "speed": 7,
        "speedMax": 16,
        "speedIncr": 0.5,
        "gameOver": false,
        "heartIndex": 2,
        "playerSick": false,
        "waterToDrink": null,
    }

    // Add margin to hearts and score text
    let margin = 12;
    $("#canvasScore").css("top", margin);
    $("#canvasScore").css("left", margin);

    // Create player, heart and drink instances
    let player = new Player();
    let hearts = [new Heart(0, margin), new Heart(1, margin), new Heart(2, margin)];
    let drinks = generateDrinks(gameInfo["speed"]);

    // Save height of the drinks
    let drinkHeight = drinks[0].y;

    // (High-)score variables
    let scoreElement = $("#canvasScore");
    let score = 0;
    let prevScore = 0;
    let highscore = jsonData["highscore"];

    // Activate the event handler
    eventHandler(player);

    // Delta time variables
    const fps = 50;
    const perfectFrameTime = 1000 / fps;
    let deltaTime = 0;
    let lastTimestamp = 0;

    // Fade transition variables
    let fadeComplete = false;
    let transitionState = "in";
    let alpha = 0;
    let fadeSpeed = 1/(fps*(transitionSpeed/1000));

    // Variables for background positioning
    let ratio = vh/images["bg"].height;
    let dxBg = -(images["bg"].width*ratio)/2+vw/2;
    let dWidthBg = images["bg"].width*ratio;

    // Variables for virbating
    let vibratePossible = navigator.vibrate;
    let vibrateDuration = 100;


    function gameLoop(timestamp) {
        // Update delta time variables
        if (lastTimestamp == 0) {
            deltaTime = 0;
        } else {
            deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
        }
        lastTimestamp = timestamp;

        // Call the draw() and update() functions
        draw();
        if (fadeComplete && !gameInfo["gameOver"] && vh > vw) {
            update();
        }

        // Request a new frame
        if (!gameInfo["gameOver"] || alpha > 0) {
            window.requestAnimationFrame(gameLoop);
        }

        // Check if game is over and transition is complete
        if (gameInfo["gameOver"] && transitionState == "out" && alpha == 0) {
            gameOver();
        }
    }
    window.requestAnimationFrame(gameLoop);

    function draw() {
        ctx.clearRect(0, 0, vw, vh);
        ctx.globalAlpha = alpha;

        // Draw the background
        ctx.drawImage(images["bg"], dxBg, 0, dWidthBg, vh);
    
        // Draw the hearts
        hearts.forEach(heart => {
            heart.draw();
        });

        // Draw the drinks
        drinks.forEach(drink => {
            drink.draw();
        });

        // Draw the player
        player.draw();

        // Draw the score
        if (alpha < 1) {
            scoreElement.css("display", "block");
            scoreElement.css("opacity", alpha);
        }

        // Update transition variables
        alpha += fadeSpeed;
        if (alpha >= 1 && transitionState == "in") {
            alpha = 1;
            fadeComplete = true;
        } 
        else if (alpha <= 0 && transitionState == "out") {
            alpha = 0;
            fadeComplete = true;
        }
    }

    function update() {
        // Update the drinks and check for collision
        let updatedDrinks = [];
        drinks.forEach(drink => {
            drink.update(deltaTime);
            if (!drink.collisionCheck(player)) {
                updatedDrinks.push(drink);
            }
            else {
                if (drink.constructor.name == "Shot")
                    !gameInfo["playerSick"] ? score += 1 : gameInfo["heartIndex"] = 3;
    
                else if (drink.constructor.name == "Water") {
                    if (!gameInfo["playerSick"]) {
                        hearts[gameInfo["heartIndex"]].changeStatus();
                        gameInfo["heartIndex"] += 1;
                        if (vibratePossible)
                            navigator.vibrate(vibrateDuration);
                    } else {
                        gameInfo["waterToDrink"] -= 1;
                        if (gameInfo["waterToDrink"] == 0) {
                            gameInfo["playerSick"] = false;
                            player.image = images["player"];
                        }
                    }
                }

                else if (drink.constructor.name == "DeadlyShot") {
                    if (!gameInfo["playerSick"]) {
                        score += 5;
                        player.image = images["playerSick"];
                        gameInfo["playerSick"] = true;
                        gameInfo["waterToDrink"] = Math.floor(Math.random() * (5 - 2 + 1) ) + 2;
                    } else {
                        gameInfo["heartIndex"] = 3;
                    }       
                }
            }
        });
        drinkHeight += gameInfo["speed"] * deltaTime;
        drinks = updatedDrinks;

        // Update the score
        if (score != prevScore) {
            prevScore = score;
            $("#canvasScore").text("Score: " + score);
        }

        // Check if drinks are below the screen
        if (drinkHeight > 900) {
            drinks = generateDrinks(gameInfo["speed"]);
            drinkHeight = drinks[0].y;
            if (gameInfo["speed"] < gameInfo["speedMax"]) {
                gameInfo["speed"] += gameInfo["speedIncr"];
            }     
        }

        // Check if the game is over
        if (gameInfo["heartIndex"] == 3) {
            if (navigator.vibrate)
                navigator.vibrate(vibrateDuration*4);

            gameInfo["gameOver"] = true;
            fadeComplete = false;
            transitionState = "out";
            fadeSpeed = -fadeSpeed;
        }
    }

    function gameOver() {
        // Hide the score element
        scoreElement.css("display", "none");
        scoreElement.text("Score: 0");
    
        // Fade in end screen
        canvas.css("display", "none");
        $("#endScreen").css("display", "flex");
        $("#endScreen").hide().fadeIn(transitionSpeed);

        // Update score
        $("#scoreText").text("Dein Score: " + String(score));

        // Save new highscore if beaten
        if (score > highscore) {
            jsonData["highscore"] = score;
            document.getElementById("highscoreTxt").innerHTML = "Highscore: " + score;
            $("#newHighscoreTxt").css("display", "block");
        } else {
            $("#newHighscoreTxt").css("display",  "none");
        }

        // Update the json file
        jsonData = JSON.stringify(jsonData);
        let req = new XMLHttpRequest();
        req.open("PUT", urlJSON.slice(0, urlJSON.length-7), true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(jsonData);
    }
}


function generateDrinks(speed) { 
    let drinks = [];

    while (true) {
        for (i = 0; i < 3; i++) {
            let random = Math.floor(Math.random() * 10);
            if (random <= 4) {
                drinks.push(new Water(i, speed));
            }
            else if (random > 4 && random <= 8) {
                drinks.push(new Shot(i, speed));
            }
            else if (random == 9) {
                drinks.push(new DeadlyShot(i, speed));
            }
        }

        if (checkDrinks(drinks)) {
            drinks = [];
            continue;
        }
        break;
    }
    return drinks;

    // Check the pattern of the drinks
    function checkDrinks(drinks) {
        let waterCount = 0;
        let shotCount = 0;

        drinks.forEach(drink => {
            if (drink instanceof Water) {
                waterCount += 1;
            }
            if (drink instanceof Shot || drink instanceof DeadlyShot) {
                shotCount += 1;
            }
        });

        if (shotCount == 3 || waterCount == 3) {
            return true;
        }
        return false;
    }
}
