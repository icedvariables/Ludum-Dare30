var GameState = function(){
    this.playerSpeed = 300;
    this.nextFire = 0;
    this.fireRate = 200;
    this.lastEnemySpawn = 0;
    this.timeBetweenEnemySpawn = 10000;
    this.spawnEnemies = true;
    this.canShoot = true;
    this.info =/* I've got us some */new Info(); // ... Well I thought it was funny...
    this.hasResetAmmo = true;
    this.godMode = false;
    this.godModeEndTime;
};

GameState.prototype = {
    preload:function(){
        this.load.spritesheet("player", "res/textures/player.png", 64, 64);
        this.load.spritesheet("enemy", "res/textures/enemy.png", 64, 32);
        
        this.load.image("platform", "res/textures/platform.png");
        this.load.image("background", "res/textures/background.png");
        this.load.image("portal", "res/textures/portal.png");
        this.load.image("bullet", "res/textures/bullet.png");
        this.load.image("hud", "res/textures/hud.png");
        
        this.load.audio("kill", "res/audio/kill.wav");
        this.load.audio("jump", "res/audio/jump.wav");
        this.load.audio("hurt", "res/audio/hurt.wav");
        
        game.time.advancedTiming = true;
    },
    
    create:function(){
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.world.setBounds(0, 0, 2000, 1000);
        
        // RESET INFO
        this.info.reset();
        this.canShoot = true;
         
         // BACKGROUND
        var background = this.add.sprite(0, 0, "background");
        background.fixedToCamera = true;
        
        // PLATFORMS
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        
        // platform farthest to the left
        var platform = this.platforms.create(50, this.world.height / 2, "platform");
        platform.scale.x = 100;
        platform.body.immovable = true;
        
        // second platform from the left
        platform = this.platforms.create(1200, this.world.height / 2 + 50, "platform");
        platform.scale.x = 30;
        platform.body.immovable = true;
        
        this.platform = this.platforms.create(1600, this.world.height - 300, "platform");
        this.platform.scale.x = 30;
        this.platform.body.immovable = true;
        
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
        
        // HUD
        this.hud = this.add.sprite(0, HEIGHT - 50, "hud");
        this.hud.fixedToCamera = true;
        
        this.info.createText(this);
        
        // RELOAD TIME
        this.reloadTime = this.time.now;
        
        // SOUND EFFECTS
        this.killSound = this.add.audio("kill");
        this.jumpSound = this.add.audio("jump");
        this.hurtSound = this.add.audio("hurt");
        
        // NEXT ENEMY SPAWN TIME
        this.nextEnemySpawnTime = this.time.now + 3000;
        
        // START TIME
        this.startTime = game.time.now;
        
        // SHOOT CALLBACK
        this.input.onDown.add(this.shoot, this);
        
        // DIFFICULTY TEXT
        var style = {font:"20px Arial", fill:"#000000", align:"center"};
        this.difficultyText = this.add.text(WIDTH - 250, 10, "Could do better in my sleep", style);
        this.difficultyText.fixedToCamera = true;
        
        // GOD MODE TEXT
        var style = {font:"25px Arial", fill:"#e7be1b", align:"center"};
        this.godModeText = this.add.text(WIDTH / 2 - 150, HEIGHT / 2 - 100, "", style);
        this.godModeText.fixedToCamera = true;
        this.godModeText.visible = false;
    },
    
    update:function(){
        // COLLISION
        this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.enemies, this.platforms);
        this.physics.arcade.overlap(this.platforms, this.bullets,
        function(platform, bullet){
            bullet.kill();
        }, null, this);
        
        if(!this.godMode){
            this.physics.arcade.overlap(this.player, this.enemies, // Player contacts Enemy
            function(player, enemy){
                if(this.info.monstersKilled > 5){
                    this.info.health -= this.info.monstersKilled / 5;
                }else{
                    this.info.health -= 0.5;
                }
                if(!this.hurtSound.isPlaying){
                    this.hurtSound.play();
                }
            }, null, this);
        }
        
        this.physics.arcade.overlap(this.bullets, this.enemies, // Bullets contacts Enemies
        function(bullet, enemy){
            bullet.kill();
            enemy.destroy();
            ++this.info.monstersKilled;
            --this.info.aliveMonsters;
            this.killSound.play();
        }, null, this);
        
        // STILL COLLISION
        
        if(this.godMode){
            this.physics.arcade.overlap(this.player, this.enemies, // Player contact Enemies (God Mode only)
            function(player, enemy){
                enemy.destroy();
                ++this.info.monstersKilled;
                --this.info.aliveMonsters;
                this.killSound.play();
        }, null, this);
        }
        
        // UPDATE HUD
        this.info.updateText();
        
        // INPUT/PLAYER MOVEMENT
        this.pollInput()
        
         // CHECK HEALTH
        if(this.info.health <= 0){
            this.canShoot = false;
            this.info.health = "DEAD";
            this.player.destroy();
            infoForDeathState = this.info;
            game.state.start("death screen");
        }
        
        // CHEKC AMMO
        if(this.info.ammo <= 0){
            this.reload();
        }
        
        // SPAWN ENEMY
        this.tryToSpawnEnemies("enemy");
        
        // MOVE ENEMIES
        this.enemies.forEach(this.moveEnemies, this);
        
        // GOD MODE
        if(this.godMode){
            if(this.time.now > this.godModeEndTime){
                this.godMode = false;
            }
            
            this.godModeText.visible = true;
            this.godModeText.text = "God Mode: "+(this.godModeEndTime - this.time.now)+"\nMonsters dissolve when touched\nJump in mid-air!"; 
        }else{
            this.godModeText.visible = false;
        }
        
        if(this.info.monstersKilled % 30 == 0 && this.info.monstersKilled !== 0){
            this.godMode = true;
            this.godModeEndTime = this.time.now + (this.info.monstersKilled * 100);
        }
        
        // DEBUG STUFF
        if(DEBUG){
            // Don't know why but the 'game.'s below cannot be 'this.'s or it will break...
            game.debug.spriteCoords(this.player, 32, 32);
            game.debug.spriteCoords(this.godModeText, 32, 300);
            
            game.debug.text(game.time.fps, 2, 15, "#00ff00");
        }
    },
    
    shoot:function(){
        if(this.time.now > this.nextFire && this.bullets.countDead() > 0 && this.canShoot && this.time.now > this.reloadTime){
            this.nextFire = this.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            
            if(this.direction == "left"){
                bullet.reset(this.player.x + 20, this.player.y + 64);
            }else{
                bullet.reset(this.player.x + 100, this.player.y + 64);
            }
            this.physics.arcade.moveToPointer(bullet, 600);
            
            --this.info.ammo;
        }
    },
    
    tryToSpawnEnemies:function(texture){
        if(this.time.now > this.nextEnemySpawnTime && this.enemies.length < 200 && this.spawnEnemies){
            var enemy = this.enemies.create(this.portal.body.x + Math.floor((Math.random() * 201)), this.portal.body.y + Math.floor((Math.random() * 201)), texture);
            this.physics.arcade.enable(enemy);
            enemy.body.bounce.y = 0.2;
            enemy.body.gravity.y = 500;
            
            enemy.scale.setTo(Math.floor((Math.random() * 2) + 2), Math.floor((Math.random() * 2) + 2));
            
            enemy.animations.add("left", [1, 3], 1000, true);
            enemy.animations.add("right", [0, 2], 1000, true);
            
            console.log(this.info.monstersKilled);
            if(this.info.monstersKilled < 20){
                this.nextEnemySpawnTime = game.time.now + 1000;
            }else if(this.info.monstersKilled < 60){
                this.nextEnemySpawnTime = game.time.now + 800;
            }else if(this.info.monstersKilled < 80){
                this.nextEnemySpawnTime = game.time.now + 600;
            }else if(this.info.monstersKilled < 100){
                this.nextEnemySpawnTime = game.time.now + 400;
            }else if(this.info.monstersKilled < 130){
                this.nextEnemySpawnTime = game.time.now + 300;
            }else if(this.info.monstersKilled < 150){
                this.nextEnemySpawnTime = game.time.now + 200;
            }else{
                this.nextEnemySpawnTime = game.time.now + 10;
            }
            
            ++this.info.totalMonsters;
            ++this.info.aliveMonsters;
        }
    },
    
    moveEnemies:function(enemy){ 
        // called for each enemy
        
        if(enemy.body.x > this.player.body.x){ // right
            enemy.body.velocity.x = -200;
            enemy.animations.play("right");
        }else{ // left
            enemy.body.velocity.x = 200;
            enemy.animations.play("left");
        }
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

        if (this.cursors.up.isDown){
            if(this.godMode){
                this.player.body.velocity.y = -500;
            }else if(this.player.body.touching.down){
                this.player.body.velocity.y = -500;
                this.jumpSound.play();
            }
        }
    },
    
    reload:function(){
        this.reloading = true;
        this.reloadTime = game.time.now + 2000;
        this.info.ammo = this.info.maxAmmo;
    }
};