function main() {
    // Declare some important variables
    let canvas = document.getElementById("game");
    let ctx = canvas.getContext("2d");
    let player = new Player();
    let hearts = [new Heart(0), new Heart(1), new Heart(2)];
    let heartIndex = 0;
    let drinks = [];
    let score = 0;
    let speed = 10;
    let height = null;
    let gameOver = false;
    let playerSick = false;
    let waterToDrink = null;

    // Activate the sound class
    let sound = new Sound();

    // Activate the event handler
    eventHandler(player);

    // Generate the first drink wave
    drinks = generateDrinks(speed);

    // Save some information for the waves
    height = drinks[0].y;

    // Some variables for delta time
    const perfectFrameTime = 1000 / 40;
    let deltaTime = 0;
    let lastTimestamp = 0;

    // Start the main game loop
    window.requestAnimationFrame(gameLoop);
    function gameLoop(timestamp) {
        if (lastTimestamp == 0) {
            deltaTime = 0;
        } else {
            deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
        }
        lastTimestamp = timestamp;

        draw();
        update(deltaTime);

        if (!gameOver) {
            window.requestAnimationFrame(gameLoop);
        }
    }

    function draw() {
        // Draw the background
        let ratio = window.innerHeight/images["bg"].height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
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
        ctx.font = "160% Arial";
        ctx.fillStyle = "#eee";
        ctx.fillText("Score: " + String(score), 10, 30);
    }

    function update(dt) {
        if (window.innerHeight > window.innerWidth) {
            // Update the drink position
            let updatedDrinks = [];
            drinks.forEach(drink => {
                drink.update(dt);
                if (!drink.collisionCheck(player)) {
                    updatedDrinks.push(drink);
                }
                else {
                    if (drink.constructor.name == "Shot") {
                        if (!playerSick) {
                            score += 100;
                            sound.score();
                        } else {
                            heartIndex = 3;
                            sound.damage();
                        }
                    }
                    else if (drink.constructor.name == "Water") {
                        if (!playerSick) {
                            hearts[heartIndex].changeStatus();
                            heartIndex += 1;
                            sound.damage();
                            navigator.vibrate(200);
                        } else {
                            waterToDrink -= 1;
                            if (waterToDrink == 0) {
                                playerSick = false;
                                player.image = images["player"];
                            }
                            sound.water();
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
                            sound.damage();
                        }       
                    }
                }
            });
            height += speed * dt;
            drinks = updatedDrinks;

            // Check if drinks are below the screen
            if (height > 1000) {
                drinks = generateDrinks(speed);
                height = drinks[0].y;
                speed += 0.5;
            }

            // Check if the game is over
            if (heartIndex == 3) {
                gameOver = true;
                document.getElementById("game").style.display = "none";
                $("#endScreen").hide().fadeIn(fadeSpeed);
                $("#endScreen").css("display", "flex");
                document.getElementById("scoreText").innerHTML = "Dein Score: " + String(score);
                
                // Get score and rank it in leaderboard
                let scoreIndex = null;
                for (i=1; i<=10; i++) {
                    if (score > jsonData[i][1]) {
                        scoreIndex = i;
                        break;
                    }
                }
                if (scoreIndex) {
                    for (i=10; i>=scoreIndex; i--) {
                        if (i != scoreIndex) {
                            jsonData[i] = jsonData[i-1];
                        }
                        else {
                            let name = document.getElementById("usernameInput").value;
                            jsonData[i] = [name, score];
                        }
                    }
                }

                jsonData["gamesPlayed"] += 1;

                // Save in local storage if user already visited the website
                if (!window.localStorage.getItem("visited")) {
                    window.localStorage.setItem("visited", "true");
                    jsonData["userCount"] += 1;
                }

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

