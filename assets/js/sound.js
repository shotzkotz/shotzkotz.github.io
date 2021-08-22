class Sound {
    constructor() {
        this.sounds = {
            "damageSound": new Audio("assets/audio/damage.wav"),
            "scoreSound": new Audio("assets/audio/score.mp3"),
            "waterSound": new Audio("assets/audio/water.mp3")
        };
        this.setVolume(0);
    }

    damage() {
        this.sounds["damageSound"].currentTime = 0;
        this.sounds["damageSound"].play();
    }

    score() {
        this.sounds["scoreSound"].currentTime = 0;
        this.sounds["scoreSound"].play();
    }

    water() {
        this.sounds["waterSound"].currentTime = 0;
        this.sounds["waterSound"].play();
    }

    setVolume(volume) {
        for (const [key, value] of Object.entries(this.sounds)) {
            value.volume = volume;
        }
    }

}