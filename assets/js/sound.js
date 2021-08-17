class Sound {
    constructor() {
        this.damageSound = new Audio("assets/audio/damage.wav");
        this.scoreSound = new Audio("assets/audio/score.mp3");
        this.waterSound = new Audio("assets/audio/water.mp3");
    }

    damage() {
        this.damageSound.currentTime = 0;
        this.damageSound.play();
    }

    score() {
        this.scoreSound.currentTime = 0;
        this.scoreSound.play();
    }

    water() {
        this.waterSound.currentTime = 0;
        this.waterSound.play();
    }
}