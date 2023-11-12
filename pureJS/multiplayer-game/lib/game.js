const HashMap = require("hashmap");
const Player = require("Player");



class Game {
    constructor() {
        this.clients = new HashMap();
        this.players = new HashMap();
    }

    create() {
        return new Game();
    }

    getPlayers() {}

    addNewPlayer() {}

    removePlayer() {}

    updatePlayerOnInput(id, data) {}

    update() {}

    sendState() {}
}

module.exports = Game;
