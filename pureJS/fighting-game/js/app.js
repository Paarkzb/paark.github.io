const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background.png",
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    frameMax: 6,
});

const player = new Fighter({
    position: {
        x: 100,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/samuraiMack/idle.png",
    frameMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            frameMax: 8,
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            frameMax: 8,
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            frameMax: 2,
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            frameMax: 2,
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            frameMax: 6,
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/Take hit - white silhouette.png",
            frameMax: 4,
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            frameMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50,
    },
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/kenji/Idle.png",
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            frameMax: 4,
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            frameMax: 8,
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            frameMax: 2,
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            frameMax: 2,
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            frameMax: 4,
        },
        takeHit: {
            imageSrc: "./img/kenji/Take hit.png",
            frameMax: 3,
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            frameMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
    },
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
};

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement
    if (keys.a.pressed && player.lastKey == "a") {
        player.switchSprite("run");
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey == "d") {
        player.switchSprite("run");
        player.velocity.x = 5;
    } else {
        player.switchSprite("idle");
    }

    // Jumping
    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
        enemy.switchSprite("run");
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
        enemy.switchSprite("run");
        enemy.velocity.x = 5;
    } else {
        enemy.switchSprite("idle");
    }

    // Jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    // Player attacking and enemy getting hit
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        player.isAttacking = false;
        enemy.takeHit();
        gsap.to("#enemyHealth", {
            width: enemy.health + "%",
        });
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        enemy.isAttacking = false;
        player.takeHit();
        gsap.to("#playerHealth", {
            width: player.health + "%",
        });
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // End game based on health
    if (player.health <= 0 || enemy.health <= 0) {
        determinateWinner({ player, enemy, timerId });
    }
}

decreaseTimer();
animate();

document.addEventListener("keydown", (event) => {
    if (!player.dead) {
        switch (event.key) {
            // Player keys
            case "d":
                keys.d.pressed = true;
                player.lastKey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                break;
            case "w":
                player.velocity.y = -20;
                break;
            case " ":
                player.attack();
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            // Enemy keys
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemy.velocity.y = -20;
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        // Player keys
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;

        // Enemy keys
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
});
