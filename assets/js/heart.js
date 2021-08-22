class Heart {
    constructor(num) {
        this.image = images["heart"];

        let scale = window.innerWidth/3500;
        this.sizeWidth = this.image.width * scale;
        this.sizeHeight = this.image.height * scale;

        let margin = 15;
        let space = 3;
        this.x = window.innerWidth - 3*this.sizeWidth + num*(this.sizeWidth + space) - margin - space;
        this.y = margin;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.sizeWidth, this.sizeHeight);
    }

    changeStatus() {
        this.image = images["emptyHeart"];
    }
}
