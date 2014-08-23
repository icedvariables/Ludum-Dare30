var GameState = function(){
    this.playerSpeed = 300;
    this.aliensKilled = 0;
    this.nextFire = 0;
    this.fireRate = 200;
    this.health = 100;
    this.lastEnemySpawn = 0;
    this.timeBetweenEnemySpawn = 10000;
};

GameState.prototype = {
    preload:function(){
        this.load.spritesheet("player", "res/player.png", 64, 64);
        this.load.spritesheet("enemy0", "res/enemy0.png", 64, 64);
        
        this.load.image("platform", "res/platform.png");
        this.load.image("background", "res/background.png");
        this.load.image("portal", "res/portal.png");
        this.load.image("bullet", "res/bullet.png");
        this.load.image("death screen", "res/death.png");
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
        
        var platform = this.platforms.create(500, this.world.height / 2, "platform");
        platform.scale.setTo(30, 1);
        platform.body.immovable = true;
        
        platform = this.platforms.create(100, this.world.height / 2 + 200, "platform");
        platform.scale.setTo(40, 1);
        platform.body.immovable = true;
        
        platform = this.platforms.create(600, this.world.height - 100, "platform");
        platform.scale.setTo(25, 1);
        platform.body.immovable = true;
        
        // PORTAL
        this.portal = this.add.sprite(this.world.width / 2, this.world.height / 2 - 400, "portal");
        this.physics.arcade.enable(this.portal);
    
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
        
        // ENEMY
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        
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
        
        this.nextEnemySpawnTime = this.time.now + 1;
    },
    
    update:function(){
        this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.enemies, this.platforms);
        this.physics.arcade.overlap(this.platforms, this.bullets,
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
        
        if(this.input.activePointer.isDown){
            this.shoot();
        }
        
        if(this.health <= 0){
            var deathScreen = this.add.sprite(0, 0, "death screen");
            deathScreen.fixedToCamera = true;
        }
        
        this.tryToSpawnEnemy("enemy0");
        
        console.log("Time now: "+this.time.now);
        console.log("Next enemy spawn time: "+this.nextEnemySpawnTime);
    },
    
    shoot:function(){
        if(this.time.now > this.nextFire && this.bullets.countDead() > 0){
            this.nextFire = this.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.player.x + 64, this.player.y + 64);
            this.physics.arcade.moveToPointer(bullet, 300);
        }
    },
    
    tryToSpawnEnemy:function(texture){
        if(this.time.now > this.nextEnemySpawnTime){
            var enemy = this.enemies.create(this.portal.body.x, this.portal.body.y, texture);
            this.physics.arcade.enable(enemy);
            enemy.body.bounce.y = 0.2;
            enemy.body.gravity.y = 500;
            
            this.nextEnemySpawnTime = this.time.now + 3000;
        }
    }
};