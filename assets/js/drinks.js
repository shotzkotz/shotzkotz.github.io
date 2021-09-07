class Drink {
    constructor(image, pos, speed) {
        this.image = image;

        this.xPositions = [
            window.innerWidth/2 - window.innerWidth/3,
            window.innerWidth/2,
            window.innerWidth/2 + window.innerWidth/3];

        let scale = window.innerWidth/2500;
        this.sizeWidth = this.image.width * scale;
        this.sizeHeight = this.image.height * scale;

        this.x = this.xPositions[pos] - this.sizeWidth/2;
        this.y = -200;

        this.speed = speed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.sizeWidth, this.sizeHeight);
    }

    update(dt) {
        this.y += this.speed * dt;
    }

    collisionCheck(player) {
        if (this.y + this.sizeHeight >= player.y && this.y <= player.y + player.sizeHeight &&
                this.x + this.sizeWidth >= player.x && this.x <= player.x + player.sizeWidth) {
            return true;
        }
        return false;
    }
}

class Water extends Drink {
    constructor(pos, speed) {
        super(images["water"], pos, speed);
    }
}

class Shot extends Drink {
    constructor(pos, speed) {
        super(images["shot"], pos, speed);
    }
}

class DeadlyShot extends Drink {
    constructor(pos, speed) {
        super(images["deadlyShot"], pos, speed);
    }
}
