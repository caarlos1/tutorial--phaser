import Phaser from "phaser";

import { skyImg, groundImg, starImg, bombImg, dudeImg } from "./assets";

class MyGame extends Phaser.Scene {
    platforms;
    player;
    cursors;
    stars;
    bombs;
    score = 0;
    scoreText;
    gameOver = false;

    constructor() {
        super();
    }

    preload() {
        this.load.image("sky", skyImg);
        this.load.image("ground", groundImg);
        this.load.image("star", starImg);
        this.load.image("bomb", bombImg);
        this.load.spritesheet("dude", dudeImg, {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        // Animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // Scene
        this.add.image(0, 0, "sky").setOrigin(0, 0);
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        // Player
        this.player = this.physics.add.sprite(100, 450, "dude");

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        // Cursor
        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: {
                x: 12,
                y: 0,
                stepX: 70,
            },
        });

        // Stars
        this.stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);

        // Bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);

        const hitBomb = (player) => {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play("turn");
            this.gameOver = true;
        };

        this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

        // Score
        const collectStar = (player, star) => {
            star.disableBody(true, true);

            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);

            if (this.stars.countActive(true) === 0)
                this.stars.children.iterate((child) => {
                    child.enableBody(true, child.x, true, true);
                });

            const x =
                player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        };

        this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            fill: "#000",
        });

        this.physics.add.overlap(
            this.player,
            this.stars,
            collectStar,
            null,
            this
        );
    }

    update() {
        if (this.gameOver) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else if (this.player.body.touching.down || this.cursors.down.isDown) {
            this.player.setVelocityX(0);
            this.player.anims.play("turn", true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
            this.player.setVelocityY(-330);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: MyGame,
};

const game = new Phaser.Game(config);
