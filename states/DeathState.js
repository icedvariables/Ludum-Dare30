var DeathState = function(){
};

DeathState.prototype = {
    preload:function(){
        this.load.image("death screen", "res/textures/death.png");
    },
    
    create:function(){
        var deathScreen = this.add.sprite(0, 0, "death screen");
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR, true);
        
        this.info = infoForDeathState;
        
        var style = {font:"20px Arial", fill:"#00aa00", align:"center"};
        
        if(this.info.monstersKilled > 1){
            var text = "You killed "+this.info.monstersKilled+" monsters...";
            var xPos = WIDTH / 2 - 100;
        }else if(this.info.monstersKilled === 1){
            var text = "You killed a single monster...";
            var xPos = WIDTH / 2 - 115;
        }else if(this.info.monstersKilled === 0){
            var text = "You couldn't kill a single monster...";
            var xPos = WIDTH / 2 - 150;
        }

        var t = this.add.text(xPos, 400, text, style);
        
        game.stage.backgroundColor = "#2d5968";
    },
    
    update:function(){
        if(this.spaceKey.isDown){
            game.state.start("main game");
        }
    }
}