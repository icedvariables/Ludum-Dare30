var GameState = function(){
    this.playerSpeed = 300;
};

GameState.prototype = {
    preload:function(){
        this.load.spritesheet("player", "res/player.png", 64, 64);
        this.load.image("platform", "res/platform.png");
        this.load.image("background", "res/background.png");
    },
    
    create:function(){
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        var background = this.add.sprite(0, 0, "background");
        //background.body.immovable = true;
        
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        
        var platform = this.platforms.create(0, this.world.height - 10, "platform");
        platform.scale.setTo(this.world.width, 1);
        platform.body.immovable = true;
    
        this.player = this.add.sprite(0, 0, "player");
        this.physics.arcade.enable(this.player);
        
        this.player.scale.setTo(2, 2);
        
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.physics.arcade.enable(this.player);
        this.player.collideWorldBounds = true;
        
        this.player.animations.add("left", [0, 1, 2], 10, true);
        this.player.animations.add("right", [4, 5, 6], 10, true);
        
        this.player.play("still");
        
        this.cursors = this.input.keyboard.createCursorKeys();
    },
    
    update:function(){
        this.physics.arcade.collide(this.player, this.platforms);
        
        this.player.body.velocity.x = 0;
 
        if(this.cursors.left.isDown){
            this.player.body.velocity.x = -this.playerSpeed;
     
            this.player.animations.play("left");
        }
        else if(this.cursors.right.isDown){
            this.player.body.velocity.x = this.playerSpeed;
     
            this.player.animations.play("right");
        }
        else{
            this.player.animations.stop();
     
            this.player.frame = 3;
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.body.velocity.y = -350;
        }
    }
};