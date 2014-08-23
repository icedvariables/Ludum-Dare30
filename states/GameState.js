var GameState = function(){
    this.playerSpeed = 300;
    this.aliensKilled = 0;
    this.nextFire = 0;
    this.fireRate = 200;
    this.health = 100;
};

GameState.prototype = {
    preload:function(){
        this.load.spritesheet("player", "res/player.png", 64, 64);
        this.load.image("platform", "res/platform.png");
        this.load.image("background", "res/background.png");
        this.load.image("portal", "res/portal.png");
        this.load.image("bullet", "res/bullet.png");
    },
    
    create:function(){
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.world.setBounds(0, 0, 1000, 1000);
         
         // BACKGROUND
        var background = this.add.sprite(0, 0, "background");
        background.fixedToCamera = true;
        
        // PLATFORMS
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        
        var platform = this.platforms.create(500, game.world.height / 2, "platform");
        platform.scale.setTo(30, 1);
        platform.body.immovable = true;
        
        platform = this.platforms.create(100, game.world.height / 2 + 200, "platform");
        platform.scale.setTo(40, 1);
        platform.body.immovable = true;
        
        platform = this.platforms.create(600, game.world.height - 100, "platform");
        platform.scale.setTo(25, 1);
        platform.body.immovable = true;
        
        // PORTAL
        this.portal = this.add.sprite(this.world.width / 2, this.world.height / 2 - 400, "portal");
    
        // PLAYER
        this.player = this.add.sprite(this.world.width / 2, this.world.height / 2 - 200, "player");
        this.physics.arcade.enable(this.player);
        
        this.player.scale.setTo(2, 2);
        
        this.player.body.bounce.y = 0.15;
        this.player.body.gravity.y = 500;
        this.physics.arcade.enable(this.player);
        this.player.collideWorldBounds = true;
        
        this.player.animations.add("left", [0, 1, 2], 10, true);
        this.player.animations.add("right", [4, 5, 6], 10, true);
        
        // BULLETS
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, "bullet");
        this.bullets.setAll("checkWorldBounds", true);
        this.bullets.setAll("outOfBoundsKill", true);
        
        // HUD
        var style = {font:"12px Arial", fill:"#ff0044", align:"center"};
        this.hudText = this.add.text(WIDTH - 100, HEIGHT - 50, "Aliens killed: "+this.aliensKilled+"\nHealth: "+this.health, style);
        this.hudText.fixedToCamera = true;
        
        // CURSORS
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // CAMERA
        this.camera.follow(this.player);
    },
    
    update:function(){
        this.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.overlap(this.platforms, this.bullets,
        function(platform, bullet){
            bullet.kill();
        }, null, this);
        
        this.hudText.text = "Aliens killed: "+this.aliensKilled+"\nHealth: "+this.health;
        
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
            this.player.body.velocity.y = -500;
        }
        
        if(game.input.activePointer.isDown){
            this.shoot();
        }
    },
    
    shoot:function(){
        if(game.time.now > this.nextFire && this.bullets.countDead() > 0){
            this.nextFire = game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.player.x + 64, this.player.y + 64);
            game.physics.arcade.moveToPointer(bullet, 300);
        }
    },
    
    spawnAlien:function(texture){
        this.aliens.create(this.portal.x + Math.floor((Math.random() * this.portal.body.width) + 1), this.portal.x + Math.floor((Math.random() * this.portal.body.height) + 1), texture);
    }
};