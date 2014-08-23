var DeathState = function(){
};

DeathState.prototype = {
    preload:function(){
        this.load.image("death screen", "res/textures/death.png");
    },
    
    create:function(){
        var deathScreen = this.add.sprite(0, 0, "death screen");
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR, true);
        
        game.stage.backgroundColor = "#2d5968";
    },
    
    update:function(){
        if(this.spaceKey.isDown){
            game.state.start("main game");
        }
    }
}