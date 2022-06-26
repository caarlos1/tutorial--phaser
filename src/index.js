import Phaser from "phaser";

import PlayScene from "./scenes/PlayScene";
import PreloadScene from "./scenes/PreloadScene";

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: [PreloadScene, PlayScene],
};

const game = new Phaser.Game(config);
