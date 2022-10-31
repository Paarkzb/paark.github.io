let timer = 100;
let timerId;

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
            rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
            rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
            rectangle2.attackBox.position.y &&
        rectangle1.attackBox.position.y <=
            rectangle2.attackBox.position.y + rectangle2.attackBox.height
    );
}

function determinateWinner({ player, enemy }) {
    clearTimeout(timerId);
    document.getElementById("displayText").style.display = "flex";

    if (player.health === enemy.health) {
        document.getElementById("displayText").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
        document.getElementById("displayText").innerHTML = "Player 1 Wins";
    } else if (player.health < enemy.health) {
        document.getElementById("displayText").innerHTML = "Player 2 Wins";
    }
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById("timer").innerHTML = timer;
    }

    if (timer === 0) {
        determinateWinner({ player, enemy, timerId });
    }
}
