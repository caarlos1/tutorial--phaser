import Phaser from "phaser";

import { skyImg, groundImg, starImg, bombImg, dudeImg } from "./assets";

class MyGame extends Phaser.Scene {
    platforms;
    player;
    cursors;

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
        this.add.image(0, 0, "sky").setOrigin(0, 0);

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        this.player = this.physics.add.sprite(100, 450, "dude");

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // this.player.setGravityY(300);

        this.physics.add.collider(this.player, this.platforms);

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

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
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

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
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
