var GameState = function(){
    this.playerSpeed = 300;
    this.nextFire = 0;
    this.fireRate = 200;
    this.lastEnemySpawn = 0;
    this.timeBetweenEnemySpawn = 10000;
    this.spawnEnemies = true;
    this.canShoot = true;
    this.info =/* I've got us some */new Info(); // ... Well I thought it was funny...
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
        this.load.image("hud", "res/hud.png");
        
        game.time.advancedTiming = true;
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
        platform.scale.setTo(40, 1);
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
        this.player.body.collideWorldBounds = true;
        
        this.player.animations.add("left", [0, 1, 2], 10, true);
        this.player.animations.add("right", [3, 4, 5], 10, true);
        
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
        
        // CURSORS
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // CAMERA
        this.camera.follow(this.player);
        
        // DEATH SCREEN
        this.deathScreen = this.add.sprite(0, 0, "death screen");
        this.deathScreen.fixedToCamera = true;
        this.deathScreen.visible = false;
        
        // HUD
        this.hud = this.add.sprite(0, HEIGHT - 50, "hud");
        this.hud.fixedToCamera = true;
        
        this.info.createText(this);
        
        this.nextEnemySpawnTime = this.time.now + 5000;
    },
    
    update:function(){
        // COLLISION
        this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.enemies, this.platforms);
        this.physics.arcade.overlap(this.platforms, this.bullets,
        function(platform, bullet){
            bullet.kill();
        }, null, this);
        
        this.physics.arcade.overlap(this.player, this.enemies,
        function(player, enemy){
            if(this.info.monstersKilled > 5){
                this.info.health -= this.info.monstersKilled / 5;
            }else{
                this.info.health -= 0.5;
            }
        }, null, this);
        
        this.physics.arcade.overlap(this.bullets, this.enemies,
        function(bullet, enemy){
            bullet.kill();
            enemy.destroy();
            ++this.info.monstersKilled;
            --this.info.aliveMonsters;
        }, null, this);
        
        // UPDATE HUD
        this.info.updateText();
        
        // INPUT/PLAYER MOVEMENT
        this.pollInput()
        
         // CHECK HEALTH
        if(this.info.health <= 0){
            this.deathScreen.visible = true;
            this.canShoot = false;
            this.player.destroy();
        }
        
        // SPAWN ENEMY
        this.tryToSpawnEnemies("enemy0");
        
        // MOVE ENEMIES
        this.enemies.forEach(this.moveEnemies, this);
        
        // DEBUG STUFF
        if(DEBUG){
            console.log("Time now: "+this.time.now);
            console.log("Next enemy spawn time: "+this.nextEnemySpawnTime);
            console.log("Number of alive enemies: "+this.enemies.length);
            
            // Don't know why but the 'game.'s below cannot be 'this.'s or it will break...
            game.debug.cameraInfo(this.camera, 32, 32);
            game.debug.spriteCoords(this.player, 32, 400);
            
            game.debug.text(game.time.fps, 2, 15, "#00ff00");
        }
    },
    
    shoot:function(){
        if(this.time.now > this.nextFire && this.bullets.countDead() > 0 && this.canShoot){
            this.nextFire = this.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            
            if(this.direction == "left"){
                bullet.reset(this.player.x + 20, this.player.y + 64);
            }else{
                bullet.reset(this.player.x + 100, this.player.y + 64);
            }
            this.physics.arcade.moveToPointer(bullet, 600);
        }
    },
    
    tryToSpawnEnemies:function(texture){
        if(this.time.now > this.nextEnemySpawnTime && this.enemies.length < 200 && this.spawnEnemies){
            var enemy = this.enemies.create(this.portal.body.x, this.portal.body.y, texture);
            this.physics.arcade.enable(enemy);
            enemy.body.bounce.y = 0.2;
            enemy.body.gravity.y = 500;
            
            enemy.animations.add("main", [0, 1, 2, 4], 1000, true);
            
            this.nextEnemySpawnTime = this.time.now + 3000;
            
            ++this.info.totalMonsters;
            ++this.info.aliveMonsters;
        }
    },
    
    moveEnemies:function(enemy){ 
        // called for each enemy
        
        if(enemy.body.x != this.player.body.x){
            if(enemy.body.x > this.player.body.x){ // right
                enemy.body.velocity.x = -200;
            }else{ // left
                enemy.body.velocity.x = 200;
            }
        }
        
        enemy.animations.play("main");
    },
    
    pollInput:function(){
        this.player.body.velocity.x = 0;
 
        if(this.cursors.left.isDown){
            this.player.body.velocity.x = -this.playerSpeed;
     
            this.player.animations.play("left");
            
            this.direction = "left";
        }
        else if(this.cursors.right.isDown){
            this.player.body.velocity.x = this.playerSpeed;
     
            this.player.animations.play("right");
            
            this.direction = "right";
        }
        else{
            this.player.animations.stop();
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.body.velocity.y = -500;
        }
        
        if(this.input.activePointer.isDown){
            this.shoot();
        }
    }
};