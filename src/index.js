import Phaser from "phaser";
import logoImg from "./assets/logo.png";

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image("logo", logoImg);

        // this.load.image("sky", "assets/sky.png");
        // this.load.image("ground", "assets/ground.png");
        // this.load.image("star", "assets/star.png");
        // this.load.image("bomb", "assets/bomb.png");
        // this.load.spritsheet("dude", "assets/dude.png", {
        //     frameWidth: 32,
        //     frameHeight: 48,
        // });
    }

    create() {
        const logo = this.add.image(400, 150, "logo");

        // this.add.image(400, 300, "sky");

        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1,
        });
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
