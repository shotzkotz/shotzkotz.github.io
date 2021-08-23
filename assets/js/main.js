function main() {
    // Declare some important variables
    let canvas = document.getElementById("game");
    let ctx = canvas.getContext("2d");
    let player = new Player();
    let hearts = [new Heart(0), new Heart(1), new Heart(2)];
    let heartIndex = 0;
    let score = 0;
    let speed = 8;
    let speedMax = 16;
    let speedIncr = 0.3;
    let gameOver = false;
    let playerSick = false;
    let waterToDrink = null;
    let vibrateDuration = 100;
    let alpha = 0;
    let transitionSpeed = 0.02;

    // Make sure json data is not a string
    if (typeof(jsonData) == "string") {
        jsonData = JSON.parse(jsonData);
    }

    // Fetch the highscore
    let highscore = jsonData["highscore"];

    // Activate the event handler
    eventHandler(player);

    // Generate the first drink wave
    let drinks = generateDrinks(speed);

    // Save some information for the waves
    let height = drinks[0].y;

    // Some variables for delta time
    const perfectFrameTime = 1000 / 40;
    let deltaTime = 0;
    let lastTimestamp = 0;

    // Start the main game loop
    window.requestAnimationFrame(gameLoop);
    function gameLoop(timestamp) {
        // Update delta time variables
        if (lastTimestamp == 0) {
            deltaTime = 0;
        }
        else {
            deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
        }
        lastTimestamp = timestamp;

        // Upadte the alpha for transitions
        if (alpha < 1 && !gameOver) {
            alpha += transitionSpeed;
        }
        else if (!gameOver) {
            alpha = 1;
        }

        // Draw & update the game components
        draw();
        if (alpha == 1) {
            update(deltaTime);
        }

        // Continue the game unitl it is over
        if (!gameOver) {
            window.requestAnimationFrame(gameLoop);
        }
    }

    function draw() {
        // Make a transition
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = alpha;

        // Draw the background
        let ratio = window.innerHeight/images["bg"].height;
        ctx.drawImage(images["bg"], -(images["bg"].width*ratio)/2+window.innerWidth/2, 0, images["bg"].width*ratio, window.innerHeight);

        // Draw the drinks
        drinks.forEach(drink => {
            drink.draw(ctx);
        });

        // Draw the player
        player.draw(ctx);

        // Draw the hearts
        hearts.forEach(heart => {
            heart.draw(ctx);
        });

        // Draw the score
        document.getElementById("canvasScore").style.display = "block";
        document.getElementById("canvasScore").style.opacity = alpha;
    }

    function update(dt) {
        // Only update the game when the device is in portrait mode
        if (window.innerHeight > window.innerWidth) {
            // Update the drink position
            let updatedDrinks = [];
            drinks.forEach(drink => {
                drink.update(dt);
                if (!drink.collisionCheck(player)) {
                    updatedDrinks.push(drink);
                }
                else {
                    // Check which drink hit the player
                    if (drink.constructor.name == "Shot") {
                        if (!playerSick) {
                            score += 500;
                        } else {
                            heartIndex = 3;
                        }
                    }
                    else if (drink.constructor.name == "Water") {
                        if (!playerSick) {
                            hearts[heartIndex].changeStatus();
                            heartIndex += 1;
                            navigator.vibrate(vibrateDuration);
                        } else {
                            waterToDrink -= 1;
                            if (waterToDrink == 0) {
                                playerSick = false;
                                player.image = images["player"];
                            }
                        }
                    }
                    else if (drink.constructor.name == "DeadlyShot") {
                        if (!playerSick) {
                            score += 5;
                            player.image = images["playerSick"];
                            playerSick = true;
                            waterToDrink = Math.floor(Math.random() * (5 - 2 + 1) ) + 2;
                        } else {
                            heartIndex = 3;
                        }       
                    }
                }
            });

            // Update the score
            document.getElementById("canvasScore").innerHTML = "Score: " + score;

            // Update the position of the drinks and the drinks itself
            height += speed * dt;
            drinks = updatedDrinks;

            // Check if drinks are below the screen
            if (height > 1000) {
                drinks = generateDrinks(speed);
                height = drinks[0].y;
                if (speed < speedMax) {
                    speed += speedIncr;
                }     
            }

            // Check if the game is over
            if (heartIndex == 3) {
                gameOver = true;
                navigator.vibrate(vibrateDuration*4);

                // Hide and reset score text
                document.getElementById("canvasScore").innerHTML = "Score: 0";
                document.getElementById("canvasScore").style.display = "none";

                // Fade in the endscreen
                document.getElementById("game").style.display = "none";
                $("#endScreen").hide().fadeIn(fadeSpeed);
                $("#endScreen").css("display", "flex");
                document.getElementById("scoreText").innerHTML = "Dein Score: " + String(score);

                // Save new highscore if beaten
                if (score > highscore) {
                    jsonData["highscore"] = score;
                    $("#newHighscoreTxt").css("display", "block");
                } else {
                    $("#newHighscoreTxt").css("display",  "none");
                }

                // Update the highscore element
                document.getElementById("highscoreTxt").innerHTML = "Highscore: " + highscore;

                // Update the json file
                jsonData = JSON.stringify(jsonData);
                let req = new XMLHttpRequest();
                req.open("PUT", urlJSON.slice(0, urlJSON.length-7), true);
                req.setRequestHeader("Content-Type", "application/json");
                req.send(jsonData);
            }
        }   
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
