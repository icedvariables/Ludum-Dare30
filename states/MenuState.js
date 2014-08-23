var MenuState = function(){
};

MenuState.prototype = {
    preload:function(){
        this.load.image("logo", "res/logo.png");
    },
    
    create:function(){
        this.logo = this.add.sprite(0, 0, "logo");
        
        this.t = game.time.now;
        
        var style = {font:"20px Arial", fill:"#ff0044", align:"center"};
        this.playText = this.add.text(WIDTH / 2 - 100, HEIGHT / 2 + 100, "Press space to play...", style);
        this.input.keyboard.onDownCallback = this.keyPress;
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR, true);
    },
    
    update:function(){
        if(game.time.now > this.t){
            this.playText.visible = !this.playText.visible;
            this.t = game.time.now + 500;
        }
        
        if(this.spaceKey.isDown){
            this.playGame();
        }
    },
    
    playGame:function(){
        // probably play a sound or something here...
        
        console.log("play");
        
        this.input.keyboard.onDownCallback = null;
        
        game.state.start("main game");
    }
};