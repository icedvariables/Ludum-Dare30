var GameState = function(){
};

GameState.prototype = {
    preload:function(){
        game.load.spritesheet("player", "res/player.png", 64, 64);
        game.load.image("background", "res/background.png");
    },
    
    create:function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var background = this.add.sprite(0, 0, "background");
        background.immovable = true;
    
        this.player = this.add.sprite(0, 0, "player");
        this.player.scale.setTo(2, 2);
        game.physics.arcade.enable(this.player);
        this.player.collideWorldBounds = true;
        this.player.animations.add("left", [0, 1, 2], 10, true);
        this.player.animations.add("still", [3], true);
        this.player.animations.add("right", [4, 5, 6], 10, true);
        
        this.player.play("still");
    },
    
    update:function(){
    
    }
};