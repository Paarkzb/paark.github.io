class Player {
    constructor(id) {
        this.id = id;
    }

    create(id) {
        return new Player(id);
    }

    updateOnInput() {}

    draw() {
        ctx.beginPath();
        ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.updateOnInput();
        this.draw();
    }
}
