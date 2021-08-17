class Player {
    constructor() {
        this.image =  images["player"];

        this.xPositions = [
            window.innerWidth/2 - window.innerWidth/3,
            window.innerWidth/2,
            window.innerWidth/2 + window.innerWidth/3];
        this.currPos = 1;

        let scale = window.innerWidth / 1000;
        this.sizeWidth = this.image.width * scale;
        this.sizeHeight = this.image.height * scale;

        this.x = this.xPositions[this.currPos] - this.sizeWidth/2;
        this.y = window.innerHeight - this.sizeHeight - window.innerHeight/40;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.sizeWidth, this.sizeHeight);
    }

    move(direction) {
        if (direction == "left" && this.currPos > 0) {
            this.currPos -= 1;
        }
        else if (direction == "right" && this.currPos < 2) {
            this.currPos += 1;
        }
        this.x = this.xPositions[this.currPos] - this.sizeWidth/2;
    }
}
