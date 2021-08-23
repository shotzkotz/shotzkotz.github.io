class Sound {
    constructor() {
        let damageSound = new Audio("assets/audio/damage.wav");
        let scoreSound = new Audio("assets/audio/score.wav");
        let waterSound = new Audio("assets/audio/water.wav");
        this.sounds = {
            "damageSound": damageSound,
            "scoreSound": scoreSound,
            "waterSound": waterSound
        };
        this.setVolume(1);
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