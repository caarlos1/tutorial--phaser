import Phaser from "phaser";

import { skyImg, groundImg, starImg, bombImg, dudeImg } from "./assets";

class MyGame extends Phaser.Scene {
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
        this.add.image(400, 300, "star");
    }
}

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 600,
    scene: MyGame,
};

const game = new Phaser.Game(config);
