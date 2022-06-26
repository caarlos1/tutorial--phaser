import Phaser from "phaser";
class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");

        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.stars = null;
        this.bombs = null;
        this.score = 0;
        this.scoreText = null;
    }

    create() {
        this.createBG();
        this.createAnims();
        this.createPlatforms();
        this.createPlayer();
        this.createStars();
        this.createBombs();
        this.createColliders();
        this.createCursors();
        this.createScore();
    }

    update() {
        this.checkControls();
    }

    createBG() {
        this.add.image(0, 0, "sky").setOrigin(0, 0);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    }

    createStars() {
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: {
                x: 12,
                y: 0,
                stepX: 70,
            },
        });

        this.stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }

    createBombs() {
        this.bombs = this.physics.add.group();
    }

    createColliders() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.hitBomb,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        );
    }

    createCursors() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createScore() {
        this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            fill: "#000",
            fontStyle: "bold",
        });
    }

    createAnims() {
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
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.incremmentScore();
        this.createBomb(player);
        this.resetStarsAndBombs();
    }

    resetStarsAndBombs() {
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            this.bombs.clear(true);
        }
    }

    createBomb(player) {
        const x =
            player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

        const bomb = this.bombs.create(x, 16, "bomb");

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

    incremmentScore() {
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    hitBomb(player) {
        this.physics.pause();

        player.setTint(0xff0000);
        player.anims.play("turn");

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false,
        });
    }

    checkControls() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else if (this.player.body.touching.down || this.cursors.down.isDown) {
            this.player.anims.play("turn", true);
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
            this.player.setVelocityY(-330);
    }
}

export default PlayScene;
